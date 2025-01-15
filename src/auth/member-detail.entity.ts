import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Member } from "./member.entity";

@Entity()
export class MemberDetail extends BaseEntity {
    //고유번호
    @PrimaryGeneratedColumn()
    id: number;

    //이메일
    @Column({length: 40})
    email: string;

    //휴대폰번호 (000-0000-0000)
    @Column({length: 13})
    tel: string;

    //권한(번호)
    @Column()
    permission: number;

    //생성일시
    @CreateDateColumn({default: () => "CURRENT_TIMESTAMP()"})
    createAt: Date;

    //수정일시
    @CreateDateColumn({default: () => "CURRENT_TIMESTAMP()"})
    updateAt: Date;
    
    //회원 고유번호
    @OneToOne(() => Member)
    member: Member;
}