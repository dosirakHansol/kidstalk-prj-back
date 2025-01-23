import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";
import { BoardFileUploadDto } from "src/board-file/dto/board-file.dto";

export class BoardCreateDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @ApiProperty({ 
        type: String, 
        description: '게시글 이름', 
        required: true, 
        example: 'test1234' 
    })
    title: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @ApiProperty({ 
        type: String, 
        description: '게시글 설명', 
        required: true, 
        example: 'test1234' 
    })
    description: string;

    @ApiProperty({ 
        type: Number, 
        description: '주제 번호', 
        required: true, 
        example: 1
    })
    topicId: number;

    @ApiProperty({ 
        type: [BoardFileUploadDto], 
        description: '업로드 할 파일 목록', 
        required: false, 
    })
    fileList: BoardFileUploadDto[];
}