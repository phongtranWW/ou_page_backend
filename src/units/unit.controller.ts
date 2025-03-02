import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UnitService } from './unit.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { CreateUnitDto } from './dtos/create-unit.dto';
import { SlideDto } from './dtos/slide.dto';
import { UnitDto } from './dtos/unit.dto';
import { UnitType } from './entities/unit.entity';
import { ApiKeyGuard } from 'src/shared/api-key.guard';

@Controller('units')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post()
  @ApiSecurity('api-key')
  @UseGuards(ApiKeyGuard)
  @ApiBody({ type: CreateUnitDto })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createUnit(@Body() createUnitDto: CreateUnitDto) {
    return await this.unitService.createUnit(createUnitDto);
  }

  @Get()
  @ApiQuery({
    name: 'type',
    type: 'string',
    required: true,
    enum: UnitType,
    description: 'Loại Khoa hoặc Đơn vị',
  })
  @ApiResponse({ type: UnitDto, isArray: true })
  async getUnits(
    @Query('type', new ParseEnumPipe(UnitType)) type: UnitType,
  ): Promise<UnitDto[]> {
    return await this.unitService.getUnits(type);
  }

  @Delete(':unitId')
  @ApiSecurity('api-key')
  @UseGuards(ApiKeyGuard)
  @ApiParam({
    name: 'unitId',
    type: 'number',
    required: true,
    description: 'ID Khoa hoặc Đơn vị',
  })
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async deleleUnit(@Param('unitId', ParseIntPipe) unitId: number) {
    return await this.unitService.deleleUnit(unitId);
  }

  @Get(':unitId/slides')
  @ApiParam({
    name: 'unitId',
    type: 'number',
    required: true,
    description: 'ID Khoa hoặc Đơn vị',
  })
  @ApiResponse({ type: SlideDto, isArray: true })
  async getSlides(
    @Param('unitId', ParseIntPipe) unitId: number,
  ): Promise<SlideDto[]> {
    return await this.unitService.getSlides(unitId);
  }

  @Post(':unitId/slides')
  @ApiSecurity('api-key')
  @UseGuards(ApiKeyGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Tạo slide mới',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Giới thiệu về Khoa CNTT' },
        icon: {
          type: 'array',
          items: {
            format: 'binary',
            type: 'string',
            description: 'Icon của slide',
          },
        },
        slide: {
          type: 'array',
          items: {
            format: 'binary',
            type: 'string',
            description: 'File của slide (pdf hoặc pptx)',
          },
        },
      },
    },
  })
  @ApiParam({
    name: 'unitId',
    type: 'number',
    required: true,
    description: 'ID Khoa hoặc Đơn vị',
  })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'slide', maxCount: 1 },
      { name: 'icon', maxCount: 1 },
    ]),
  )
  async createSlide(
    @Param('unitId') unitId: number,
    @Body() data: { title: string },
    @UploadedFiles()
    files: { icon: Express.Multer.File[]; slide: Express.Multer.File[] },
  ) {
    return await this.unitService.createSlide(unitId, {
      title: data.title,
      icon: files.icon[0],
      slide: files.slide[0],
    });
  }

  @Delete(':unitId/slides/:slideId')
  @ApiSecurity('api-key')
  @UseGuards(ApiKeyGuard)
  @ApiParam({
    name: 'unitId',
    type: 'number',
    required: true,
    description: 'ID Khoa hoặc Đơn vị',
  })
  @ApiParam({
    name: 'slideId',
    type: 'number',
    required: true,
    description: 'ID Slide',
  })
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async deleteSlide(
    @Param('unitId') unitId: number,
    @Param('slideId') slideId: number,
  ) {
    return await this.unitService.deleteSlide(unitId, slideId);
  }
}
