import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get<number>('app.port');
  const apiPrefix = config.get<string>('app.apiPrefix');
  app.setGlobalPrefix(apiPrefix || "/api/v1");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((error) => ({
          field: error.property,
          message: Object.values(error.constraints || {})[0],
        }));

        return new BadRequestException({
          success: false,
          message: 'Validation Failed',
          errors: formattedErrors,
        });
      },
    }),
  );
  
  await app.listen(port || 5000);
}
bootstrap();
