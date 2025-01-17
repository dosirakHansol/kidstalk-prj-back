import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
    @ApiProperty({ example: "응답에 대한 상태 코드를 표시합니다." })
    statusCode: number;

    @ApiProperty({ example: '응답에 대한 내용을 표시합니다.' })
    message: string;

    @ApiProperty({ example: "응답에 데이터가 포함된 경우 해당 데이터값을 표시합니다." })
    data: any;
}
