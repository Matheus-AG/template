import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Oficio {
  @PrimaryColumn({ generated: 'increment' })
  id: number;

  @Column()
  ano: number;

  @Column()
  competencia: number;

  @Column()
  nome_secretario: string;

  @Column({ nullable: true })
  sexo_secretario: string;

  @Column({ nullable: true })
  ambito: string;

  @Column({ nullable: true })
  endereco: string;
  @Column({ nullable: true })
  cep: string;

  @Column()
  municipio: string;

  @Column()
  uf: string;

  @Column({ nullable: true })
  processo: string;

  @Column({ nullable: true })
  nome_diretor: string;

  @Column()
  sexo_diretor: string;
}
