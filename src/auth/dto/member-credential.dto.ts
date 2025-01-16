import { IsString, Matches, MaxLength, MinLength } from "class-validator";
import { MemberDetailDto } from "./member-detail.dto";
import { ApiProperty } from "@nestjs/swagger";

export class MemberSignUpDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/^[a-zA-Z0-9]*$/, {
        message: 'id only accepts english and number...'
    })
    @ApiProperty({ 
        type: String, 
        description: '로그인 아이디, 4 ~ 20 자의 숫자와 영어를 합친 문자 ', 
        required: true, 
        example: 'test1234' 
    })
    userId: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/^[a-zA-Z0-9]*$/, {
        message: 'name only accepts english and number...'
    })
    @ApiProperty({ 
        type: String, 
        description: '사용자 닉네임, 4 ~ 20 자의 숫자와 영어를 합친 문자 ', 
        required: true, 
        example: 'test1234' 
    })
    name: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    //영어랑 숫자만 가능
    @Matches(/^[a-zA-Z0-9]*$/, {
        message: 'password only accepts english and number...'
    })
    @ApiProperty({ 
        type: String, 
        description: '사용자 비밀번호, 4 ~ 20 자의 숫자와 영어를 합친 문자 ', 
        required: true, 
        example: 'test1234' 
    })
    password: string;

    @ApiProperty({ 
        type: String, 
        description: '사용자 지역', 
        required: true, 
        example: '서울' 
    })
    location: string;

    @ApiProperty({ 
        type: String, 
        description: '사용자 상세정보 (이메일, 휴대폰번호)', 
        required: true, 
        example: {"email": "email@email.com","tel": "000-0000-0000"}
    })
    detail: MemberDetailDto;
}

export class MemberSignInDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/^[a-zA-Z0-9]*$/, {
        message: 'id only accepts english and number...'
    })
    @ApiProperty({ 
        type: String, 
        description: '로그인 아이디, 4 ~ 20 자의 숫자와 영어를 합친 문자 ', 
        required: true, 
        example: 'test1234' 
    })
    userId: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    //영어랑 숫자만 가능
    @Matches(/^[a-zA-Z0-9]*$/, {
        message: 'password only accepts english and number...'
    })
    @ApiProperty({ 
        type: String, 
        description: '사용자 비밀번호, 4 ~ 20 자의 숫자와 영어를 합친 문자 ', 
        required: true, 
        example: 'test1234' 
    })
    password: string;
}