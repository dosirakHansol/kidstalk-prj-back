import { HttpStatus, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { BoardCreateDto, BoardEditDto } from './dto/board.dto';
import { Member } from 'src/auth/member.entity';
import { ResponseDto } from 'src/common/dto/response.dto';
import { BoardFileRepository } from 'src/board-file/board-file.repository';
import { RedisService } from 'src/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { BoardLikeService } from 'src/board-like/board-like.service';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(BoardRepository) private boardRepository: BoardRepository,
        @InjectRepository(BoardFileRepository) private boardFileRepository: BoardFileRepository,
        private boardLikeService: BoardLikeService,
        private fileuploadService: FileUploadService,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
    ) {}

    private logger = new Logger('BoardService');

    async createTempBoardData(
        boardCreateDto: BoardCreateDto, 
        member: Member
    ): Promise<ResponseDto> {
        //기존 임시저장 데이터 삭제
        await this.deleteTempBoardData(member);

        this.redisService.setJsonData(
            `temp_board_${member.id}`,
            boardCreateDto
        );

        return new ResponseDto(
            HttpStatus.OK, 
            "게시글 임시저장 성공", 
            {}
        );
    }

    async getTempBoardData(
        member: Member
    ): Promise<ResponseDto> {
        const tempBoard = await this.redisService.getJsonData(`temp_board_${member.id}`);

        return new ResponseDto(
            HttpStatus.OK, 
            "임시 게시글 조회 성공", 
            { tempBoard }
        );
    }

    async deleteTempBoardData(
        member: Member
    ): Promise<ResponseDto> {
        this.redisService.del(`temp_board_${member.id}`);

        return new ResponseDto(
            HttpStatus.OK, 
            "임시 게시글 삭제 성공", 
            {  }
        );
    }

    async createBoard(
        boardDto: BoardCreateDto,
        member: Member
    ): Promise<ResponseDto> {
        //임시 저장 게시글의 생성인경우, 임시저장 데이터를 삭제
        await this.deleteTempBoardData(member);

        //임시 파일을 board 경로로 이동
        for (const file of boardDto.fileList) {
            const res = await this.fileuploadService.moveFileToBoard(file.filePath);
            file.filePath = res.data.filePath;
        }

        this.logger.log(`board : ${JSON.stringify(boardDto)}`);

        return this.boardRepository.createBoard(boardDto, member);
    }

    async getBoardById(boardId: number, member: Member): Promise<ResponseDto> {
        const memberId = !member ? 0 : member.id;

        const res = await this.boardRepository.getBoardById(boardId, memberId);

        //게시글 총 좋아요 카운트
        res.data.board.likesCount = await this.boardLikeService.getBoardLikeCount(res.data.board.id, 0);

        //좋아요를 이미 눌렀는지 여부
        res.data.board.isLiked = res.data.board.boardLike.length > 0 ? true : false;

        return res;
    }

    async getBoardList(page: number, topicId: number, writerId: number, member: Member): Promise<ResponseDto> {
        const memberId = !member ? 0 : member.id;

        // 게시글 기본정보 가져오기
        const response = await this.boardRepository.getBoardList(page, topicId, writerId, memberId);

        // 게시글 파일 가져오기
        // foreach는 비동기 작업 수행이 잘안됨...
        // response.data.boards.forEach(async board => {
        //     this.logger.log('board', JSON.stringify(board));
        //     if(board.filesCount > 0){
        //         board.fileList = await this.boardFileRepository.findBy({ boardId: board.id });
        //     }
        // });
        for (const board of response.data.boards) {
            this.logger.log('board', JSON.stringify(board));
            if (board.filesCount > 0) {
                board.fileList = await this.boardFileRepository.findBy({ boardId: board.id });
            }
            //게시글 총 좋아요 카운트
            board.likesCount = await this.boardLikeService.getBoardLikeCount(board.id, 0);

            //좋아요를 이미 눌렀는지 여부
            board.isLiked = board.boardLike.length > 0 ? true : false;
        }

        return response;
    }

    async getBoardListCount(topicId: number, writerId: number, member: Member): Promise<ResponseDto> {
        this.logger.log("getBoardListCount..");
        const memberId = !member ? 0 : member.id;

        // 게시글 기본정보 가져오기
        return await this.boardRepository.getBoardListCount(topicId, writerId, memberId);
    }

    async increaseReadCount(boardId: number, member: Member): Promise<ResponseDto>{
        // TODO 중복 카운팅 방지? 필요한지...
        // const cacheKey = `impression:${userId}:${postId}:${type}`;
        // const isAlreadyCounted = await this.redisService.get(cacheKey);
        
        // if (isAlreadyCounted) {
        // return;
        // }

        return await this.boardRepository.increaseReadCount(boardId);
    }

    async editBoard(member: Member, boardId: number, boardEditDto: BoardEditDto): Promise<ResponseDto>{
        //게시글 작성자랑 맞는지 확인
        await this.checkBoardAuthorization(member, boardId);
        
        //게시글 수정 로직
        //1.타이틀 수정
        //2.내용수정
        this.boardRepository.update(
            boardId, 
            { 
                title: boardEditDto.title, 
                description: boardEditDto.description,
                updateAt: () => "NOW()"
            }
        );
        //3.사진수정

        return new ResponseDto(
            HttpStatus.OK, 
            "게시글 수정 성공", 
            {}
        );
    }

    async deleteBoard(member: Member, boardId: number): Promise<ResponseDto>{
        //게시글 작성자랑 맞는지 확인
        await this.checkBoardAuthorization(member, boardId);
        
        //게시글 삭제 -> isDel = true
        this.boardRepository.update(
            boardId, 
            { 
                isDel: true ,
                updateAt: () => "NOW()"
            }
        );

        return new ResponseDto(
            HttpStatus.OK, 
            "게시글 삭제 성공", 
            {}
        );
    }

    async hideBoard(member: Member, boardId: number): Promise<ResponseDto>{
        //게시글 작성자랑 맞는지 확인
        await this.checkBoardAuthorization(member, boardId);
        
        //게시글 삭제 -> isDel = true
        this.boardRepository.update(
            boardId, 
            { 
                isHidden: true ,
                updateAt: () => "NOW()"
            }
        );

        return new ResponseDto(
            HttpStatus.OK, 
            "게시글 숨김 성공", 
            {}
        );
    }

    async checkBoardAuthorization(member: Member, boardId: number) {
        //게시글 작성자랑 맞는지 확인
        const { memberId } = await this.boardRepository.findOneBy({id: boardId});

        this.logger.log(`writer Id : ${memberId} and requester id : ${member.id}`);

        if(!memberId) {
            throw new NotFoundException("게시글을 찾을 수 없습니다...");
        } else if(memberId != member.id) {
            throw new UnauthorizedException("게시글 관리 권한이 없습니다...");
        } else{
            return true;
        }
    }
}
