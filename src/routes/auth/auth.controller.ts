import { Body, Controller, Post, SerializeOptions, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDTO, LoginResponseDTO, RefreshTokenBodyDTO, RegisterDTO, RegisterResponseDTO } from './auth.dto'
import { AccesstokenGuard } from 'src/shared/guard/access-token.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: RegisterResponseDTO })
  @Post('register')
  async register(@Body() body: RegisterDTO) {
    const result = await this.authService.register(body)

    return result
    // return new RegisterResponseDTO(result)
  }

  @Post('login')
  async Login(@Body() body: LoginDTO) {
    const result = await this.authService.Login(body)
    return new LoginResponseDTO(result)
  }

  @UseGuards(AccesstokenGuard)
  @Post('refresh-token')
  async RefreshToken(@Body() body: RefreshTokenBodyDTO) {
    const result = await this.authService.refreshToken(body.refreshToken)
    return new LoginResponseDTO(result)
  }
}
