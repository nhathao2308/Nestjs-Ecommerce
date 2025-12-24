import { Body, Injectable, UnprocessableEntityException } from '@nestjs/common'
import { HashingService } from 'src/shared/services/hashing.service'
import { TokenService } from 'src/shared/services/token.service'
import { generateOTP, isUniqueConstrainPrismaError } from 'src/shared/helpers'
import { RoleService } from './role.service'
import { RegisterBodyType, SendOTPBodyType } from './auth.model'
import { AuthRepository } from './auth.repo'
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repository'
import { addMilliseconds } from 'date-fns'
import ms from 'ms'
import envConfig from 'src/shared/config'
@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly tokenservice: TokenService,
    private readonly roleService: RoleService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository,
  ) {}

  async register(body: RegisterBodyType) {
    try {
      const roleId = await this.roleService.getRoleId()
      const hashedPassword = await this.hashingService.hash(body.password)

      const user = await this.authRepository.createUser({
        email: body.email,
        name: body.name,
        password: hashedPassword,
        phoneNumber: body.phoneNumber,
        roleId: roleId,
      })

      return user
    } catch (error) {
      if (isUniqueConstrainPrismaError(error)) {
        throw new UnprocessableEntityException([
          {
            path: ['email'],
            message: 'Email already exists',
          },
        ])
      }
      throw error
    }
  }

  async sendOTP(body: SendOTPBodyType) {
    const user = await this.sharedUserRepository.findUnique({ email: body.email })
    if (user) {
      throw new UnprocessableEntityException([
        {
          path: ['email'],
          message: 'Email already exists',
        },
      ])
    }

    const otp = generateOTP()
    const verificationCode = await this.authRepository.createOTPEntry({
      email: body.email,
      code: otp,
      type: body.type,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPRIRES_IN)),
    })
    return verificationCode
  }

  // async generateTokens(payload: { userId: string }) {
  //   const [accessToken, refreshToken] = await Promise.all([
  //     this.tokenservice.signAccessToken(payload),
  //     this.tokenservice.signRefreshToken(payload),
  //   ])

  //   const refreshTokenData = await this.tokenservice.verifyRefreshToken(refreshToken)

  //   await this.prismaService.refreshToken.create({
  //     data: {
  //       token: refreshToken,
  //       userId: payload.userId,
  //       expiredAt: new Date(refreshTokenData.exp * 1000),
  //     },
  //   })
  //   return { accessToken, refreshToken }
  // }

  // async Login(body: any) {
  //   const user = await this.prismaService.user.findUnique({
  //     where: {
  //       email: body.email,
  //     },
  //   })

  //   if (!user) {
  //     throw new Error('User not exist')
  //   }

  //   const isPasswordMatch = await this.hashingService.compare(body.password, user.password)

  //   if (!isPasswordMatch) {
  //     throw new UnprocessableEntityException([
  //       {
  //         field: 'password',
  //         error: 'Password is incorrect',
  //       },
  //     ])
  //   }
  //   const token = await this.generateTokens({ userId: user.id })
  //   return token
  // }

  // async refreshToken(refreshToken: string) {
  //   try {
  //     const { userId } = await this.tokenservice.verifyRefreshToken(refreshToken)

  //     await this.prismaService.refreshToken.findUniqueOrThrow({
  //       where: {
  //         token: refreshToken,
  //       },
  //     })

  //     await this.prismaService.refreshToken.delete({
  //       where: {
  //         token: refreshToken,
  //       },
  //     })

  //     return await this.generateTokens({ userId })
  //   } catch (error) {
  //     if (isNotFoundPrismaError(error)) {
  //       throw new UnprocessableEntityException('Refresh has been revoked or does not exist')
  //     } else {
  //       throw new UnauthorizedException()
  //     }
  //   }
  // }

  // async Logout(refreshToken: string) {
  //   try {
  //     await this.tokenservice.verifyRefreshToken(refreshToken)

  //     await this.prismaService.refreshToken.delete({
  //       where: {
  //         token: refreshToken,
  //       },
  //     })

  //     return { message: 'Logout successful' }
  //   } catch (error) {
  //     if (isNotFoundPrismaError(error)) {
  //       throw new UnprocessableEntityException('RefreshToken invalid')
  //     } else {
  //       throw new UnauthorizedException()
  //     }
  //   }
  // }
}
