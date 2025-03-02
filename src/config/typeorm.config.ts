import { registerAs } from '@nestjs/config';
import { Slide } from 'src/units/entities/slide.entity';
import { Unit } from 'src/units/entities/unit.entity';

export const typeOrmConfig = registerAs('typeOrm', () => ({
  type: 'sqlite',
  database: process.env.TYPEORM_DATABASE_FILE,
  entities: [Unit, Slide],
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
}));
