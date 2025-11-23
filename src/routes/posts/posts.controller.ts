import { Controller, Get, Post } from '@nestjs/common'
import { PostsService } from './posts.service'
import { Auth } from 'src/shared/decorator/auth.decorator'
import { AuthType } from 'src/shared/constants/auth.constant'
// import { AuthenticationGuard } from 'src/shared/guard/authentication.guard'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: 'and' })
  // @UseGuards(AuthenticationGuard)
  @Get()
  getPosts() {
    return this.postsService.getPosts()
  }

  @Post()
  createPost(body: any) {
    return this.postsService.createPost(body)
  }
}
