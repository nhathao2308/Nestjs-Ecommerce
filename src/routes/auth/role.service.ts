import { Injectable } from '@nestjs/common'
import { RoleName } from 'src/shared/constants/role.constant'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class RoleService {
  private clientRoleId: string | null = null

  constructor(private readonly prismaService: PrismaService) {}

  async getRoleId() {
    if (this.clientRoleId !== null) {
      return this.clientRoleId
    }

    const role = await this.prismaService.role.findUniqueOrThrow({
      where: {
        name: RoleName.Client,
      },
    })
    this.clientRoleId = role.id
    return this.clientRoleId
  }
}
