import { Injectable } from '@nestjs/common';
import { Diretor } from './diretor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CriarDiretorDto } from 'src/dto/diretor/criarDiretor.dto';

@Injectable()
export class DiretorService {
  constructor(
    @InjectRepository(Diretor)
    private diretorRepository: Repository<Diretor>,
  ) {}
  async obterTodos() {
    return await this.diretorRepository.find();
  }
  async obterAtual() {
    return (
      await this.diretorRepository.find({
        order: { id: 'DESC' },
        take: 1,
      })
    )[0];
  }
  async criar(criarDiretorDto: CriarDiretorDto) {
    const diretor = await this.diretorRepository.create(criarDiretorDto);
    return await this.diretorRepository.save(diretor);
  }
}
