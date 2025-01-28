import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { BoardCreateDto } from './dto/board.dto';
import { Member } from 'src/auth/member.entity';
import { ResponseDto } from 'src/common/dto/response.dto';
import { BoardFileRepository } from 'src/board-file/board-file.repository';
import { RedisService } from 'src/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { BoardLikeService } from 'src/board-like/board-like.service';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(BoardRepository) private boardRepository: BoardRepository,
        @InjectRepository(BoardFileRepository) private boardFileRepository: BoardFileRepository,
        private boardLikeService: BoardLikeService,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
    ) {}

    private logger = new Logger('BoardService');

    async createBoard(
        boardDto: BoardCreateDto,
        member: Member
    ): Promise<ResponseDto> {
        return this.boardRepository.createBoard(boardDto, member);
    }

    async getBoardById(boardId: number): Promise<ResponseDto> {
        const res = await this.boardRepository.getBoardById(boardId);

        //게시글 총 좋아요 카운트
        res.data.board.likesCount = await this.boardLikeService.getBoardLikeCount(res.data.board.id, 0);

        return res;
    }

    async getBoardList(page: number, topicId: number, memberId: number): Promise<ResponseDto> {
        // 게시글 기본정보 가져오기
        const response = await this.boardRepository.getBoardList(page, topicId, memberId);

        // 게시글 파일 가져오기
        // foreach는 비동기 작업 수행이 잘안됨...
        // response.data.boards.forEach(async board => {
        //     this.logger.log('board', JSON.stringify(board));
        //     if(board.filesCount > 0){
        //         board.fileList = await this.boardFileRepository.findBy({ boardId: board.id });
        //     }
        // });
        for (const board of response.data.boards) {
            this.logger.log('board', JSON.stringify(board));
            if (board.filesCount > 0) {
                board.fileList = await this.boardFileRepository.findBy({ boardId: board.id });
            }
            //게시글 총 좋아요 카운트
            board.likesCount = await this.boardLikeService.getBoardLikeCount(board.id, 0);
        }

        return response;
    }
}
