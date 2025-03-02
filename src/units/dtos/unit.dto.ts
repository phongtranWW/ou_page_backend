import { ApiProperty } from '@nestjs/swagger';

export class UnitDto {
  @ApiProperty({
    example: 1,
    description: 'ID Khoa hoặc Đơn vị',
    required: true,
    type: 'number',
  })
  id: number;

  @ApiProperty({
    example: 'Công Nghệ Thông Tin',
    description: 'Tên Khoa hoặc Đơn vị',
    required: true,
    type: 'string',
  })
  name: string;
}
