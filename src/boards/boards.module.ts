import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsRepository } from './boards.repository';
import { Board } from './board.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board]),
    AuthModule
  ],
  controllers: [BoardsController],
  providers: [BoardsService, BoardsRepository]
})
export class BoardsModule {}
