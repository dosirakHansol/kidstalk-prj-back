import { Body, Controller, Get, HttpStatus, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { TopicService } from './topic.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
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

    @Get("/all/:page?")
    @ApiOperation({ summary: "모든 주제 불러오기" })
    @ApiParam({ name: 'page', type: Number, description: '페이지 넘버 (0부터 시작)' })
    @ApiResponse({status: HttpStatus.OK, description: '응답 메시지 (data에 topic배열)', type: ResponseDto,})
    getAllTopic(
        @Param('page') page?: number
    ): Promise<ResponseDto>
    {
        const pageNumber = page ? Number(page) : 0;
        return this.topicService.getAllTopic(pageNumber);
    }

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
}
