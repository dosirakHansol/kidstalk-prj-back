import { Module } from '@nestjs/common';
import { BoardFileController } from './board-file.controller';
import { BoardFileService } from './board-file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BoardFileRepository } from './board-file.repository';
import { BoardFile } from './board-file.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([BoardFile]),
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
    controllers: [BoardFileController],
    providers: [BoardFileService, BoardFileRepository]
})
export class BoardFileModule {}
