import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dto/response.dto';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
    constructor(
        private locationService: LocationService,
    ){

    }

    @Get("/all")
    @ApiOperation({ summary: "전체 지역 리스트 조회" })
    @ApiResponse({status: HttpStatus.OK, description: '응답 메시지 (data에 전체 지역 리스트)', type: ResponseDto,})
    getAllLocation(): Promise<ResponseDto>{
        return this.locationService.getAllLocation();
    }
}
