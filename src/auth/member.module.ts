import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { MemberRepository } from './member.repository';
import { Member } from './member.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from 'src/redis/redis.module';
import { BoardLikeRepository } from 'src/board-like/board-like.repository';
import { CommentRepository } from 'src/comment/comment.repository';
import { BoardRepository } from 'src/board/board.repository';
import { Board } from 'src/board/board.entity';
import { BoardLike } from 'src/board-like/board-like.entity';
import { Comment } from 'src/comment/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, Board, BoardLike, Comment]),
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
  controllers: [MemberController],
  providers: [MemberService, MemberRepository, JwtStrategy, BoardRepository, BoardLikeRepository, CommentRepository],
  exports: [JwtStrategy, PassportModule]
})
export class MemberModule {}
