import { Module } from '@nestjs/common';
import { DiretorController } from './diretor.controller';
import { DiretorService } from './diretor.service';
import { Diretor } from './diretor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Diretor])],
  controllers: [DiretorController],
  providers: [DiretorService],
  exports: [DiretorService],
})
export class DiretorModule {}
