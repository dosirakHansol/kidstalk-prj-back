import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class MemberCredentialDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    userId: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    name: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    //영어랑 숫자만 가능
    @Matches(/^[a-zA-Z0-9]*$/, {
        message: 'password only accepts english and number...'
    })
    password: string;

    location: string;
}