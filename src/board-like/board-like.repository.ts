import { HttpStatus, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { BoardLike } from "./board-like.entity";
import { DataSource, Repository } from "typeorm";
import { ResponseDto } from "src/common/dto/response.dto";
import { Member } from "src/auth/member.entity";

@Injectable()
export class BoardLikeRepository extends Repository<BoardLike> {
    constructor(dataSource: DataSource) {
        super(BoardLike, dataSource.createEntityManager());
    }

    private logger = new Logger('BoardRepository');

    async likeIn(
        member: Member,
        boardId: number
    ):Promise<ResponseDto> {
        const input = this.create({
            memberId: member.id,
            boardId: boardId,
        })

        try {
            await this.save(input);

            return new ResponseDto(
                HttpStatus.CREATED, 
                "게시글 좋아요 성공", 
                {}
            );
        } catch (error) {
            this.logger.error(JSON.stringify(error));
            throw new InternalServerErrorException(`Sever Error : ${error.message}`);
        }
    }

    async likeOut(
        member: Member,
        boardId: number
    ):Promise<ResponseDto> {
        try {
            await this.delete({
                boardId: boardId,
                memberId: member.id
            });

            return new ResponseDto(
                HttpStatus.CREATED, 
                "게시글 좋아요 취소 성공", 
                {}
            );
        } catch (error) {
            this.logger.error(JSON.stringify(error));
            throw new InternalServerErrorException(`Sever Error : ${error.message}`);
        }
    }

    //이미 같은게시글 좋아요 확인
    async checkExistLike(
        member: Member,
        boardId: number
    ):Promise<number> {
        return await this.countBy({
            boardId: boardId,
            memberId: member.id
        });
    }
}