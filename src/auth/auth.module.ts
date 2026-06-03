import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashProvider } from './provider/hash.provider';
import { BrcyptProvider } from './provider/brcypt.provider';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashProvider,
      useClass: BrcyptProvider,
    },
  ],
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('app.jwtAccessTokenSercret'),
        signOptions: {
          expiresIn: configService.get<number>('app.jwtAccessTokenExpires'),
        },
      }),
      inject : [ConfigService]
    }),
  ],
})
export class AuthModule {}
