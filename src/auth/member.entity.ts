import { Board } from "src/boards/board.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { MemberDetail } from "./member-detail.entity";

@Entity()
@Unique(['userId', 'name'])
export class Member extends BaseEntity {
    //회원 고유번호
    @PrimaryGeneratedColumn()
    id: number;

    //로그인시 입력 아이디
    @Column({length: 20})
    userId: string;

    //닉네임
    @Column({length: 20})
    name: string;

    //비밀번호
    @Column()
    password: string;

    //지역
    @Column()
    location: string = null;

    //sns연동여부
    @Column()
    isSns: boolean = false;

    //프로필공개여부
    @Column()
    isOpen: boolean = false;

    //탈퇴여부
    @Column()
    isDrop: boolean = false;

    //생성일시
    @CreateDateColumn({default: () => "now()::date + '30 day'::interval"})
    passwordExpired: Date;

    //생성일시
    @CreateDateColumn({default: () => "NOW()"})
    createAt: Date;

    //수정일시
    @CreateDateColumn({default: () => "NOW()"})
    updateAt: Date;

    @OneToOne(() => MemberDetail, {cascade: true})
    @JoinColumn()
    memberDetail: MemberDetail;

    // @OneToMany(type => Board, board => board.user, { eager:true })
    // boards: Board[];
}