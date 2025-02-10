import { BadRequestException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentRepository } from './comment.repository';
import { CommentCreateDto } from './dto/comment.dto';
import { Member } from 'src/auth/member.entity';
import { ResponseDto } from 'src/common/dto/response.dto';
import { CommentLikeService } from 'src/comment-like/comment-like.service';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentRepository) 
        private commentRepository: CommentRepository,
        private commentLikeService: CommentLikeService,
    ) {}

    private logger = new Logger('CommentService');

    async createComment(
        commentCreateDto: CommentCreateDto,
        member: Member
    ): Promise<ResponseDto> {
        return this.commentRepository.createComment(commentCreateDto, member);
    }

    async countCommentByBoardId(
        boardId: number
    ): Promise<ResponseDto> {
        const commentCount = await this.commentRepository.countBy({boardId});

        return new ResponseDto(
            HttpStatus.OK, 
            "댓글 개수 조회 성공", 
            { commentCount }
        );
    }

    async getCommentList(
        page: number,
        limit: number,
        boardId: number,
        writerId: number,
        parentId: number,
        member: Member
    ): Promise<ResponseDto> {
        // 파라미터 검증
        // 1. boardId가 0인데, writerId도 0인경우
        if(boardId == 0 && writerId == 0) 
            throw new BadRequestException("게시글 번호를 입력하거나, 작성자 번호를 입력해주세요.");
        // 2. 이상한 값 검증
        if(page < 0 || limit < 0 || boardId < 0 || writerId < 0 || parentId < 0)
            throw new BadRequestException("올바른 값을 입력하시오.");

        const memberId = !member ? 0 : member.id;

        const res = await this.commentRepository.getCommentList(page, limit, boardId, writerId, parentId, memberId);

        this.logger.log('res :', JSON.stringify(res));

        // 부모댓글(대댓글이 아닌) 조회시엔 각 댓글에 대한 자식댓글 수도 담아준다.
        if(parentId == 0) {
            for (const comment of res.data.commentList) {
                comment.childCommentCount = await this.commentRepository.countBy({parentId: comment.id});
                //댓글 총 좋아요 카운트
                comment.likesCount = await this.commentLikeService.getCommentLikeCount(comment.id, 0);
                //좋아요를 이미 눌렀는지 여부
                comment.isLiked = comment.commentLike.length > 0 ? true : false;
            }
        } else {
            for (const comment of res.data.commentList) {
                //댓글 총 좋아요 카운트
                comment.likesCount = await this.commentLikeService.getCommentLikeCount(comment.id, 0);
                //좋아요를 이미 눌렀는지 여부
                comment.isLiked = comment.commentLike.length > 0 ? true : false;
            }
        }

        return res;
    }
}
