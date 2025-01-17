import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { setupSwagger } from './configs/swagger.config';
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app); //swagger

  // ConfigService 인스턴스 주입
  const configService = app.get(ConfigService); // ConfigService 인스턴스 가져오기
  const port = configService.get('SERVER_PORT'); // 환경 변수 PORT 값 가져오기, 없으면 4040 사용

  await app.listen(port);

  Logger.log(`Application running on port ${port}...`);
}
bootstrap();
