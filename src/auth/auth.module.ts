import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller'; 
import { HashProvider } from './provider/hash.provider';
import { BrcyptProvider } from './provider/brcypt.provider';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashProvider,
      useClass: BrcyptProvider,
    },
  ],
  exports: [],
})
export class AuthModule {}
