import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './auth.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import * as bcrypt from "bcryptjs";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
        return this.userRepository.createUser(authCredentialDto);
    }

    async signIn(authCredentialDto: AuthCredentialDto): Promise<{accessToken: string}> {
        const { username, password } = authCredentialDto;
        const user = this.userRepository.findOneBy({ username });
        
        if(user && (await bcrypt.compare(password, (await user).password))){
            // 유저 토큰 생성 (secret + payload)
            const payload = { username };
            const accessToken = await this.jwtService.sign(payload);

            return { accessToken };
        } else{
            throw new UnauthorizedException('login faild: not match password..');
        }
    }
}
