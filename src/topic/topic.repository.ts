import { ConflictException, HttpStatus, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Topic } from "./topic.entity";
import { TopicCreateDto } from "./dto/topic.dto";
import { Member } from "src/auth/member.entity";
import { ResponseDto } from "src/common/dto/response.dto";

@Injectable()
export class TopicRepository extends Repository<Topic> {
    constructor(dataSource: DataSource) {
        super(Topic, dataSource.createEntityManager());
    }

    private logger = new Logger('TopicRepository');

    async createTopic(
        topicDto: TopicCreateDto,
        member: Member
    ): Promise<ResponseDto> {
        const { name, description } = topicDto;

        const topic = this.create({
            name,
            description,
            member
        });

        try {
            await this.save(topic);

            return new ResponseDto(
                HttpStatus.CREATED, 
                "주제 생성 성공", 
                {}
            );
        } catch (error) {
            this.logger.error(JSON.stringify(error));

            if(error.code === '23505'){
                throw new ConflictException(`${error.message}`);
            } else{
                throw new InternalServerErrorException(`Sever Error : ${error.message}`);
            }
        }
    }
}