import { Module } from '@nestjs/common';
import { OficioController } from './oficio.controller';
import { OficioService } from './oficio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Oficio } from './oficio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Oficio])],
  controllers: [OficioController],
  providers: [OficioService],
})
export class OficioModule {}
