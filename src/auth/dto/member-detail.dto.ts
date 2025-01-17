import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class MemberDetailDto {
    @IsEmail()
    @ApiProperty({ 
        type: String, 
        description: '이메일', 
        required: true, 
        example: 'myemail@gmail.com' 
    })
    email: string;

    @IsPhoneNumber()
    @ApiProperty({ 
        type: String, 
        description: '휴대폰번호', 
        required: true, 
        example: '000-0000-0000' 
    })
    tel: string;

    @ApiProperty({ 
        type: String, 
        description: '프로필사진', 
        required: true, 
        example: '이미지 path' 
    })
    memberImg: string;

    permission: number;
}