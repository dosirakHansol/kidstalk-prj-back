import { HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from "bcryptjs";
import { JwtService } from '@nestjs/jwt';
import { MemberSignInDto, MemberSignUpDto } from './dto/member-credential.dto';
import { MemberRepository } from './member.repository';
import { ResponseDto } from 'src/common/dto/response.dto';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis/redis.service';
import { Member } from './member.entity';

@Injectable()
export class MemberService {
    constructor(
        @InjectRepository(MemberRepository)
        private memberRepository: MemberRepository,
        private jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
    ) {}

    private logger = new Logger('MemberService');
    private responseDto = new ResponseDto;

    async signUp(
        memberSignUpDto: MemberSignUpDto
    ): Promise<ResponseDto> {
        return this.memberRepository.createMember(memberSignUpDto);
    }

    async signIn(
        memberSignInDto: MemberSignInDto
    ): Promise<ResponseDto> {
        const { userId, password } = memberSignInDto;
        const user = this.memberRepository.findOneBy({ userId });
        
        if(user){
            // 입력 아이디와 같은 유저가 있다면
            if((await bcrypt.compare(password, (await user).password))){
                // 비밀번호도 맞는지 확인
                
                // 유저 토큰 생성
                const accessToken = await this.generateAccessToken(userId);
                const refreshToken = await this.generateRefreshToken(userId);

                // Redis에 토큰 저장
                await this.redisService.set(
                    accessToken, //key
                    userId, //value
                    this.configService.get("REDIS_CACHE_TTL") //ttl
                );
                await this.redisService.set(
                    refreshToken, //key
                    userId, //value
                    this.configService.get("REDIS_CACHE_TTL") //ttl
                );
                
                this.logger.log(`login success... Token: ${accessToken}`);
    
                this.responseDto.statusCode = HttpStatus.OK;
                this.responseDto.message = "로그인 성공";
                this.responseDto.data = {accessToken, refreshToken};
            } else {
                // 비밀번호가 틀린경우
                throw new UnauthorizedException(`로그인 실패, 비밀번호를 확인해주세요.`);
            }
        } else {
            // 입력 아이디와 같은 유저가 없다면
            throw new UnauthorizedException(`로그인 실패, 아이디를 확인해주세요.`);
        }

        return this.responseDto;
    }


    // Token (S)
    private async generateAccessToken(userId: string): Promise<string> {
        const token = this.jwtService.sign(
            { userId },
            {
                secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
                expiresIn: Number(
                    this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
                ),
            },
        )

        return token;
    }

    // refresh token 생성
    private async generateRefreshToken(userId: string): Promise<string> {
        const token = this.jwtService.sign(
            { userId },
            {
                secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
                expiresIn: Number(
                    this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
                ),
            },
        )

        return token
    }

    // token 검증
    private async validateUser(userId): Promise<boolean> {
        const user = this.memberRepository.findOneBy({ userId });

        if(!user) {
            throw new UnauthorizedException("can't find user...");
        } else {
            return true;
        }
    }
    // Token (E)
}
