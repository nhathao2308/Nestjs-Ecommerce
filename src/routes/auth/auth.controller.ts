import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterBodyDTO, SendOTPBodyDTO } from './auth.dto'
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterBodyDTO) {
    const result = await this.authService.register(body)
    return result
  }

  @Post('otp')
  async sendOTP(@Body() body: SendOTPBodyDTO) {
    const result = await this.authService.sendOTP(body)
    return result
  }

  // @Post('login')
  // async Login(@Body() body: any) {
  //   const result = await this.authService.Login(body)
  //   return result
  // }

  // @UseGuards(AccessTokenGuard)
  // @Post('refresh-token')
  // async RefreshToken(@Body() body: any) {
  //   const result = await this.authService.refreshToken(body.refreshToken)
  //   return result
  // }

  // @Post('logout')
  // async Logout(@Body() body: any) {
  //   return await this.authService.Logout(body.refreshToken)
  // }
}
