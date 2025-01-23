import { Board } from "src/board/board.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class BoardFile extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Board, board => board.boardFile, {eager:false})
    board: Board;

    @Column()
    boardId: number;

    @Column({nullable: false})
    filePath: string;

    @Column({nullable: false})
    sort: number;

    //생성일시
    @CreateDateColumn({ default: () => "NOW()" })
    createAt: Date;
}