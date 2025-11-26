import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { TokenPayload } from '../types/jwt.type'
import { REQUEST_USER_KEY } from '../constants/auth.constant'

export const ActiveUser = createParamDecorator((field: keyof TokenPayload | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const user: TokenPayload | undefined = request[REQUEST_USER_KEY]
  return field ? user?.[field] : user
})
