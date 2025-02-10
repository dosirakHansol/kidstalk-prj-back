import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { MemberSignInDto, MemberSignUpDto } from './dto/member-credential.dto';
import { AuthGuard } from '@nestjs/passport';
import { MemberService } from './member.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Member } from './member.entity';
import { GetMember } from './get-member-decorator';
import { ResponseDto } from 'src/common/dto/response.dto';
import { CustomAuthGuard } from 'src/common/guard/custom-auth-guard';

@Controller('member')
@ApiTags('Member API')
export class MemberController {
    constructor(private memberService: MemberService) {}

    private logger = new Logger('MemberController');

    @Post('/signup')
    @ApiOperation({ summary: "회원가입", description: '회원 생성, 회원가입시 필요한 기본정보를 입력합니다.' })
    @ApiResponse({status: HttpStatus.CREATED, description: '회원가입 성공 응답', type: ResponseDto,})
    signUp(
        @Body(ValidationPipe) memberSignUpDto: MemberSignUpDto
    ): Promise<ResponseDto> {
        this.logger.log(`input signup memberDto : ${JSON.stringify(memberSignUpDto)}`);
        return this.memberService.signUp(memberSignUpDto);
    }

    @Post('/signin')
    @ApiOperation({ summary: "로그인", description: '로그인 후 토큰 발급, 회원가입한 회원정보를 입력합니다. 성공시 토큰과 기본 유저정보를 반환합니다.' })
    @ApiResponse({status: HttpStatus.OK, description: '로그인 성공 응답', type: ResponseDto,})
    signIn(
        @Body(ValidationPipe) memberSignInDto: MemberSignInDto
    ): Promise<ResponseDto> {
        this.logger.log(`input signIn memberDto : ${JSON.stringify(memberSignInDto)}`);
        return this.memberService.signIn(memberSignInDto);
    }

    @Post('/signout')
    @ApiOperation({ summary: "로그아웃", description: 'Refresh Token DB에서 삭제' })
    @ApiResponse({status: HttpStatus.OK, description: '로그아웃 성공 응답', type: ResponseDto,})
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
            refreshToken: {
                type: 'string',
                description: 'The refresh token string',
            },
            },
            required: ['refreshToken'],
        },
    })
    signOut(
        @Body("refreshToken") refreshToken: string
    ): Promise<ResponseDto> {
        return this.memberService.signOut(refreshToken);
    }

    @Get('/test')
    @ApiOperation({ summary: "Access 토큰 테스트", description: '토큰정보로 유저정보 가져오기' })
    @ApiBearerAuth()
    @UseGuards(CustomAuthGuard)
    test(@GetMember() member: Member) {
        console.log('member', member);
        return member;
    }

    @Post('/refresh')
    @ApiOperation({ summary: "토큰 재발급", description: '리프레시 토큰 확인 후 재발급' })
    @ApiResponse({status: HttpStatus.OK, description: '토큰 재발급 성공 응답', type: ResponseDto,})
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
            refreshToken: {
                type: 'string',
                description: 'The refresh token string',
            },
            },
            required: ['refreshToken'],
        },
    })
    getNewToken(@Body("refreshToken") refreshToken: string): Promise<ResponseDto> {
        this.logger.log("refreshToken", refreshToken);
        return this.memberService.validateRefreshToken(refreshToken);
    }

    @Get('/info/count')
    @ApiOperation({ summary: "유저와 관련된 좋아요, 댓글, 게시글 수 카운팅" })
    @ApiBearerAuth()
    @UseGuards(CustomAuthGuard)
    countUserActivity(
        @GetMember() member: Member
    ): Promise<ResponseDto> {
        console.log('member', member);
        return this.memberService.countUserActivity(member);
    }
}
