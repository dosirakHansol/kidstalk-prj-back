import { Member } from "src/auth/member.entity";
import { BoardFile } from "src/board-file/board-file.entity";
import { BoardLike } from "src/board-like/board-like.entity";
import { Topic } from "src/topic/topic.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class Board extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    //게시글 이름
    @Column()
    @Column({length: 20})
    title: string;

    //게시글 설명
    @Column()
    @Column({length: 20})
    description: string;

    //삭제 여부
    @Column({ default: false })
    isDel: boolean;

    //숨김 여부
    @Column({ default: false })
    isHidden: boolean;

    //생성일시
    @CreateDateColumn({default: () => "NOW()"})
    createAt: Date;

    //수정일시
    @CreateDateColumn({default: () => "NOW()"})
    updateAt: Date;

    @ManyToOne(type => Member, member => member.board, {eager:false})
    member: Member;

    @ManyToOne(type => Topic, topic => topic.board, {eager:false})
    topic: Topic;

    @Column()
    topicId: number;

    @OneToMany(
        type => BoardLike, 
        boardLike => boardLike.board, 
        { eager:false }
    )
    boardLike: BoardLike[];

    @OneToMany(
        type => BoardFile, 
        boardFile => boardFile.board, 
        { cascade: true, eager: false },
    )
    boardFile: BoardFile[];
}