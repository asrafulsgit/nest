import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../database/prisma.service';

type UserRole = 'admin' | 'user' | 'moderator';

export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
  role: UserRole;
  createdAt: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  users: User[] = [
    {
      id: 1,
      name: 'Md Asraful Islam',
      email: 'asraful@example.com',
      age: 22,
      isActive: true,
      role: 'admin',
      createdAt: '2025-01-10',
    },
    {
      id: 2,
      name: 'Rahim Uddin',
      email: 'rahim@example.com',
      age: 25,
      isActive: true,
      role: 'user',
      createdAt: '2025-02-15',
    },
    {
      id: 3,
      name: 'Nusrat Jahan',
      email: 'nusrat@example.com',
      age: 21,
      isActive: false,
      role: 'moderator',
      createdAt: '2025-03-05',
    },
    {
      id: 4,
      name: 'Tanvir Ahmed',
      email: 'tanvir@example.com',
      age: 28,
      isActive: true,
      role: 'user',
      createdAt: '2025-04-20',
    },
  ];

  async createUser(user: CreateUserDto) {
    const newUser = await this.prismaService.user.create({
      data: user,
    });
    return newUser;
  }

  async getUsers() {
    return await this.prismaService.user.findMany();
  }

  getSingleUser(id: number) {
    return this.users.find((u) => u.id === id);
  }

  updateUser(id: number, data: UpdateUserDto) {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      return new NotFoundException({
        success: false,
        message: 'User not found',
      });
    }
    return {
      ...user,
      name: data.name || user?.name,
    };
  }
}
