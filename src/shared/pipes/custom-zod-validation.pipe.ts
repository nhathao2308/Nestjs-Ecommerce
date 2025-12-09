import { UnprocessableEntityException } from '@nestjs/common'
import { createZodValidationPipe } from 'nestjs-zod'
import { ZodError } from 'zod'

const CustomZodValidationPipe: any = createZodValidationPipe({
  // provide custom validation exception factory
  createValidationException: (error: ZodError) => {
    return new UnprocessableEntityException('Oops')
  },
})
export default CustomZodValidationPipe
