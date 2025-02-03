import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { MemberDetail } from "./member-detail.entity";
import { Topic } from "src/topic/topic.entity";
import { Board } from "src/board/board.entity";
import { BoardLike } from "src/board-like/board-like.entity";

@Entity()
export class Member extends BaseEntity {
    //회원 고유번호
    @PrimaryGeneratedColumn()
    id: number;

    //로그인시 입력 아이디
    @Column({length: 20, unique: true})
    userId: string;

    //닉네임
    @Column({length: 20, unique: true})
    name: string;

    //비밀번호
    @Column()
    password: string;

    //지역
    @Column()
    location: string;

    //sns연동여부
    @Column({ default: false })
    isSns: boolean;

    //프로필공개여부
    @Column({ default: false })
    isOpen: boolean;

    //탈퇴여부
    @Column({ default: false })
    isDrop: boolean;

    //생성일시
    @CreateDateColumn({default: () => "now()::date + '30 day'::interval"})
    passwordExpired: Date;

    //생성일시
    @CreateDateColumn({default: () => "NOW()"})
    createAt: Date;

    //수정일시
    @CreateDateColumn({default: () => "NOW()"})
    updateAt: Date;

    @OneToOne(
        () => MemberDetail, 
        (memberDetail) => memberDetail.member,
        {cascade: true}
    )
    memberDetail: MemberDetail;

    @OneToMany(
        type => Topic, 
        topic => topic.member, 
        { eager:false }
    )
    topic: Topic[];

    @OneToMany(
        type => Board, 
        board => board.member, 
        { eager:false }
    )
    board: Board[];

    @OneToMany(
        type => BoardLike, 
        boardLike => boardLike.member, 
        { eager:false }
    )
    boardLike:BoardLike[];
}