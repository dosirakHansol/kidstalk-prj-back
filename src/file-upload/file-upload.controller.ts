import { Controller, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dto/response.dto';
import { FileUploadService } from './file-upload.service';

@Controller('file')
export class FileUploadController {
    constructor(private fileUploadService: FileUploadService){}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: "파일을 서버에 업로드" })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type:'string',
                    format: 'binary'
                },
            },
        },
    })
    @ApiResponse({status: HttpStatus.OK, description: '업로드 결과', type: ResponseDto,})
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log('file', file);
        return this.fileUploadService.fileUpload(file);
    }
}
