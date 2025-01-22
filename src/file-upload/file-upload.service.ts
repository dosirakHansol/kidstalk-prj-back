import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FileUploadService {
    constructor() {}

    fileUpload(file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException();
        }

        return file.path;
    }
}
