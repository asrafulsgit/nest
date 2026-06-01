import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import appConfig from './config/app.config';
import { PrismaModule } from './database/prisma.module';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: ['.env', `.env.${process.env.NODE_ENV || 'development'}`],
      load: [appConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
