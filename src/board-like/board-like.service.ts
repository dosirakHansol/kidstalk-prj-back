import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardLikeRepository } from './board-like.repository';
import { ResponseDto } from 'src/common/dto/response.dto';
import { Member } from 'src/auth/member.entity';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class BoardLikeService {
    constructor(
        @InjectRepository(BoardLikeRepository)
        private boardLikeRepository: BoardLikeRepository,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
    ) {}

    private logger = new Logger("BoardLikeService");

    async likeIn(
        member: Member,
        boardId: number
    ): Promise<ResponseDto> {
        const existLikeCount = await this.boardLikeRepository.checkExistLike(member, boardId);

        if(existLikeCount > 0) {
            //유저가 이미 좋아요 한 경우 INSERT 안하고 성공메시지 출력
            return new ResponseDto(
                HttpStatus.CREATED, 
                "게시글 좋아요 성공", 
                {}
            );
        } else {
            //Redis에서 총 좋아요 개수 업데이트
            await this.getBoardLikeCount(boardId, 1);

            //유저가 이미 좋아요 안한 경우 DB INSERT
            return await this.boardLikeRepository.likeIn(member, boardId);
        }
    }

    async likeOut(
        member: Member,
        boardId: number
    ): Promise<ResponseDto> {
        const existLikeCount = await this.boardLikeRepository.checkExistLike(member, boardId);

        if(existLikeCount > 0) {
            //Redis에서 총 좋아요 개수 업데이트
            await this.getBoardLikeCount(boardId, -1);
        }

        return await this.boardLikeRepository.likeOut(member, boardId);
    }

    async likeCount(
        boardId: number
    ): Promise<ResponseDto> {
        const likeCount = await this.boardLikeRepository.countBy({boardId: boardId});

        return new ResponseDto(
            HttpStatus.OK, 
            "게시글 좋아요 개수 조회 성공", 
            { likeCount }
        );
    }

    async getBoardLikeCount(
        boardId: number,        //게시글 번호
        incrementVal: number    //좋아요 개수 증감수
    ):Promise<number> {
        //레디스에 해당 게시글 좋아요 개수 있는지 확인
        const redisLikesCount = await this.redisService.get(`boardLike_${boardId}`);
        this.logger.log(`redis val : ${redisLikesCount}`);
        
        if(!!redisLikesCount){
            this.logger.log(`return redis val and incrementVal : ${incrementVal}`);

            // 증감값 있는 경우 Redis 값 업데이트
            if(incrementVal != 0){
                this.redisService.del(`boardLike_${boardId}`); //기존값 삭제

                //좋아요 카운트 Redis에 저장
                await this.redisService.set(
                    `boardLike_${boardId}`, //key`
                    String(Number(redisLikesCount) + incrementVal), //value
                    this.configService.get("REDIS_CACHE_TTL") //ttl
                );
            }

            //레디스에 값이 있으면 레디스의 값으로 리턴
            return Number(redisLikesCount) + incrementVal;
        } else {
            this.logger.log(`return postgres val and incrementVal : ${incrementVal}`);

            //레디스에 값이 없으면 DB에서 조회
            const likesCount = await this.boardLikeRepository.countBy({
                boardId: boardId
            });
    
            //좋아요 카운트 Redis에 저장
            await this.redisService.set(
                `boardLike_${boardId}`, //key`
                String(likesCount + incrementVal), //value
                this.configService.get("REDIS_CACHE_TTL") //ttl
            );
    
            return likesCount;
        }
    }
}
