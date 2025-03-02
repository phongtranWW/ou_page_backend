import { ApiProperty } from '@nestjs/swagger';

export class SlideDto {
  @ApiProperty({
    example: 1,
    description: 'ID slide',
    required: true,
    type: 'number',
  })
  id: number;

  @ApiProperty({
    example: 'http://our_page_storage/ou_bucket/icon.png',
    description: 'Link icon',
    required: true,
    type: 'string',
  })
  icon: string;

  @ApiProperty({
    example: 'http://our_page_storage/ou_bucket/slide.png',
    description: 'Link slide',
    required: true,
    type: 'string',
  })
  url: string;

  @ApiProperty({
    example: 'Chức năng - Nhiệm vụ',
    description: 'Tiêu đề slide',
    required: true,
    type: 'string',
  })
  title: string;
}
