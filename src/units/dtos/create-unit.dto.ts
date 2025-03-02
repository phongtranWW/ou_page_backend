import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { UnitType } from '../entities/unit.entity';

export class CreateUnitDto {
  @ApiProperty({
    example: 'Công Nghệ Thông Tin',
    description: 'Tên Khoa hoặc Đơn vị',
    required: true,
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 25)
  name: string;

  @ApiProperty({
    example: 'department',
    description: 'Loại Khoa hoặc Đơn vị',
    required: true,
    type: 'string',
  })
  @IsEnum(UnitType)
  type: UnitType;
}
