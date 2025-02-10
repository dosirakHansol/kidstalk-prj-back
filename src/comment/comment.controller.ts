import { Body, Controller, Get, HttpStatus, Logger, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CustomAuthGuard } from 'src/common/guard/custom-auth-guard';
import { CommentCreateDto } from './dto/comment.dto';
import { GetMember } from 'src/auth/get-member-decorator';
import { Member } from 'src/auth/member.entity';
import { ResponseDto } from 'src/common/dto/response.dto';

@Controller('comment')
export class CommentController {
    constructor(private commentService: CommentService){}

    private logger = new Logger("CommentService");

    @Post("/create")
    @ApiOperation({ summary: "댓글 생성" })
    @ApiBearerAuth()
    @UseGuards(CustomAuthGuard)
    createComment(
        @Body() commentCreateDto: CommentCreateDto,
        @GetMember() member: Member
    ): Promise<ResponseDto> {
        return this.commentService.createComment(commentCreateDto, member);
    }

    @Get("/count/:boardId")
    @ApiOperation({ summary: "특정 게시글 댓글 전체개수 조회" })
    countCommentByBoardId(
        @Param("boardId") boardId: number
    ): Promise<ResponseDto> {
        return this.commentService.countCommentByBoardId(boardId);
    }

    @Get("/list")
    @ApiOperation({ summary: "댓글 리스트 불러오기" })
    @ApiQuery({ name: 'boardId', type: Number, description: '게시글 번호(특정 유저 댓글 조회인경우 0)', required: true, default: 0 })
    @ApiQuery({ name: 'page', type: Number, description: '페이지 넘버 (0부터 시작)', required: false, default: 0 })
    @ApiQuery({ name: 'limit', type: Number, description: '조회 개수(단위) limit', required: false, default: 10 })
    @ApiQuery({ name: 'parentId', type: Number, description: '부모댓글 번호 (대댓글 아닌경우 0) 번호', required: false, default: 0 })
    @ApiQuery({ name: 'writerId', type: Number, description: '유저(작성자) 번호 없는경우 0', required: false, default: 0 })
    @ApiResponse({status: HttpStatus.OK, description: '응답 메시지 (data에 board배열)', type: ResponseDto,})
    getCommentList(
        @Query("page") page: number = 0, //default = 0
        @Query("limit") limit: number = 10, //default = 10
        @Query("boardId") boardId: number = 0,
        @Query("writerId") writerId: number = 0,
        @Query("parentId") parentId: number = 0
    ): Promise<ResponseDto>
    {   
        return this.commentService.getCommentList(page, limit, boardId, writerId, parentId);
    }

}
