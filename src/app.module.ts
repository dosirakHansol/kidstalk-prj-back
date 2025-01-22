import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { MemberModule } from './auth/member.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { TopicModule } from './topic/topic.module';
import { BoardModule } from './board/board.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { BoardLikeModule } from './board-like/board-like.module';

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
    RedisModule,
    MemberModule,
    TopicModule,
    BoardModule,
    FileUploadModule,
    BoardLikeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
