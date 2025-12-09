import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AccessTokenGuard } from 'src/shared/guard/access-token.guard'
import { RegisterBodyDTO } from './auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseInterceptors(ClassSerializerInterceptor)
  // @SerializeOptions({ type: RegisterResponseDTO })
  @Post('register')
  async register(@Body() body: RegisterBodyDTO) {
    console.log('register body', body)

    const result = await this.authService.register(body)

    return result
    // return new RegisterResponseDTO(result)
  }

  @Post('login')
  async Login(@Body() body: any) {
    const result = await this.authService.Login(body)
    return result
  }

  @UseGuards(AccessTokenGuard)
  @Post('refresh-token')
  async RefreshToken(@Body() body: any) {
    const result = await this.authService.refreshToken(body.refreshToken)
    return result
  }

  @Post('logout')
  async Logout(@Body() body: any) {
    return await this.authService.Logout(body.refreshToken)
  }
}
