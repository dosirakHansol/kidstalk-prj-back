import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  //swagger (s)
    const config = new DocumentBuilder()
      .setTitle('키즈톡 API')
      .setDescription('키즈톡 API에 대한 document 입니다.')
      .setVersion('1.0')
      .addTag('')
      .addBearerAuth()
      .setTermsOfService('서비스이용약관')
      .setContact('담당자', 'naver.com', 'sol25890@gmail.com')
      .setLicense('MIT', 'naver.com')
      .build();
  
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/doc', app, documentFactory);
    //swagger (e)
}