import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { v1 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardsRepository } from './boards.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(BoardsRepository)
        private boardsRepository: BoardsRepository
    ) {}

    async getBoardById(id: number): Promise<Board> {
        const found: Board = await this.boardsRepository.findOneBy({id: id});

        if(!found) throw new NotFoundException(`Cant't find board with id ${id}`);

        return found;
    }

    async createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
        return await this.boardsRepository.createBoard(createBoardDto, user);
    }

    async deleteBoard(id: number): Promise<void> {
        const result = await this.boardsRepository.delete(id);

        if(result.affected === 0) throw new NotFoundException(`Can't find board with id ${id}`);

        console.log(result);
    }

    async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
        const board = await this.getBoardById(id);

        board.status = status;
        await this.boardsRepository.save(board);

        return board;
    }

    async getAllBoards(): Promise<Board[]>{
        return await this.boardsRepository.find();
    }

    async getAllBoardsByUserId(user: User): Promise<Board[]>{
        return await this.boardsRepository.getAllBoardsByUserId(user);
    }

    // getAllBoards(): Board[] {
    //     return this.boards;
    // }

    // createBoard(createBoardDto: CreateBoardDto): Board {
    //     const { title, description } = createBoardDto;

    //     const board: Board = {
    //         id: uuid(),
    //         title,
    //         description,
    //         status: BoardStatus.PUBLIC
    //     }

    //     this.boards.push(board);
    //     return board;
    // }

    // getBoardById(id: string): Board {
    //     const found : Board = this.boards.find((board) => board.id === id);

    //     if(!found) throw new NotFoundException(`Cant't find board with id ${id}`);

    //     return found;
    // }

    // deleteBoard(id: string): void {
    //     const found : Board = this.getBoardById(id);
    //     this.boards = this.boards.filter((board) => board.id !== found.id);
    // }

    // updateBoardStatus(id: string, status: BoardStatus): Board {
    //     const board = this.getBoardById(id);
    //     board.status = status;
    //     return board;
    // }
}
