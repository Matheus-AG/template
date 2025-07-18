import { Injectable } from '@nestjs/common';
import { Oficio } from './oficio.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OficioService {
  constructor(
    @InjectRepository(Oficio)
    private usuarioRepository: Repository<Oficio>,
  ) {}
  async obterTodos() {
    return await this.usuarioRepository.find();
  }
  async criarOficios(file: Express.Multer.File) {
    return await this.usuarioRepository.find();
  }
}
