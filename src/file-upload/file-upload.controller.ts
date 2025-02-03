import { Body, Controller, HttpStatus, Logger, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dto/response.dto';
import { FileUploadService } from './file-upload.service';
import { CustomAuthGuard } from 'src/common/guard/custom-auth-guard';

@Controller('file')
export class FileUploadController {
    constructor(private fileUploadService: FileUploadService){}

    private logger = new Logger("FileUploadController");

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: "임시파일을 서버에 업로드" })
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
    @ApiResponse({status: HttpStatus.OK, description: '업로드 결과(file path)', type: ResponseDto,})
    // @UseGuards(CustomAuthGuard)
    uploadFile
    (
        @UploadedFile() file: Express.Multer.File
    ):Promise<ResponseDto> {
        this.logger.log('file', file);

        return this.fileUploadService.fileUpload(file);
    }

    @Post('move')
    @ApiOperation({ summary: "임시파일을 board 폴더로 이동" })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                    tempFilePath: {
                    type: 'string',
                    description: '임시파일 경로',
                },
            },
            required: ['tempFilePath'],
        },
    })
    @ApiResponse({status: HttpStatus.OK, description: '파일이동 결과(file path)', type: ResponseDto,})
    // @UseGuards(CustomAuthGuard)
    moveFileToBoard
    (
        @Body("tempFilePath") tempFilePath: string
    ):Promise<ResponseDto> {
        this.logger.log('tempFilePath', tempFilePath);

        return this.fileUploadService.moveFileToBoard(tempFilePath);
    }
}
