import { Injectable } from '@nestjs/common';
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
        return this.boardLikeRepository.likeIn(member, boardId);
    }

    async likeOut(
        member: Member,
        boardId: number
    ): Promise<ResponseDto> {
        return this.boardLikeRepository.likeOut(member, boardId);
    }
}
