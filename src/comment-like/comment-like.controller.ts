import { Body, Controller, Delete, Get, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { CommentLikeService } from './comment-like.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CustomAuthGuard } from 'src/common/guard/custom-auth-guard';
import { GetMember } from 'src/auth/get-member-decorator';
import { Member } from 'src/auth/member.entity';
import { ResponseDto } from 'src/common/dto/response.dto';

@Controller('like/comment')
export class CommentLikeController {
    constructor(private commentLikeService: CommentLikeService){}

    private logger = new Logger("CommentLikeController");

    @Post("/")
    @ApiOperation({ summary: "댓글 좋아요" })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                commentId: {
                    type: 'number',
                    description: '좋아요 할 댓글 번호',
                },
            },
            required: ['commentId'],
        },
    })
    @UseGuards(CustomAuthGuard)
    likeIn(
        @GetMember() member: Member,
        @Body("commentId") commentId: number
    ): Promise<ResponseDto>{
        return this.commentLikeService.likeIn(member, commentId);
    }

    @Delete("/")
    @ApiOperation({ summary: "댓글 좋아요 취소" })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                commentId: {
                    type: 'number',
                    description: '좋아요 취소 할 댓글 번호',
                },
            },
            required: ['commentId'],
        },
    })
    @UseGuards(CustomAuthGuard)
    likeOut(
        @GetMember() member: Member,
        @Body("commentId") commentId: number
    ): Promise<ResponseDto>{
        return this.commentLikeService.likeOut(member, commentId);
    }

    @Get("/count/:commentId")
    @ApiOperation({ summary: "댓글에 대한 좋아요 총 개수 카운트 (DB)" })
    @ApiParam({ name: 'commentId', type: Number, description: '댓글 번호' })
    likeCount(
        @Param("commentId") commentId: number
    ): Promise<ResponseDto>{
        return this.commentLikeService.likeCount(commentId);
    }
}
