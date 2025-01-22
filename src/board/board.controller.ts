import { Body, Controller, Get, HttpStatus, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BoardService } from './board.service';
import { CustomAuthGuard } from 'src/common/guard/custom-auth-guard';
import { GetMember } from 'src/auth/get-member-decorator';
import { Member } from 'src/auth/member.entity';
import { BoardCreateDto } from './dto/board.dto';
import { ResponseDto } from 'src/common/dto/response.dto';

@Controller('board')
@ApiTags("Board API")
export class BoardController {
    constructor(private boardService: BoardService){}
    
    private logger = new Logger("TopicController");

    @Post("/create")
    @ApiOperation({ summary: "게시글 생성" })
    @ApiBearerAuth()
    @UseGuards(CustomAuthGuard)
    createTopic(
        @Body() boardCreateDto: BoardCreateDto,
        @GetMember() member: Member
    ): Promise<ResponseDto> {
        return this.boardService.createBoard(boardCreateDto, member);
    }

    @Get("/:boardId")
    @ApiOperation({ summary: "게시글 번호로 게시글 조회" })
    @ApiParam({ name: 'boardId', type: Number, description: '게시글 번호' })
    @ApiResponse({status: HttpStatus.OK, description: '응답 메시지 (data에 게시글 정보)', type: ResponseDto,})
    getBoardById(
        @Param('boardId') boardId: number
    ): Promise<ResponseDto>
    {
        return this.boardService.getBoardById(boardId);
    }

    @Get("/all/:page?")
    @ApiOperation({ summary: "모든 게시글 불러오기" })
    @ApiParam({ name: 'page', type: Number, description: '페이지 넘버 (0부터 시작)' })
    @ApiResponse({status: HttpStatus.OK, description: '응답 메시지 (data에 board배열)', type: ResponseDto,})
    getAllTopic(
        @Param('page') page?: number
    ): Promise<ResponseDto>
    {
        const pageNumber = page ? Number(page) : 0;
        return this.boardService.getAllBoard(pageNumber);
    }

}
