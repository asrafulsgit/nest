import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HashProvider } from './hash.provider.js';
import bcrypt from 'bcrypt';

@Injectable()
export class BrcyptProvider implements HashProvider {
  constructor(private readonly configService: ConfigService) {}

  async hashPassword(password: string): Promise<string> {
    const salt = this.configService.get<number>('app.hashSalt')!;
    return await bcrypt.hash(password, salt);
  }

  comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
