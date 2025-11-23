export const REQUEST_USER_KEY = 'user'

export const AuthType = {
  Bearer: 'Bearer',
  None: 'None',
  APIKey: 'ApiKey',
} as const

export type AuthTypeType = (typeof AuthType)[keyof typeof AuthType]

export const ConditionGuard = {
  Or: 'or',
  And: 'and',
} as const

export type ContiditionGuardType = (typeof ConditionGuard)[keyof typeof ConditionGuard]
