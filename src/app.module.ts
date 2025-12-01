import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SharedModule } from './shared/shared.module'
@Module({
  imports: [SharedModule],
  controllers: [AppController],
  providers: [AppService, { provide: 'APP_INTERCEPTOR', useClass: ClassSerializerInterceptor }],
})
export class AppModule {}
