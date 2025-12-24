import { Injectable } from '@nestjs/common'
import { PrismaService } from '../services/prisma.service'

@Injectable()
export class SharedUserRepository {
  constructor(private readonly PrismaService: PrismaService) {}

  async findUnique(uniqueObject: { id: string } | { email: string }) {
    return this.PrismaService.user.findUnique({
      where: uniqueObject,
    })
  }
}
