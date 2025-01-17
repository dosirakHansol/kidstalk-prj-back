import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { MemberModule } from './auth/member.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => typeORMConfig(configService),
      inject: [ConfigService],
    }),
    MemberModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
