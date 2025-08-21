import { Module } from '@nestjs/common';
import { OficioController } from './oficio.controller';
import { OficioService } from './oficio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Oficio } from './oficio.entity';
import { Procedimento } from './procedimento.entity';
import { DiretorModule } from 'src/diretor/diretor.module';
import { Usuario } from 'src/usuario/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Oficio, Procedimento, Usuario]),
    DiretorModule,
  ],
  controllers: [OficioController],
  providers: [OficioService],
})
export class OficioModule {}
