import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeUpdate,
  ManyToOne,
} from 'typeorm';
import { Procedimento } from './procedimento.entity';
import { Usuario } from 'src/usuario/usuario.entity';

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

  @Column()
  sexo_diretor: string;

  @Column({ unsigned: true, default: 0 })
  andamento: number;

  @OneToMany(() => Procedimento, (procedimento) => procedimento.oficio, {
    eager: true,
    cascade: true,
  })
  procedimentos: Procedimento[];

  @ManyToOne(() => Usuario, (usuario) => usuario.oficios, { eager: true })
  usuario: Usuario;

  @BeforeUpdate()
  oficioPreenchido() {
    if (Object.values(this).every((e) => e !== null) && this.andamento === 0) {
      this.andamento = 1;
    }
  }
}
