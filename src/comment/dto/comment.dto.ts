import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class CommentCreateDto {
    @ApiProperty({ 
        type: String, 
        description: '댓글내용', 
        required: true, 
        example: '예제 댓글 내용' 
    })
    description: string;

    @ApiProperty({ 
        type: Number, 
        description: '댓글 대상 게시글 번호', 
        required: true, 
        example: 1
    })
    boardId: number;

    @ApiProperty({ 
        type: Number, 
        description: '대댓글인 경우 부모 댓글 고유 번호, 대댓글이 아닌경우 0', 
        required: true, 
        example: 0
    })
    parentId: number;
}