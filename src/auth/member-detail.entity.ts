import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Member } from "./member.entity";

@Entity()
export class MemberDetail extends BaseEntity {
    // member의 id를 PK로 사용
    @PrimaryColumn()
    id: number;

    @OneToOne(() => Member, (member) => member.memberDetail)
    @JoinColumn({ name: 'id' }) // member.id를 참조
    member: Member;

    //프로필사진
    @Column({nullable: true})
    memberImg: string;

    //이메일
    @Column({length: 40, nullable: true})
    email: string;

    //휴대폰번호 (000-0000-0000)
    @Column({length: 13, nullable: true})
    tel: string;

    //권한(번호)
    @Column()
    permission: number = 1;

    //생성일시
    @CreateDateColumn({default: () => "CURRENT_TIMESTAMP()"})
    createAt: Date;

    //수정일시
    @CreateDateColumn({default: () => "CURRENT_TIMESTAMP()"})
    updateAt: Date;
}