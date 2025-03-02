import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Unit, UnitType } from './entities/unit.entity';
import { Slide } from './entities/slide.entity';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { CreateSlideDto } from './dtos/create-slide.dto';
import { CreateUnitDto } from './dtos/create-unit.dto';
import { SlideDto } from './dtos/slide.dto';
import { UnitDto } from './dtos/unit.dto';

@Injectable()
export class UnitService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    @Inject('S3_CLIENT')
    private readonly s3: S3Client,
  ) {}

  async getUnits(type: UnitType): Promise<UnitDto[]> {
    try {
      return (
        await this.entityManager.find(Unit, {
          where: {
            type,
          },
          select: ['id', 'name'],
        })
      ).map((unit) => ({ id: unit.id, name: unit.name }));
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleleUnit(unitId: number) {
    const unit = await this.entityManager.findOneBy(Unit, { id: unitId });
    if (!unit) {
      throw new NotFoundException('Unit not found');
    }
    try {
      await this.entityManager.delete(Unit, { id: unitId });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getSlides(unitId: number): Promise<SlideDto[]> {
    try {
      return (
        await this.entityManager.find(Slide, {
          where: { unitId },
          select: ['id', 'icon', 'url', 'title'],
        })
      ).map((slide) => ({
        id: slide.id,
        icon: slide.icon,
        url: slide.url,
        title: slide.title,
      }));
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async createUnit(createUnitDto: CreateUnitDto) {
    try {
      const unit = new Unit();
      unit.name = createUnitDto.name;
      unit.type = createUnitDto.type;
      await this.entityManager.insert(Unit, unit);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async createSlide(unitId: number, createSlideDto: CreateSlideDto) {
    const unit = await this.entityManager.findOneBy(Unit, { id: unitId });
    if (!unit) {
      throw new NotFoundException('Unit not found');
    }
    try {
      const { title, icon, slide } = createSlideDto;
      const iconKey = `icons/${Date.now()}-${icon.originalname}`;
      const uploadIcon = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: iconKey,
        Body: icon.buffer,
        ContentType: icon.mimetype,
      });
      await this.s3.send(uploadIcon);

      const slideKey = `slides/${Date.now()}-${slide.originalname}`;
      const uploadSlide = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: slideKey,
        Body: slide.buffer,
        ContentType: slide.mimetype,
      });
      await this.s3.send(uploadSlide);

      const slideEntity = new Slide();
      slideEntity.title = title;
      slideEntity.icon = `${process.env.S3_MEDIA_ENDPOINT}/${iconKey}`;
      slideEntity.url = `${process.env.S3_MEDIA_ENDPOINT}/${slideKey}`;
      slideEntity.unitId = unitId;
      await this.entityManager.insert(Slide, slideEntity);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteSlide(unitId: number, slideId: number) {
    const slide = await this.entityManager.findOneBy(Slide, {
      id: slideId,
      unitId,
    });
    if (!slide) {
      throw new NotFoundException('Slide not found');
    }
    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: slide.icon.replace(`${process.env.S3_MEDIA_ENDPOINT}/`, ''),
        }),
      );

      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: slide.url.replace(`${process.env.S3_MEDIA_ENDPOINT}/`, ''),
        }),
      );
      await this.entityManager.delete(Slide, { id: slideId, unitId });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
