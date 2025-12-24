import { createZodDto } from 'nestjs-zod'
import { RegisterBodySchema, RegisterResponseSchema, SendOTPbodySchema } from './auth.model'

// class is required for using DTO as a type
export class RegisterBodyDTO extends createZodDto(RegisterBodySchema) {}

export class RegisterResponseDTO extends createZodDto(RegisterResponseSchema) {}

export class SendOTPBodyDTO extends createZodDto(SendOTPbodySchema) {}
