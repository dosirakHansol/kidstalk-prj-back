import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { ResponseDto } from 'src/common/dto/response.dto';
import { MulterConfigService } from 'src/configs/multer.config';

@Injectable()
export class FileUploadService {
    constructor(private readonly multerConfigService: MulterConfigService) {}

    private readonly tempBasePath = 'uploads/temp';
    private readonly boardBasePath = 'uploads/board';
    private logger = new Logger("FileUploadService");

    async fileUpload(file: Express.Multer.File):Promise<ResponseDto> {
        if (!file) {
            throw new BadRequestException();
        }

        this.logger.log(`file : ${file}`);

        const filePath = this.multerConfigService.getFilePath(file);

        return new ResponseDto(
            HttpStatus.CREATED, 
            "파일 업로드 성공", 
            { filePath }
        );
    }

    /**
     * 파일을 `/uploads/temp/YYYYMMDD/...`에서 `/uploads/board/YYYYMMDD/...`로 이동
     * @param tempFilePath - 원본 파일 경로 (예: "/uploads/temp/20250203/kidstalk_xxx.png")
     * @returns 이동된 파일의 새 경로 (예: "/uploads/board/20250203/kidstalk_xxx.png")
     */
    async moveFileToBoard(tempFilePath: string): Promise<ResponseDto> {
        try {
            // 프로젝트 루트 경로
            const basePath = process.cwd();
        
            // 현재 파일의 절대 경로
            const absoluteTempPath = path.join(basePath, tempFilePath);
        
            // 날짜 폴더 추출
            const parts = tempFilePath.split('/');
            // const dateFolder = parts[3]; // 예: "20250203"
            const dateFolder = this.multerConfigService.getDateFolder(); // 예: "20250203"
            const fileName = parts[4];   // 예: "kidstalk_xxx.png"
        
            // 새롭게 이동할 디렉토리 (board 폴더)
            const boardDir = path.join(basePath, 'uploads/board', dateFolder);
        
            // 폴더가 없으면 생성
            if (!fs.existsSync(boardDir)) {
                fs.mkdirSync(boardDir, { recursive: true });
            }
        
            // 새 파일 경로
            const newFilePath = path.join(boardDir, fileName);
        
            // 파일 이동 (rename 사용)
            await fs.promises.rename(absoluteTempPath, newFilePath);
        
            // 상대 경로 리턴
            return new ResponseDto(
                HttpStatus.CREATED, 
                "파일 업로드 성공", 
                { filePath: `/uploads/board/${dateFolder}/${fileName}` }
            );
        } catch (error) {
            this.logger.error(error.message);
            throw new InternalServerErrorException(`파일 이동 오류 ${error}`);
        }
    }
}
