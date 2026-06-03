import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashProvider {
  abstract hashPassword(password: string): Promise<string>;
  abstract comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
