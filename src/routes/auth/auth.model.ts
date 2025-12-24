import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant'
import { UserSchema } from 'src/shared/models/shared-user.model'
import z from 'zod'

export type UserType = z.infer<typeof UserSchema>

export const RegisterBodySchema = UserSchema.pick({
  email: true,
  password: true,
  name: true,
  phoneNumber: true,
})
  .extend({
    confirmPassword: z.string().min(6).max(100),
  })
  .strict()
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      })
    }
  })
export type RegisterBodyType = z.infer<typeof RegisterBodySchema>

export const RegisterResponseSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
})
export type RegisterResponseType = z.infer<typeof RegisterResponseSchema>

export const VerificationCodeSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  code: z.string(),
  type: z.enum([TypeOfVerificationCode.REGISTER, TypeOfVerificationCode.FORGOT_PASSWORD]),
  expiresAt: z.date(),
  createdAt: z.date(),
})
export type VerificationCodeType = z.infer<typeof VerificationCodeSchema>

export const SendOTPbodySchema = VerificationCodeSchema.pick({
  email: true,
  type: true,
})
export type SendOTPBodyType = z.infer<typeof SendOTPbodySchema>
