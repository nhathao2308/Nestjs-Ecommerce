import { Body, Injectable } from '@nestjs/common'

import { AuthType } from 'src/shared/constants/auth.constant'
import { Auth } from 'src/shared/decorator/auth.decorator'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  getPosts(userId: number) {
    return this.prismaService.post.findMany({
      where: { authorId: userId },
      include: { author: { omit: { password: true } } },
    })
  }

  @Auth([AuthType.Bearer])
  createPost(@Body() body: any, userId: number) {
    return this.prismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
    })
  }
}
