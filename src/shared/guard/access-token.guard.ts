import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { REQUEST_USER_KEY } from '../constants/auth.constant'
import { TokenService } from '../services/token.service'

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly tokenservice: TokenService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const accessToken = request.headers.authorization?.split(' ')[1]
    // console.log(accessToken)

    if (!accessToken) {
      return false
    }
    try {
      const decodeUser = await this.tokenservice.verifyAccessToken(accessToken)
      request[REQUEST_USER_KEY] = decodeUser
      return true
    } catch {
      return false
    }
  }
}
