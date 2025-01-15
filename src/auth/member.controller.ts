import { Body, Controller, Get, Logger, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { MemberCredentialDto } from './dto/member-credential.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user-decorator';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {
    constructor(private memberService: MemberService) {}

    private logger = new Logger('MemberController');

    @Post('/signup')
    signUp(
        @Body(ValidationPipe) memberCredentialDto: MemberCredentialDto
    ): Promise<void> {
        this.logger.log(`input signup ${JSON.stringify(memberCredentialDto)}`);
        return this.memberService.signUp(memberCredentialDto);
    }

}
