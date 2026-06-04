import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.get<number>('app.port');
  const apiPrefix = config.get<string>('app.apiPrefix');
  const cookieSecret = config.get<string>('app.cookieSecret');
  const clientUrl = config.get<string>('app.clientUrl');

  app.use(cookieParser(cookieSecret));
  app.setGlobalPrefix(apiPrefix || '/api/v1');

  app.enableCors({
    origin: clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((error) => ({
          field: error.property,
          message: Object.values(error.constraints || {})[0],
        }));

        return new BadRequestException({
          errors: formattedErrors,
          code: 'VALIDATION_ERROR',
          message: 'Validation Failed',
        });
      },
    }),
  );

  await app.listen(port || 5000);
}
bootstrap();
