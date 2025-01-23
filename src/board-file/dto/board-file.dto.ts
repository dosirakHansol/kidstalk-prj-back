import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class BoardFileUploadDto {
    @IsString()
    @ApiProperty({ 
        type: String, 
        description: '파일 저장경로', 
        required: true, 
    })
    filePath: string;

    @IsNumber()
    @ApiProperty({ 
        type: Number, 
        description: '정렬 순서', 
        required: true, 
        example: 1
    })
    sort: number;
}