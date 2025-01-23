import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardFileRepository } from './board-file.repository';
import { BoardFile } from './board-file.entity';

@Injectable()
export class BoardFileService {
    constructor(
        @InjectRepository(BoardFileRepository) private topicRepository: BoardFileRepository,
    ) {}

    private logger = new Logger('BoardFileService');
}
