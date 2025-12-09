import { Logger, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { ZodSerializationException } from 'nestjs-zod'

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: HttpException, host: ArgumentsHost) {
    if (exception instanceof ZodSerializationException) {
      const zodError = exception.getZodError()
      const message =
        typeof zodError === 'object' && zodError !== null && 'message' in zodError
          ? (zodError as { message: string }).message
          : String(zodError)
      this.logger.error(`ZodSerializationException: ${message}`)
    }

    super.catch(exception, host)
  }
}
