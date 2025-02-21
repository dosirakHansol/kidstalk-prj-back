import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class TopicCreateDto {
    // 주제이름
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @ApiProperty({ 
        type: String, 
        description: '주제 이름', 
        required: true, 
        example: 'test1234' 
    })
    name: string;

    //주제 설명
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @ApiProperty({ 
        type: String, 
        description: '주제 설명', 
        required: true, 
        example: 'test1234' 
    })
    description: string;
}

export class TopicSelectDto {
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