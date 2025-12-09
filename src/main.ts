import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app
    .useGlobalPipes
    // new ValidationPipe({
    //   whitelist: true,
    //   forbidNonWhitelisted: true,
    //   transform: true,
    //   exceptionFactory: (validationErrors) => {
    //     return new UnprocessableEntityException(
    //       validationErrors.map((error) => ({
    //         property: error.property,
    //         error: Object.values(error.constraints as any).join(', '),
    //       })),
    //     )
    //   },
    // }),
    // new ZodValidationPipe({
    //   createValidationException:  (error) => new UnprocessableEntityException(error.getZodError()),
    // }),
    ()
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
