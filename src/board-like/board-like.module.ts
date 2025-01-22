import { Module } from '@nestjs/common';
import { BoardLikeController } from './board-like.controller';
import { BoardLikeService } from './board-like.service';
import { BoardLikeRepository } from './board-like.repository';
import { BoardLike } from './board-like.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoardLike]),
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
  controllers: [BoardLikeController],
  providers: [BoardLikeService,BoardLikeRepository]
})
export class BoardLikeModule {}
