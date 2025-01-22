import { Member } from "src/auth/member.entity";
import { Board } from "src/board/board.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['name'])
export class Topic extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    // 주제이름
    @Column()
    @Column({length: 20})
    name: string;

    //주제 설명
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
    @CreateDateColumn({ default: () => "NOW()" })
    createAt: Date;

    //수정일시
    @CreateDateColumn({ default: () => "NOW()" })
    updateAt: Date;

    @ManyToOne(type => Member, member => member.topic, {eager:false})
    member: Member;

    @OneToMany(
        type => Board, 
        board => board.topic, 
        { eager:false }
    )
    board: Board[];
}