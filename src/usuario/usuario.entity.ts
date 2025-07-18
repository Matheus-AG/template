import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryColumn()
  cpf: string;

  @Column()
  nome: string;

  @Column()
  senha: string;
}
