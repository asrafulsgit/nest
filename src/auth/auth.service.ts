import { BadRequestException, Injectable } from '@nestjs/common';
import { SingupDto } from './dto/signup.dto';
import { PrismaService } from '../database/prisma.service';
import { HashProvider } from './provider/hash.provider';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

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
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

  async loginUser(data: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new BadRequestException('Incorrect Creadentials');
    }

    const isCorrectPassword = await this.hashPasswordProvider.comparePassword(
      data.password,
      user.password,
    );

    if (!isCorrectPassword) {
      throw new BadRequestException('Incorrect Creadentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('app.jwtAccessTokenSercret'),
      expiresIn: this.configService.get<number>('app.jwtAccessTokenExpires'),
    });

    return token;
  }
}
