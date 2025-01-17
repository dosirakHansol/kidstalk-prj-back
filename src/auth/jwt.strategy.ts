import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { MemberRepository } from "./member.repository";
import { Member } from "./member.entity";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(MemberRepository)
        private memberRepository: MemberRepository,
        private readonly configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get("JWT_SECRET_KEY"),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload) {
        const { userId } = payload;
        const member: Member = await this.memberRepository.findOneBy({ userId });

        if(!member) {
            throw new UnauthorizedException();
        }

        return member;
    }
}