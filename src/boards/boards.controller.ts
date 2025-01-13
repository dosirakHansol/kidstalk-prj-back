import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board, BoardStatus } from './board.model';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipe/board-status-validation.pipe';

@Controller('boards')
export class BoardsController {
    constructor(private boardService: BoardsService) {}

    @Get("/")
    getAllBoard(): Board[] {
        return this.boardService.getAllBoards();
    }

    @Post("/create")
    @UsePipes(ValidationPipe)
    createBoard(
        @Body() createBoardDto: CreateBoardDto
    ): Board {
        return this.boardService.createBoard(createBoardDto);
    }

    @Get('/:id')
    getBoardById(@Param('id') id: string): Board {
        return this.boardService.getBoardById(id);
    }

    @Delete('/:id')
    deleteBoardById(@Param('id') id: string): void {
        this.boardService.getBoardById(id);
    }

    @Patch("/:id/status")
    updateBoardStatus(
        @Param('id') id: string, 
        @Body('status', BoardStatusValidationPipe) status: BoardStatus
    ): Board {
        // console.log('id', id);
        // console.log('status', status);
        
        return this.boardService.updateBoardStatus(id, status);
    }


}
