import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Member } from "src/auth/member.entity";
import { ResponseDto } from "src/common/dto/response.dto";
import { Board } from "./board.entity";
import { BoardCreateDto } from "./dto/board.dto";

@Injectable()
export class BoardRepository extends Repository<Board> {
    constructor(dataSource: DataSource) {
        super(Board, dataSource.createEntityManager());
    }

    private logger = new Logger('BoardRepository');

    async createBoard(
        boardDto: BoardCreateDto,
        member: Member
    ): Promise<ResponseDto> {
        const { title, description, topicId, fileList } = boardDto;

        this.logger.log(`board file : ${JSON.stringify(fileList)}`);

        const board = this.create({
            title,
            description,
            member,
            topicId,
            boardFile: fileList
        });

        try {
            const saveResult = await this.save(board); //save -> insert -> save로 다시 변경: CASCADE 적용안되는 문제로

            return new ResponseDto(
                HttpStatus.CREATED, 
                "게시글 생성 성공", 
                { saveResult }
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

    async getBoardById(boardId: number, memberId: number): Promise<ResponseDto> {
        const board = await this
            .createQueryBuilder('board')
            .leftJoinAndSelect('board.topic', 'topic') // Topic 관계 연결
            .leftJoinAndSelect('board.member', 'member') // Member 관계 연결
            .leftJoinAndSelect('board.boardFile', 'boardFile') // boardFiles 관계 추가
            .leftJoin('board.boardLike', 'boardlike', 'boardlike.boardId = board.id AND boardlike.memberId = :memberId', { memberId }) // 좋아요 여부 확인용
            .select([
                'board.id',
                'board.title',
                'board.description',
                'board.isDel',
                'board.isHidden',
                'board.readCnt',
                'topic.id',
                'topic.name',
                'member.id',
                'member.name',
                'member.location',
                'boardFile.filePath',
                'boardFile.sort',
                'boardlike.id',
            ])
            // .loadRelationCountAndMap('board.likesCount', 'board.boardLike') //총 좋아요 개수, 따로 조회로 옮김
            .where('board.id = :boardId', { boardId })
            .getOne();

        if(board) {
            if(board.isDel){
                throw new NotFoundException("삭제된 게시글 입니다.");
            } else if(board.isHidden) {
                throw new NotFoundException("숨김처리된 게시글 입니다.");
            } else {
                return new ResponseDto(
                    HttpStatus.OK, 
                    "게시글 조회 성공", 
                    { board }
                );
            }
        } else{
            throw new NotFoundException("해당 게시글을 찾을 수 없습니다.");
        }
    }

    async getBoardList(page: number, topicId: number, writerId: number, memberId: number): Promise<ResponseDto> {
        const queryBuilder = this
            .createQueryBuilder('board')
            .leftJoinAndSelect('board.topic', 'topic') // Topic 관계 연결
            .leftJoinAndSelect('board.member', 'member') // Member 관계 연결
            .leftJoin('board.boardLike', 'boardlike', 'boardlike.boardId = board.id AND boardlike.memberId = :memberId', { memberId }) // 좋아요 여부 확인용
            .select([
                'board.id',
                'board.title',
                'board.description',
                'board.readCnt',
                'topic.id',
                'topic.name',
                'member.id',
                'member.name',
                'member.location',
                'boardlike.id',
            ])
            // .loadRelationCountAndMap('board.likesCount', 'board.boardLike') //총 좋아요 개수, 따로 조회로 옮김
            .loadRelationCountAndMap('board.filesCount', 'board.boardFile') //게시글 첨부파일 카운트
            .loadRelationCountAndMap('board.commentCount', 'board.comment') //게시글 댓글수 카운트
            .where('board.isDel = false AND board.isHidden = false')
            .limit(10)
            .offset(page * 10)
            .orderBy("board.id", "DESC");
        
        if(!!topicId) queryBuilder.andWhere("topic.id = :topicId", { topicId });
        if(!!writerId) queryBuilder.andWhere("member.id = :writerId", { writerId });

        const boards = await queryBuilder.getMany();

        if(boards) {
            return new ResponseDto(
                HttpStatus.OK, 
                "게시글 조회 성공", 
                { boards }
            );
        } else{
            throw new NotFoundException("더이상 게시글이 없습니다.");
        }
    }

    async getBoardListCount(topicId: number, writerId: number, memberId: number): Promise<ResponseDto> {
        this.logger.log("getBoardListCount..");

        const queryBuilder = this.createQueryBuilder('board').where('board.isDel = false AND board.isHidden = false');
            
        if(!!topicId) {
            queryBuilder.leftJoinAndSelect('board.topic', 'topic') // Topic 관계 연결
            queryBuilder.andWhere("topic.id = :topicId", { topicId });
        }
        if(!!writerId) {
            queryBuilder.leftJoinAndSelect('board.member', 'member') // Member 관계 연결
            queryBuilder.andWhere("member.id = :writerId", { writerId });
        }

        const listCount = await queryBuilder.getCount();

        return new ResponseDto(
            HttpStatus.OK, 
            "게시글 개수", 
            { listCount }
        );
    }

    async increaseReadCount(boardId: number): Promise<ResponseDto>{
        try {
            await this.update(boardId, { readCnt: () => "readCnt + 1" });

            return new ResponseDto(
                HttpStatus.OK, 
                "조회수 증가 성공", 
                {}
            );
        } catch (error) {
            throw new BadRequestException("알수없는 오류 발생.");
        }
    }
}