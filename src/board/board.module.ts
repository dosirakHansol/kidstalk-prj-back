import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BoardRepository } from './board.repository';
import { BoardFileRepository } from 'src/board-file/board-file.repository';
import { BoardFile } from 'src/board-file/board-file.entity';
import { BoardLikeRepository } from 'src/board-like/board-like.repository';
import { BoardLike } from 'src/board-like/board-like.entity';
import { RedisModule } from 'src/redis/redis.module';
import { BoardLikeService } from 'src/board-like/board-like.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, BoardLike, BoardFile]),
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
  controllers: [BoardController],
  providers: [BoardService, BoardRepository, BoardLikeService, BoardLikeRepository, BoardFileRepository]
})
export class BoardModule {}
