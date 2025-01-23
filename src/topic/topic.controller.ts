import { Body, Controller, Get, HttpStatus, Logger, Param, Post, Query, UseGuards } from '@nestjs/common';
import { TopicService } from './topic.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Topic } from './topic.entity';
import { ResponseDto } from 'src/common/dto/response.dto';
import { TopicCreateDto } from './dto/topic.dto';
import { GetMember } from 'src/auth/get-member-decorator';
import { Member } from 'src/auth/member.entity';
import { CustomAuthGuard } from 'src/common/guard/custom-auth-guard';

@Controller('topic')
@ApiTags('Topic API')
export class TopicController {
    constructor(private topicService: TopicService){}

    private logger = new Logger("TopicController");

    @Post("/create")
    @ApiOperation({ summary: "주제 생성" })
    @ApiBearerAuth()
    @UseGuards(CustomAuthGuard)
    createTopic(
        @Body() topicDto: TopicCreateDto,
        @GetMember() member: Member
    ): Promise<ResponseDto> {
        return this.topicService.createTopic(topicDto, member);
    }

    @Get()
    @ApiOperation({ summary: "주제 목록 불러오기" })
    @ApiQuery({ name: 'page', type: Number, description: '페이지 넘버 (0부터 시작, 현재 limit 없어서 0 넣으면 전체 조회됨)', required: false, default: 0 })
    @ApiResponse({status: HttpStatus.OK, description: '응답 메시지 (data에 topic배열)', type: ResponseDto,})
    getTopicList(
        @Query('page') page: number = 0
    ): Promise<ResponseDto>
    {
        return this.topicService.getTopicList(page);
    }
}
