import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from 'src/redis/redis.service';
import { CommentLikeRepository } from './comment-like.repository';
import { ResponseDto } from 'src/common/dto/response.dto';
import { Member } from 'src/auth/member.entity';

@Injectable()
export class CommentLikeService {
    constructor(
        @InjectRepository(CommentLikeRepository)
        private commentLikeRepository: CommentLikeRepository,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
    ) {}

    private logger = new Logger("CommentLikeService");
    
    async likeIn(
        member: Member,
        commentId: number
    ): Promise<ResponseDto> {
        const existLikeCount = await this.commentLikeRepository.checkExistLike(member, commentId);

        if(existLikeCount > 0) {
            //유저가 이미 좋아요 한 경우 INSERT 안하고 성공메시지 출력
            return new ResponseDto(
                HttpStatus.CREATED, 
                "게시글 좋아요 성공", 
                {}
            );
        } else {
            //Redis에서 총 좋아요 개수 업데이트
            await this.getCommentLikeCount(commentId, 1);

            //유저가 이미 좋아요 안한 경우 DB INSERT
            return await this.commentLikeRepository.likeIn(member, commentId);
        }
    }

    async likeOut(
        member: Member,
        commentId: number
    ): Promise<ResponseDto> {
        const existLikeCount = await this.commentLikeRepository.checkExistLike(member, commentId);

        if(existLikeCount > 0) {
            //Redis에서 총 좋아요 개수 업데이트
            await this.getCommentLikeCount(commentId, -1);
        }

        return await this.commentLikeRepository.likeOut(member, commentId);
    }

    async likeCount(
        commentId: number
    ): Promise<ResponseDto> {
        const likeCount = await this.commentLikeRepository.countBy({commentId: commentId});

        return new ResponseDto(
            HttpStatus.OK, 
            "게시글 좋아요 개수 조회 성공", 
            { likeCount }
        );
    }

    async getCommentLikeCount(
        commentId: number,        //게시글 번호
        incrementVal: number    //좋아요 개수 증감수
    ):Promise<number> {
        //레디스에 해당 게시글 좋아요 개수 있는지 확인
        const redisLikesCount = await this.redisService.get(`CommentLike_${commentId}`);
        this.logger.log(`redis val : ${redisLikesCount}`);
        
        if(!!redisLikesCount){
            this.logger.log(`return redis val and incrementVal : ${incrementVal}`);

            // 증감값 있는 경우 Redis 값 업데이트
            if(incrementVal != 0){
                this.redisService.del(`CommentLike_${commentId}`); //기존값 삭제

                //좋아요 카운트 Redis에 저장
                await this.redisService.set(
                    `CommentLike_${commentId}`, //key`
                    String(Number(redisLikesCount) + incrementVal), //value
                    this.configService.get("REDIS_CACHE_TTL") //ttl
                );
            }

            //레디스에 값이 있으면 레디스의 값으로 리턴
            return Number(redisLikesCount) + incrementVal;
        } else {
            this.logger.log(`return postgres val and incrementVal : ${incrementVal}`);

            //레디스에 값이 없으면 DB에서 조회
            const likesCount = await this.commentLikeRepository.countBy({
                commentId: commentId
            });
    
            //좋아요 카운트 Redis에 저장
            await this.redisService.set(
                `CommentLike_${commentId}`, //key`
                String(likesCount + incrementVal), //value
                this.configService.get("REDIS_CACHE_TTL") //ttl
            );
    
            return likesCount;
        }
    }
}
