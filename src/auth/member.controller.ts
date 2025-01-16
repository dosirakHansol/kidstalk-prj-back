import { Body, Controller, Get, HttpCode, Logger, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { MemberSignInDto, MemberSignUpDto } from './dto/member-credential.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user-decorator';
import { MemberService } from './member.service';
import { MemberDetailDto } from './dto/member-detail.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('member')
@ApiTags('Member API')
@ApiBearerAuth('token')
export class MemberController {
    constructor(private memberService: MemberService) {}

    private logger = new Logger('MemberController');

    @Post('/signup')
    @ApiOperation({ summary: "회원가입", description: '회원 생성' })
    signUp(
        @Body(ValidationPipe) memberSignUpDto: MemberSignUpDto
    ): Promise<void> {
        this.logger.log(`input signup memberDto : ${JSON.stringify(memberSignUpDto)}`);
        return this.memberService.signUp(memberSignUpDto);
    }

    @Post('/signin')
    @ApiOperation({ summary: "로그인", description: '로그인 후 토큰 발급' })
    signIn(
        @Body(ValidationPipe) memberSignInDto: MemberSignInDto
    ): Promise<{ accessToken: string }> {
        this.logger.log(`input signup memberDto : ${JSON.stringify(memberSignInDto)}`);
        return this.memberService.signIn(memberSignInDto);
    }

}
