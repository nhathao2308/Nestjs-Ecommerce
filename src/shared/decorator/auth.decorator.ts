import { SetMetadata } from '@nestjs/common'
import { AuthTypeType, ContiditionGuardType } from '../constants/auth.constant'

export const AUTH_TYPE_KEY = 'auth_type'

export type AuthTypeDecoratorPayload = {
  authTypes: AuthTypeType[]
  options: { condition: ContiditionGuardType }
}

export const Auth = (authTypes: AuthTypeType[], options: { condition: ContiditionGuardType }) => {
  return SetMetadata(AUTH_TYPE_KEY, { authTypes, options })
}
