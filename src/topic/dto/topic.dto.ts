import { IsString, MaxLength, MinLength } from "class-validator";

export class TopicDto {
    // 주제이름
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    name: string;

    //주제 설명
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    description: string;
}