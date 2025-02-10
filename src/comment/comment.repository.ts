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
        parentId: number,
        memberId: number
    ):Promise<ResponseDto> {


        const queryBuilder = this.createQueryBuilder('comment')
            .leftJoin(
                'comment.commentLike',
                'commentLike',
                'commentLike.commentId = comment.id AND commentLike.memberId = :memberId',
                { memberId }
            ) // 좋아요 여부 확인용
            .select([
                'comment.id',
                'comment.parentId',
                'comment.description',
                'comment.createAt',
                'comment.updateAt',
                'commentLike.id',
            ])
            .where('comment.isDel = false')
            .andWhere('comment.parentId = :parentId', { parentId }) // `parent_id` → `parentId` 수정
            .limit(limit)
            .offset(page * 10)
            .orderBy('comment.id', 'DESC');

        if(!!writerId && writerId != 0) queryBuilder.andWhere("comment.memberId = :writerId", { writerId });
        if(!!boardId && boardId != 0) queryBuilder.andWhere("comment.boardId = :boardId", { boardId });


        const commentList = await queryBuilder.getMany();

        return new ResponseDto(
            HttpStatus.CREATED, 
            "댓글 조회 성공", 
            { commentList }
        );
    }
}