import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import appConfig from './config/app.config';
import { PrismaModule } from './database/prisma.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/filters.filter';
import { AuthModule } from './auth/auth.module';
import cookieConfig from './config/cookie.config';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: ['.env', `.env.${process.env.NODE_ENV || 'development'}`],
      load: [appConfig,cookieConfig],
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide : APP_FILTER,
      useClass : AllExceptionsFilter
    }
  ],
})
export class AppModule {}
