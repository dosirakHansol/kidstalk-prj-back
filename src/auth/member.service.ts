import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from "bcryptjs";
import { JwtService } from '@nestjs/jwt';
import { MemberCredentialDto } from './dto/member-credential.dto';
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
        memberCredentialDto: MemberCredentialDto
    ): Promise<void> {
        return this.memberRepository.createMember(memberCredentialDto);
    }
}
