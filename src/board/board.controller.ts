import { Body, Controller, Get, HttpStatus, Logger, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BoardService } from './board.service';
import { CustomAuthGuard } from 'src/common/guard/custom-auth-guard';
import { GetMember } from 'src/auth/get-member-decorator';
import { Member } from 'src/auth/member.entity';
import { BoardCreateDto, BoardEditDto } from './dto/board.dto';
import { ResponseDto } from 'src/common/dto/response.dto';

@Controller('board')
@ApiTags("Board API")
export class BoardController {
    constructor(private boardService: BoardService){}
    
    private logger = new Logger("BoardController");

    @Post("/create")
    @ApiOperation({ summary: "게시글 생성" })
    @ApiBearerAuth()
    @UseGuards(CustomAuthGuard)
    createBoard(
        @Body() boardCreateDto: BoardCreateDto,
        @GetMember() member: Member
    ): Promise<ResponseDto> {
        return this.boardService.createBoard(boardCreateDto, member);
    }

    @Get("/:boardId")
    @ApiBearerAuth()
    @ApiOperation({ summary: "게시글 번호로 게시글 조회" })
    @ApiParam({ name: 'boardId', type: Number, description: '게시글 번호' })
    @ApiResponse({status: HttpStatus.OK, description: '응답 메시지 (data에 게시글 정보)', type: ResponseDto,})
    getBoardById(
        @GetMember() member: Member,
        @Param('boardId') boardId: number
    ): Promise<ResponseDto>
    {   
        return this.boardService.getBoardById(boardId, member);
    }

    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: "게시글 목록 불러오기" })
    @ApiQuery({ name: 'page', type: Number, description: '페이지 넘버 (0부터 시작)', required: false, default: 0 })
    @ApiQuery({ name: 'topicId', type: Number, description: '주제 번호', required: false })
    @ApiQuery({ name: 'writerId', type: Number, description: '유저(작성자) 번호', required: false })
    @ApiResponse({status: HttpStatus.OK, description: '응답 메시지 (data에 board배열)', type: ResponseDto,})
    getBoardList(
        @GetMember() member: Member,
        @Query("page") page: number = 0, //default = 0
        @Query("topicId") topicId: number,
        @Query("writerId") writerId: number
    ): Promise<ResponseDto>
    {   
        return this.boardService.getBoardList(page, topicId, writerId, member);
    }

    @Get("/count/all")
    @ApiBearerAuth()
    @ApiOperation({ summary: "게시글 목록 개수 불러오기" })
    @ApiQuery({ name: 'topicId', type: Number, description: '주제 번호', required: false })
    @ApiQuery({ name: 'writerId', type: Number, description: '유저(작성자) 번호', required: false })
    @ApiResponse({status: HttpStatus.OK, description: '응답 메시지 (data에 board배열)', type: ResponseDto,})
    getBoardListCount(
        @GetMember() member: Member,
        @Query("topicId") topicId: number,
        @Query("writerId") writerId: number
    ): Promise<ResponseDto>
    {   
        this.logger.log("getBoardListCount..");
        return this.boardService.getBoardListCount(topicId, writerId, member);
    }

    @Patch("/:boardId")
    @ApiBearerAuth()
    @ApiOperation({ summary: "게시글 조회수 증가" })
    @ApiResponse({status: HttpStatus.OK, description: '게시글 조회수 증가 성공 응답', type: ResponseDto,})
    @ApiParam({ name: 'boardId', type: Number, description: '게시글 번호' })
    increaseReadCount(
        @GetMember() member: Member,
        @Param("boardId") boardId: number
    ): Promise<ResponseDto> {
        return this.boardService.increaseReadCount(boardId, member);
    }

    @Patch("/edit/:boardId")
    @ApiBearerAuth()
    @ApiOperation({ summary: "게시글 수정" })
    @ApiResponse({status: HttpStatus.OK, description: '게시글 수정 성공 응답', type: ResponseDto,})
    @ApiParam({ name: 'boardId', type: Number, description: '게시글 번호' })
    @UseGuards(CustomAuthGuard)
    editBoard(
        @GetMember() member: Member,
        @Param("boardId") boardId: number,
        @Body() boardEditDto: BoardEditDto,
    ): Promise<ResponseDto> {
        this.logger.log(`member: ${JSON.stringify(member)}, boardId: ${boardId}, boardEditDto: ${JSON.stringify(boardEditDto)}`);

        return this.boardService.editBoard(member, boardId, boardEditDto);
    }
}
