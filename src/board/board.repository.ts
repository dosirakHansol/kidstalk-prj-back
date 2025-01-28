import { ConflictException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
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

        const board = this.create({
            title,
            description,
            member,
            topicId,
            boardFile: fileList
        });

        try {
            const saveResult = await this.save(board);

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

    async getBoardById(boardId: number): Promise<ResponseDto> {
        const board = await this
            .createQueryBuilder('board')
            .leftJoinAndSelect('board.topic', 'topic') // Topic 관계 연결
            .leftJoinAndSelect('board.member', 'member') // Member 관계 연결
            .leftJoinAndSelect('board.boardFile', 'boardFile') // boardFiles 관계 추가
            .select([
                'board.id',
                'board.title',
                'board.description',
                'board.isDel',
                'board.isHidden',
                'topic.id',
                'topic.name',
                'member.id',
                'member.name',
                'member.location',
                'boardFile.filePath',
                'boardFile.sort',
            ])
            // .loadRelationCountAndMap('board.likesCount', 'board.boardLike') //따로 조회로 옮김
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

    async getBoardList(page: number, topicId: number, memberId: number): Promise<ResponseDto> {
        const queryBuilder = this
            .createQueryBuilder('board')
            .leftJoinAndSelect('board.topic', 'topic') // Topic 관계 연결
            .leftJoinAndSelect('board.member', 'member') // Member 관계 연결
            .select([
                'board.id',
                'board.title',
                'board.description',
                'topic.id',
                'topic.name',
                'member.id',
                'member.name',
                'member.location',
            ])
            // .loadRelationCountAndMap('board.likesCount', 'board.boardLike') //따로 조회로 옮김
            .loadRelationCountAndMap('board.filesCount', 'board.boardFile')
            .where('board.isDel = false AND board.isHidden = false')
            .limit(10)
            .offset(page * 10);
        
        if(!!topicId) queryBuilder.andWhere("topic.id = :topicId", { topicId });
        if(!!memberId) queryBuilder.andWhere("member.id = :memberId", { memberId });

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
}