import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { MemberModule } from './auth/member.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { TopicModule } from './topic/topic.module';
import { BoardModule } from './board/board.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { BoardLikeModule } from './board-like/board-like.module';
import { BoardFileModule } from './board-file/board-file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TokenMiddleware } from './common/middleware/token.middleware';
import { JwtModule } from '@nestjs/jwt';
import { LocationModule } from './location/location.module';
import { CommentModule } from './comment/comment.module';
import { CommentLikeModule } from './comment-like/comment-like.module';

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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    RedisModule,
    MemberModule,
    TopicModule,
    BoardModule,
    FileUploadModule,
    BoardLikeModule,
    BoardFileModule,
    LocationModule,
    CommentModule,
    CommentLikeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenMiddleware)
      .forRoutes(
        {path: '/board/:boardId', method: RequestMethod.GET}, 
        {path: '/board', method: RequestMethod.GET},
        {path: '/comment/list', method: RequestMethod.GET},
      )
  }
}
