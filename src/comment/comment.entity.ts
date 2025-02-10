import { Member } from "src/auth/member.entity";
import { Board } from "src/board/board.entity";
import { CommentLike } from "src/comment-like/comment-like.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    //회원테이블 관계
    @ManyToOne(type => Member, member => member.comment, {eager:false})
    member: Member;

    @Column()
    memberId: number;

    //게시글테이블 관계
    @ManyToOne(type => Board, board => board.comment, {eager:false})
    board: Board;

    @Column()
    boardId: number;

    //부모댓글 고유번호 (부모댓글 없으면 0)
    @Column()
    parentId: number;

    //댓글내용
    @Column()
    description: string;

    //삭제 여부
    @Column({ default: false })
    isDel: boolean;

    //생성일시
    @CreateDateColumn({default: () => "NOW()"})
    createAt: Date;

    //수정일시
    @CreateDateColumn({default: () => "NOW()"})
    updateAt: Date;

    //댓글 좋아요
    @OneToMany(
        type => CommentLike, 
        commentLike => commentLike.comment, 
        { cascade: false, eager: false },
    )
    commentLike: CommentLike[];
}