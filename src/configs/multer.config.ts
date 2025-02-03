import { Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { MulterOptionsFactory } from '@nestjs/platform-express';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  dirPath: string;
  constructor() {
    this.dirPath = path.join(process.cwd(), 'uploads/temp');
    this.mkdir();
  }

  private $this = this;

  // 날짜 포맷팅 함수
  getDateFolder(): string{
    const today = new Date();
    return `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
  }

  // uploads 폴더 생성
  mkdir() {
    try {
      fs.readdirSync(this.dirPath);
    } catch (err) {
      fs.mkdirSync(this.dirPath);
    }
  }

  createMulterOptions() {
    const baseDir = this.dirPath;
    
    const option = {
      storage: multer.diskStorage({
        destination: function (req, file, done) {
          const dateFolder = this.getDateFolder(); //날짜별폴더
          const dirPath = path.join(baseDir, dateFolder);

          // 폴더가 없으면 생성
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true }); // 날짜별 폴더 생성
          }
          
          //파일 저장 경로 설정
          done(null, dirPath);
        }.bind(this),

        filename(req, file, done) {
          // 파일명 설정
          const ext = path.extname(file.originalname);
          const name = `kidstalk_${uuidv4()}`;
          done(null, `${name}_${Date.now()}${ext}`); //파일이름_날짜.확장자
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 용량 제한 (10MB)
    };
    return option;
  }

  getFilePath(file: Express.Multer.File): string {
    const relativePath = path.relative(process.cwd(), file.path);

    // 경로에서 백슬래시(\)를 슬래시(/)로 변경하고, 맨 앞에 /를 추가
    const standardizedPath = `/${relativePath.replace(/\\+/g, '/')}`;

    return standardizedPath;
  }
}
