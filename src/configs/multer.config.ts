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
    this.dirPath = path.join(process.cwd(), 'uploads');
    this.mkdir();
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
    const dirPath = this.dirPath;
    const option = {
      storage: multer.diskStorage({
        destination(req, file, done) {
          //파일 저장 경로 설정
          done(null, dirPath);
        },

        filename(req, file, done) {
          // 파일명 설정
          const ext = path.extname(file.originalname);
          // const name = path.basename(file.originalname, ext);
          const name = `kidstalk_${uuidv4()}`;
          done(null, `${name}_${Date.now()}${ext}`); //파일이름_날짜.확장자
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 용량 제한
    };
    return option;
  }
}
