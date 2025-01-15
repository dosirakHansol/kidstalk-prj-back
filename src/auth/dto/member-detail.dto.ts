import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class MemberDetailDto {
    email: string;
    tel: string;
    permission: number;
}