import { Member } from "src/auth/member.entity";
import { Board } from "src/board/board.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class BoardLike extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    //생성일시
    @CreateDateColumn({ default: () => "NOW()" })
    createAt: Date;

    @ManyToOne(type => Member, member => member.boardLike, {eager:false})
    member: Member;

    @Column()
    memberId: number;

    @ManyToOne(type => Board, board => board.boardLike, {eager:false})
    board: Board;

    @Column()
    boardId: number;
}