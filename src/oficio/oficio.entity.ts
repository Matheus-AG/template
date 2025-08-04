import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Procedimento } from './procedimento.entity';

@Entity()
export class Oficio {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  ano: number;

  @Column()
  competencia: number;

  @Column({ nullable: true, default: null })
  nome_secretario: string;

  @Column({ nullable: true, default: null, length: 1 })
  sexo_secretario: string;

  @Column()
  ambito: string;

  @Column({ nullable: true, default: null })
  endereco: string;

  @Column({ nullable: true, default: null, length: 8 })
  cep: string;

  @Column()
  municipio: string;

  @Column()
  uf: string;

  @Column({ nullable: true, default: null })
  processo: string;

  @Column()
  nome_diretor: string;

  @Column({ length: 1 })
  sexo_diretor: string;

  @Column({ length: 1, default: null })
  andamento: string;

  @OneToMany(() => Procedimento, (procedimento) => procedimento.oficio, {eager:true, cascade:true})
  procedimentos: Procedimento[];
}
