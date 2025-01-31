import { Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
    ){
        
    }
    private logger = new Logger("TokenMiddleware");

    async use(req: Request, res: Response, next: NextFunction) {
        this.logger.log("init TokenMiddleware...");
        
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1]; // 'Bearer {token}'에서 토큰 부분만 추출

            try {
                const payload = await this.jwtService.verifyAsync(token);
                req.user = payload;
            } catch (err) {
                // 토큰이 없거나 유효하지 않은 경우엔...그냥 빈값 리턴
                req.user = undefined;
                // throw new UnauthorizedException('유효하지 않은 토큰입니다.');
            }
        }

        next(); // 컨트롤러로 요청 전달
    }
}
