import { Module } from '@nestjs/common';
import { CommentLikeController } from './comment-like.controller';
import { CommentLikeService } from './comment-like.service';
import { CommentLikeRepository } from './comment-like.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from 'src/redis/redis.module';
import { CommentLike } from './comment-like.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([CommentLike]),
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
    controllers: [CommentLikeController],
    providers: [CommentLikeService,CommentLikeRepository]
})
export class CommentLikeModule {}
