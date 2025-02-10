import { ConflictException, HttpStatus, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { Comment } from "./comment.entity";
import { DataSource, Repository } from "typeorm";
import { CommentCreateDto } from "./dto/comment.dto";
import { Member } from "src/auth/member.entity";
import { ResponseDto } from "src/common/dto/response.dto";

@Injectable()
export class CommentRepository extends Repository<Comment> {
    constructor(dataSource: DataSource) {
        super(Comment, dataSource.createEntityManager());
    }

    private logger = new Logger('CommentRepository');

    async createComment(
        commentCreateDto: CommentCreateDto,
        member: Member
    ): Promise<ResponseDto> {
        const { boardId, parentId, description } = commentCreateDto;

        const comment = this.create({
            boardId,
            parentId,
            description,
            member
        });

        try {
            const saveResult = await this.insert(comment);

            return new ResponseDto(
                HttpStatus.CREATED, 
                "댓글 생성 성공", 
                { saveResult }
            );
        } catch (error) {
            this.logger.error(JSON.stringify(error));
            throw new InternalServerErrorException(`Sever Error : ${error.message}`);
        }
    }

    async getCommentList(
        page: number,
        limit: number,
        boardId: number,
        writerId: number,
        parentId: number
    ):Promise<ResponseDto> {
        const queryBuilder = this.createQueryBuilder('comment')
            .where('board_id = :boardId', { boardId })
            .andWhere("parent_id = :parentId", { parentId })
            .limit(limit)
            .offset(page * 10)
            .orderBy("id", "DESC");

        if(!!writerId && writerId != 0) queryBuilder.andWhere("member_id = :writerId", { writerId });

        const commentList = await queryBuilder.getMany();

        return new ResponseDto(
            HttpStatus.CREATED, 
            "댓글 조회 성공", 
            { commentList }
        );
    }
}