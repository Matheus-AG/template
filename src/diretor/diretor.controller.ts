import { Controller, Get, Post } from '@nestjs/common';
import { DiretorService } from './diretor.service';
import { CriarDiretorDto } from 'src/dto/diretor/criarDiretor.dto';

@Controller('diretor')
export class DiretorController {
  constructor(private diretorService: DiretorService) {}
  @Get()
  async obterTodos() {
    return await this.diretorService.obterTodos();
  }
  @Get()
  async obterAtual() {
    return await this.diretorService.obterAtual();
  }
  @Post()
  async criar(criarDiretorDto: CriarDiretorDto) {
    return await this.diretorService.criar(criarDiretorDto);
  }
}
