import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { TopicRepository } from './topic.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from './topic.entity';
import { ResponseDto } from 'src/common/dto/response.dto';
import { TopicDto } from './dto/topic.dto';
import { Member } from 'src/auth/member.entity';

@Injectable()
export class TopicService {
    constructor(
        @InjectRepository(TopicRepository)
        private topicRepository: TopicRepository,
    ) {}

    private logger = new Logger('TopicService');

    async getAllTopic(page: number): Promise<ResponseDto> {
        const topics = this.topicRepository.find({
            take: 10, 
            skip: page * 10
        });
        return new ResponseDto(
            HttpStatus.OK, 
            "주제 조회 성공", 
            { topics }
        );
    }

    async createTopic(
        topicDto: TopicDto,
        member: Member
    ): Promise<ResponseDto> {
        return this.topicRepository.createTopic(topicDto, member);
    }
}
