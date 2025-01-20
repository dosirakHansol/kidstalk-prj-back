import { BadRequestException, ExecutionContext, HttpStatus, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { ResponseDto } from "../dto/response.dto";

@Injectable()
export class CustomAuthGuard extends AuthGuard('jwt') {
    constructor(
        private readonly jwtService: JwtService,
    ){
        super();
    }

    private logger = new Logger();

    async canActivate(context: ExecutionContext): Promise<boolean> {
        this.logger.log("init custom auth guard...");

        const req = context.switchToHttp().getRequest();
        const token = req.headers['authorization']?.split(' ')[1];

        if(!token) throw new BadRequestException('No token provided...');

        try {
            //JWT 유효시간 확인
            const payload = await this.jwtService.verifyAsync(token);
            req.user = payload;
            return true;
        } catch (error) {
            this.logger.log('json web token error', error)
            if(error.name === "TokenExpiredError"){
                //JWT 유효시간 만료 (유효기간 만료시에만 401로 던져서 구분하도록)
                throw new UnauthorizedException('Token needs refresh...');
            } else{
                throw new BadRequestException('Invalid Token...');
            }
        }
    }
}