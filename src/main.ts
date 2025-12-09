import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger';
import { HttpResponseInterceptor } from './common/http/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new HttpResponseInterceptor());
  app.setGlobalPrefix(`${process.env.API_PREFIX}/${process.env.API_VERSION}`);
  app.enableCors();
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
