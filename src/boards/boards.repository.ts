import { DataSource, Repository } from "typeorm";
import { Board } from "./board.entity";
import { Injectable } from "@nestjs/common";
import { CreateBoardDto } from "./dto/create-board.dto";
import { BoardStatus } from "./board-status.enum";
import { User } from "src/auth/user.entity";

@Injectable()
export class BoardsRepository extends Repository<Board> {
    constructor(dataSource: DataSource) {
        super(Board, dataSource.createEntityManager());
    }
    
    /**
     * @param createBoardDto
     * @description create board
     * @returns Board
     */
    async createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
        const { title, description } = createBoardDto;

        const board: Board = this.create({
            title,
            description,
            status: BoardStatus.PUBLIC,
            user
        });

        await this.save(board);
        return board;
    }

    async getAllBoardsByUserId(user: User): Promise<Board[]> {
        const query = this.createQueryBuilder('board');

        query.where('board.userId = :userId', { userId: user.id });
        const boards = await query.getMany();

        return boards;
    }
}