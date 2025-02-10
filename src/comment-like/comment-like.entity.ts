import { Member } from "src/auth/member.entity";
import { Comment } from "src/comment/comment.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class CommentLike extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    //생성일시
    @CreateDateColumn({ default: () => "NOW()" })
    createAt: Date;

    @ManyToOne(type => Member, member => member.commentLike, {eager:false})
    member: Member;

    @Column()
    memberId: number;

    @ManyToOne(type => Comment, comment => comment.commentLike, {eager:false})
    comment: Comment;

    @Column()
    commentId: number;
}