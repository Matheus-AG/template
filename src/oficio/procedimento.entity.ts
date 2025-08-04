import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Oficio } from './oficio.entity';

@Entity()
export class Procedimento {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  agrupamento: string;

  @Column()
  procedimento: string;

  @Column()
  codigo: string;

  @Column()
  idade: number;

  @Column()
  frequencia: number;

  @ManyToOne(() => Oficio, (oficio) => oficio.procedimentos)
  oficio: Oficio;
}
