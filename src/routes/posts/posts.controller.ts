import { Body, Controller, Get, Post } from '@nestjs/common'
import { PostsService } from './posts.service'
import { Auth } from 'src/shared/decorator/auth.decorator'
import { AuthType } from 'src/shared/constants/auth.constant'
import { Request } from 'express'
import { ok } from 'assert'
import { activeUser } from 'src/shared/decorator/activate-user.decorator'
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

  @Auth([AuthType.Bearer], { condition: 'and' })
  @Post()
  createPost(@Body() body: any, @activeUser('userId') userId: number) {
    // console.log(request[REQUEST_USER_KEY])
    return this.postsService.createPost(body, userId)
    return ok(true)
  }
}
