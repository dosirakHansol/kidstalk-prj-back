import { ConflictException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { MemberCredentialDto } from "./dto/member-credential.dto";
import { Member } from "./member.entity";
import { MemberDetail } from "./member-detail.entity";

@Injectable()
export class MemberRepository extends Repository<Member> {
    constructor(dataSource: DataSource) {
        super(Member, dataSource.createEntityManager());
    }

    private logger = new Logger('MemberRepository');
    
    async createMember(memberCredentialDto: MemberCredentialDto): Promise<void> {
        const { userId, name, password, location } = memberCredentialDto;

        this.logger.log(`input signup`, name, password, location );
        
        const memberDetail = new MemberDetail();
        memberDetail.email = 'test@email.com';
        memberDetail.tel = '000-0000-0000';
        memberDetail.permission = 1;

        //비밀번호 암호화
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const member = this.create({ 
            userId, name, password: hashedPassword, location, memberDetail
        });

        this.logger.log(`before save member entity : ${JSON.stringify(member)}`)

        try {
            const result = await this.save(member);
            this.logger.log(`insert success: ${JSON.stringify(result)}`);
        } catch (error) {
            if(error.code === '23505'){
                this.logger.error(`${error}`);
                throw new ConflictException('Existing username');
            } else{
                this.logger.error(`${error}`);
                throw new InternalServerErrorException(`Sever Error : ${error.message}`);
            }
        }
    }
}