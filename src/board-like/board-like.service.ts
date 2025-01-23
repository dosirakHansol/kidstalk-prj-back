import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardLikeRepository } from './board-like.repository';
import { ResponseDto } from 'src/common/dto/response.dto';
import { Member } from 'src/auth/member.entity';

@Injectable()
export class BoardLikeService {
    constructor(
        @InjectRepository(BoardLikeRepository)
        private boardLikeRepository: BoardLikeRepository,
    ) {}

    async likeIn(
        member: Member,
        boardId: number
    ): Promise<ResponseDto> {
        const existLikeCount = await this.boardLikeRepository.checkExistLike(member, boardId);

        if(existLikeCount > 0) {
            return new ResponseDto(
                HttpStatus.CREATED, 
                "게시글 좋아요 성공", 
                {}
            );
        } else {
            return this.boardLikeRepository.likeIn(member, boardId);
        }
    }

    async likeOut(
        member: Member,
        boardId: number
    ): Promise<ResponseDto> {
        return this.boardLikeRepository.likeOut(member, boardId);
    }
}
