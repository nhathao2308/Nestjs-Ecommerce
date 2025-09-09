import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'
import { REQUEST_USER_KEY } from '../constants/auth.constant'
import { TokenService } from '../services/token.service'

@Injectable()
export class AccesstokenGuard implements CanActivate {
  constructor(private readonly tokenservice: TokenService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    console.log('request', request.headers)

    const accessToken = request.headers.authorization?.split(' ')[1]
    if (!accessToken) {
      return false
    }

    try {
      const decodeUser = this.tokenservice.verifyAccessToken(accessToken)
      request[REQUEST_USER_KEY] = decodeUser
      return true
    } catch {
      return false
    }
  }
}
