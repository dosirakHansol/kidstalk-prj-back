import { Body, Controller, Delete, Logger, Post, UseGuards } from '@nestjs/common';
import { BoardLikeService } from './board-like.service';
import { CustomAuthGuard } from 'src/common/guard/custom-auth-guard';
import { GetMember } from 'src/auth/get-member-decorator';
import { Member } from 'src/auth/member.entity';
import { ResponseDto } from 'src/common/dto/response.dto';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('like/board')
export class BoardLikeController {
    constructor(private boardLikeService: BoardLikeService){}

    private logger = new Logger("BoardLikeController");

    @Post("/")
    @ApiOperation({ summary: "게시글 좋아요" })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                boardId: {
                    type: 'number',
                    description: '좋아요 할 게시글 번호',
                },
            },
            required: ['boardId'],
        },
    })
    @UseGuards(CustomAuthGuard)
    likeIn(
        @GetMember() member: Member,
        @Body("boardId") boardId: number
    ): Promise<ResponseDto>{
        return this.boardLikeService.likeIn(member, boardId);
    }

    @Delete("/")
    @ApiOperation({ summary: "게시글 좋아요 취소" })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                boardId: {
                    type: 'number',
                    description: '좋아요 취소 할 게시글 번호',
                },
            },
            required: ['boardId'],
        },
    })
    @UseGuards(CustomAuthGuard)
    likeOut(
        @GetMember() member: Member,
        @Body("boardId") boardId: number
    ): Promise<ResponseDto>{
        return this.boardLikeService.likeOut(member, boardId);
    }
}
