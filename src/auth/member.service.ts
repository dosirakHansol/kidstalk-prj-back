import { BadRequestException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
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

    async signUp(
        memberSignUpDto: MemberSignUpDto
    ): Promise<ResponseDto> {
        return this.memberRepository.createMember(memberSignUpDto);
    }

    async signIn(
        memberSignInDto: MemberSignInDto
    ): Promise<ResponseDto> {
        const { userId, password } = memberSignInDto;
        const user = await this.memberRepository.findOneBy({ userId });

        if(user){
            // 입력 아이디와 같은 유저가 있다면
            if((await bcrypt.compare(password, user.password))){
                // 비밀번호도 맞는지 확인
                
                // 유저 토큰 생성
                const accessToken = await this.generateAccessToken(userId);
                const refreshToken = await this.generateRefreshToken(userId);

                // Redis에 토큰 저장
                // await this.redisService.set(
                //     accessToken, //key
                //     userId, //value
                //     this.configService.get("REDIS_CACHE_TTL") //ttl
                // );
                await this.redisService.set(
                    refreshToken, //key
                    userId, //value
                    this.configService.get("REDIS_CACHE_TTL") //ttl
                );
                
                this.logger.log(`login success... Token: ${accessToken}`);
    
                return new ResponseDto(HttpStatus.OK, "로그인 성공", {accessToken, refreshToken});
            } else {
                // 비밀번호가 틀린경우
                throw new BadRequestException(`로그인 실패, 비밀번호를 확인해주세요.`);
            }
        } else {
            // 입력 아이디와 같은 유저가 없다면
            throw new BadRequestException(`로그인 실패, 아이디를 확인해주세요.`);
        }
    }

    async signOut(refreshToken: string): Promise<ResponseDto> {
        // 로그아웃시 refresh token redis에서 삭제
        await this.redisService.del(refreshToken);

        return new ResponseDto(HttpStatus.OK, "로그아웃 성공", {});
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

    // check refresh token then generate new token
    async validateRefreshToken(refreshToken: string): Promise<ResponseDto> {
        // Redis에 해당 refresh 토큰 있는지 확인
        const userId = await this.redisService.get(refreshToken);

        if(!!userId) {
            // refresh token 존재
            // 신규 Token 생성
            const newAccessToken = await this.generateAccessToken(userId);
            const newRefreshToken = await this.generateRefreshToken(userId);

            // 기존 refresh token 삭제
            await this.redisService.del(refreshToken);

            // 신규 refresh token 저장
            await this.redisService.set(
                newRefreshToken, //key
                userId, //value
                this.configService.get("REDIS_CACHE_TTL") 
            );

            return new ResponseDto(
                HttpStatus.OK, 
                "토큰 재생성 성공", 
                {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken
                }
            );
        } else{
            // refresh token 없음
            throw new BadRequestException("Not exist your refresh token...");
        }
    }
    // Token (E)
}
