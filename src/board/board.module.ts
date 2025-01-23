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

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, BoardFile]),
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
  ],
  controllers: [BoardController],
  providers: [BoardService, BoardRepository, BoardFileRepository]
})
export class BoardModule {}
