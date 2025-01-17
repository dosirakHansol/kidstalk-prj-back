import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from "bcryptjs";
import { JwtService } from '@nestjs/jwt';
import { MemberSignInDto, MemberSignUpDto } from './dto/member-credential.dto';
import { MemberRepository } from './member.repository';

@Injectable()
export class MemberService {
    constructor(
        @InjectRepository(MemberRepository)
        private memberRepository: MemberRepository,
        private jwtService: JwtService
    ) {}

    private logger = new Logger('MemberService');

    async signUp(
        memberSignUpDto: MemberSignUpDto
    ): Promise<void> {
        return this.memberRepository.createMember(memberSignUpDto);
    }

    async signIn(
        memberSignInDto: MemberSignInDto
    ): Promise<{accessToken: string}> {
        const { userId, password } = memberSignInDto;
        const user = this.memberRepository.findOneBy({ userId });
        
        if(user && (await bcrypt.compare(password, (await user).password))){
            // 유저 토큰 생성 (secret + payload)
            const payload = { userId };
            const accessToken = await this.jwtService.sign(payload);
            
            this.logger.log(`login success... Token: ${accessToken}`);

            return { accessToken };
        } else{
            throw new UnauthorizedException('login faild: not match password..');
        }
    }
}
