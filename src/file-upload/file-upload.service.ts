import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { ResponseDto } from 'src/common/dto/response.dto';

@Injectable()
export class FileUploadService {
    constructor() {}

    fileUpload(file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException();
        }

        const filePath = '/' + file.filename;

        return new ResponseDto(
            HttpStatus.CREATED, 
            "파일 업로드 성공", 
            { filePath }
        );
    }
}
