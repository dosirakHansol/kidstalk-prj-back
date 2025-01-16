import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { setupSwagger } from './configs/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app); //swagger

  await app.listen(process.env.PORT ?? 4040);

  const port = 4040;
  Logger.log(`Application running on port ${port}...`)
}
bootstrap();
