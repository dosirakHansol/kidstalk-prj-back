import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { BoardCreateDto } from './dto/board.dto';
import { Member } from 'src/auth/member.entity';
import { ResponseDto } from 'src/common/dto/response.dto';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(BoardRepository)
        private boardRepository: BoardRepository,
    ) {}

    private logger = new Logger('BoardService');

    async createBoard(
        boardDto: BoardCreateDto,
        member: Member
    ): Promise<ResponseDto> {
        return this.boardRepository.createBoard(boardDto, member);
    }

    async getBoardById(boardId: number): Promise<ResponseDto> {
        return await this.boardRepository.getBoardById(boardId);
    }

    async getAllBoard(page: number): Promise<ResponseDto> {
        const boards = await this.boardRepository.getAllBoard(page);
        return new ResponseDto(
            HttpStatus.OK, 
            "게시글 조회 성공", 
            { boards }
        );
    }

}
