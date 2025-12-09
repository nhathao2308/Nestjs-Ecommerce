import { Body, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { TokenService } from 'src/shared/services/token.service'
import { isNotFoundPrismaError, isUniqueConstrainPrismaError } from 'src/shared/helpers'
import { RoleService } from './role.service'
import { RegisterBodyDTO } from './auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
    private readonly tokenservice: TokenService,
    private readonly roleService: RoleService,
  ) {}

  async register(body: RegisterBodyDTO) {
    try {
      const roleId = await this.roleService.getRoleId()
      const hashedPassword = await this.hashingService.hash(body.password)
      const user = this.prismaService.user.create({
        data: {
          email: body.email,
          name: body.name,
          password: hashedPassword,
          phoneNumber: body.phoneNumber,
          roleId: roleId,
        },
      })
      return user
    } catch (error) {
      if (isUniqueConstrainPrismaError(error)) {
        throw new Error('Email already exists')
      }
      throw error
    }
  }

  async generateTokens(payload: { userId: string }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenservice.signAccessToken(payload),
      this.tokenservice.signRefreshToken(payload),
    ])

    const refreshTokenData = await this.tokenservice.verifyRefreshToken(refreshToken)

    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload.userId,
        expiredAt: new Date(refreshTokenData.exp * 1000),
      },
    })
    return { accessToken, refreshToken }
  }

  async Login(body: any) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    })

    if (!user) {
      throw new Error('User not exist')
    }

    const isPasswordMatch = await this.hashingService.compare(body.password, user.password)

    if (!isPasswordMatch) {
      throw new UnprocessableEntityException([
        {
          field: 'password',
          error: 'Password is incorrect',
        },
      ])
    }
    const token = await this.generateTokens({ userId: user.id })
    return token
  }

  async refreshToken(refreshToken: string) {
    try {
      const { userId } = await this.tokenservice.verifyRefreshToken(refreshToken)

      await this.prismaService.refreshToken.findUniqueOrThrow({
        where: {
          token: refreshToken,
        },
      })

      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      })

      return await this.generateTokens({ userId })
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new UnprocessableEntityException('Refresh has been revoked or does not exist')
      } else {
        throw new UnauthorizedException()
      }
    }
  }

  async Logout(refreshToken: string) {
    try {
      await this.tokenservice.verifyRefreshToken(refreshToken)

      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      })

      return { message: 'Logout successful' }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new UnprocessableEntityException('RefreshToken invalid')
      } else {
        throw new UnauthorizedException()
      }
    }
  }
}
