import { Injectable, Logger } from "@nestjs/common";
import { BoardFile } from "./board-file.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class BoardFileRepository extends Repository<BoardFile> {
    constructor(dataSource: DataSource) {
        super(BoardFile, dataSource.createEntityManager());
    }

    private logger = new Logger('BoardFileRepository');
}