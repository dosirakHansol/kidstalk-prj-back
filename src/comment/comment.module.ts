import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommentRepository } from './comment.repository';
import { CommentLike } from 'src/comment-like/comment-like.entity';
import { CommentLikeService } from 'src/comment-like/comment-like.service';
import { CommentLikeRepository } from 'src/comment-like/comment-like.repository';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, CommentLike]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
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
    RedisModule,
  ],
  controllers: [CommentController],
  providers: [CommentService,CommentRepository,CommentLikeService,CommentLikeRepository]
})
export class CommentModule {}
