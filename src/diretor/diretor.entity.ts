import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Diretor {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nome: string;

  @Column()
  sexo: string;
}
