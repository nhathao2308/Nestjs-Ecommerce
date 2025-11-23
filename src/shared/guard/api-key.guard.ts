import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import envConfig from '../config'

@Injectable()
export class APIKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const xAPIKey = request.headers['x-api-key']
    console.log('xAPIKey', xAPIKey)

    if (xAPIKey !== envConfig.SECRET_API_KEY) {
      throw new UnauthorizedException('Invalid API Key')
    }
    return true
  }
}
