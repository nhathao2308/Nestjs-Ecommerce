import { PrismaService } from 'src/shared/services/prisma.service'
import { RegisterBodyType, UserType } from './auth.model'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(
    userData: Omit<RegisterBodyType, 'confirmPassword'> & Pick<UserType, 'roleId'>,
  ): Promise<Omit<UserType, 'password' | 'totpSecret'>> {
    console.log('userData', userData)

    const user = await this.prismaService.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password: userData.password,
        phoneNumber: userData.phoneNumber,
        roleId: userData.roleId,
      },
    })
    return user
  }
}
