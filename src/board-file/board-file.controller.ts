import { Controller, Logger, Post } from '@nestjs/common';
import { BoardFileService } from './board-file.service';

@Controller('boardFile')
export class BoardFileController {
    constructor(private boardFileService: BoardFileService){}

    private logger = new Logger("BoardFileController");
}
