import { Controller, Get, Post } from '@nestjs/common'
import { PostsService } from './posts.service'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts() {
    return this.postsService.getPosts()
  }

  @Post()
  createPost(body: any) {
    return this.postsService.createPost(body)
  }
}
