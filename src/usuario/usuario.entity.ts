import { Exclude } from 'class-transformer';
import { Oficio } from 'src/oficio/oficio.entity';
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryColumn({ nullable: false, default: null })
  cpf: string;

  @Column()
  nome: string;

  @Column({select:false})
  @Exclude()
  senha: string;

  @Column({ default: false })
  disponibilidade: boolean;

  @OneToMany(() => Oficio, (oficio) => oficio.usuario, {
    cascade: true,
  })
  oficios: Oficio[];
}
