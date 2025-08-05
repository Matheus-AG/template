import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryColumn({ nullable: false, default: null })
  cpf: string;

  @Column()
  nome: string;

  @Column()
  senha: string;
}
