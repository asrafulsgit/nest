import { Injectable } from '@nestjs/common';
import { SingupDto } from './dto/signup.dto';
import { PrismaService } from '../database/prisma.service';
import { HashProvider } from './provider/hash.provider';

const userSelectedField = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashPasswordProvider: HashProvider,
  ) {}
  async createUser(data: SingupDto) {
    const hashedPassword = await this.hashPasswordProvider.hashPassword(
      data.password,
    );
    return await this.prismaService.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: userSelectedField,
    });
  }
}
