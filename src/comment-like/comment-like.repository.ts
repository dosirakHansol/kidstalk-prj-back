import { HttpStatus, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ResponseDto } from "src/common/dto/response.dto";
import { Member } from "src/auth/member.entity";
import { CommentLike } from "./comment-like.entity";

@Injectable()
export class CommentLikeRepository extends Repository<CommentLike> {
    constructor(dataSource: DataSource) {
        super(CommentLike, dataSource.createEntityManager());
    }

    private logger = new Logger('CommentLikeRepository');

    async likeIn(
        member: Member,
        commentId: number
    ):Promise<ResponseDto> {
        const input = this.create({
            memberId: member.id,
            commentId: commentId,
        })

        try {
            await this.save(input);

            return new ResponseDto(
                HttpStatus.CREATED, 
                "댓글 좋아요 성공", 
                {}
            );
        } catch (error) {
            this.logger.error(JSON.stringify(error));
            throw new InternalServerErrorException(`Sever Error : ${error.message}`);
        }
    }

    async likeOut(
        member: Member,
        commentId: number
    ):Promise<ResponseDto> {
        try {
            await this.delete({
                commentId: commentId,
                memberId: member.id
            });

            return new ResponseDto(
                HttpStatus.CREATED, 
                "댓글 좋아요 취소 성공", 
                {}
            );
        } catch (error) {
            this.logger.error(JSON.stringify(error));
            throw new InternalServerErrorException(`Sever Error : ${error.message}`);
        }
    }

    //이미 같은댓글 좋아요 확인
    async checkExistLike(
        member: Member,
        commentId: number
    ):Promise<number> {
        return await this.countBy({
            commentId: commentId,
            memberId: member.id
        });
    }
}