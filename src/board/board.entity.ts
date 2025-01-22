import { Member } from "src/auth/member.entity";
import { Topic } from "src/topic/topic.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['title'])
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
}