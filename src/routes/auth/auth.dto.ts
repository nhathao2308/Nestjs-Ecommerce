import { UserStatus } from '@prisma/client'
import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const UserSchema = z.object({
  id: z.number().int(),
  email: z.string().email(),
  name: z.string(),
  phoneNumber: z.string(),
  roleId: z.string(),
  avartar: z.string().nullable(),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BLOCKED]),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  createdById: z.string().nullable(),
  updatedById: z.string().nullable(),
})

const RegisterBodySchema = z
  .object({
    email: z.string().email().min(1, 'Email is required'),
    password: z.string().min(6).max(32),
    name: z.string().min(1, 'Name is required'),
    phoneNumber: z.string().min(1, 'Phone number is required'),
    confirmPassword: z.string().min(6).max(32),
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

// class is required for using DTO as a type
export class RegisterBodyDTO extends createZodDto(RegisterBodySchema) {}

export class RegisterResponseDTO extends createZodDto(UserSchema) {}
