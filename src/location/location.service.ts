import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseDto } from 'src/common/dto/response.dto';

@Injectable()
export class LocationService {

    async getAllLocation(): Promise<ResponseDto>{
        return new ResponseDto(
            HttpStatus.OK, 
            "지역 조회 성공", 
            {
                locationList: [
                    // 광역시 및 특별자치시
                    "서울",
                    "부산",
                    "대구",
                    "인천",
                    "광주",
                    "대전",
                    "울산",
                    "세종",
                    "제주",
                    "경기",
                    "강원",
                    "충북",
                    "충남",
                    "전북",
                    "전남",
                    "경북",
                    "경남",
                    "기타",
                ]
            }
        );
    }
}
