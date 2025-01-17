import { ConflictException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { MemberSignInDto, MemberSignUpDto } from './dto/member-credential.dto';
import { Member } from "./member.entity";
import { MemberDetail } from "./member-detail.entity";
import { ResponseDto } from "src/common/dto/response.dto";
import { HttpStatus } from "@nestjs/common";
import { MemberDetailDto } from "./dto/member-detail.dto";

@Injectable()
export class MemberRepository extends Repository<Member> {
    constructor(dataSource: DataSource) {
        super(Member, dataSource.createEntityManager());
    }

    private logger = new Logger('MemberRepository');
    private responseDto = new ResponseDto;
    
    async createMember(memberSignUpDto: MemberSignUpDto): Promise<ResponseDto> {
        const { userId, name, password, location, detail } = memberSignUpDto;

        //비밀번호 암호화
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        //detail쪽 값이 빈 경우
        let memberDetail: MemberDetailDto = !detail ? new MemberDetailDto() : detail;

        const member = this.create({ 
            userId, 
            name, 
            password: hashedPassword, 
            location, 
            memberDetail: memberDetail
        });

        this.logger.log(`before save member entity : ${JSON.stringify(member)}`)

        try {
            await this.save(member);

            this.responseDto.statusCode = HttpStatus.CREATED;
            this.responseDto.message = "회원가입 성공";
        } catch (error) {
            this.logger.error(JSON.stringify(error));

            if(error.code === '23505'){
                throw new ConflictException(`${error.message}`);
            } else{
                throw new InternalServerErrorException(`Sever Error : ${error.message}`);
            }

            // this.responseDto.statusCode = HttpStatus.BAD_REQUEST;
            // this.responseDto.message = `회원가입 실패 ${error}`;
        }

        return this.responseDto;
    }
}