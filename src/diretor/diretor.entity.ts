import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Diretor {
  @PrimaryColumn({ generated: 'increment' })
  id: string;

  @Column()
  nome: string;

  @Column({ type: 'char' })
  sexo: string;
}
