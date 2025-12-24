import { Global, Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service'
import { HashingService } from './services/hashing.service'
import { TokenService } from './services/token.service'
import { JwtModule } from '@nestjs/jwt'
import { APIKeyGuard } from './guard/api-key.guard'
import { AccessTokenGuard } from './guard/access-token.guard'
import { AuthenticationGuard } from './guard/authentication.guard'
import { SharedUserRepository } from './repositories/shared-user.repository'

const sharedServices = [PrismaService, HashingService, TokenService, SharedUserRepository]

@Global()
@Module({
  providers: [
    ...sharedServices,
    AccessTokenGuard,
    APIKeyGuard,
    {
      provide: 'APP_GUARD',
      useClass: AuthenticationGuard,
    },
  ],
  exports: sharedServices,
  imports: [JwtModule],
})
export class SharedModule {}
