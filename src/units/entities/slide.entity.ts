import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Unit } from './unit.entity';

@Entity('slides')
export class Slide {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text' })
  icon: string;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'text' })
  title: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'int', name: 'unit_id' })
  unitId: number;

  @ManyToOne(() => Unit, (unit) => unit.slides)
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;
}
