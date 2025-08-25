import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { DiretorService } from './diretor.service';
import { CriarDiretorDto } from 'src/dto/diretor/criarDiretor.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('diretor')
export class DiretorController {
  constructor(private diretorService: DiretorService) {}
  @UseGuards(AuthGuard)
  @Get()
  async obterTodos() {
    return await this.diretorService.obterTodos();
  }
  @UseGuards(AuthGuard)
  @Get('atual')
  async obterAtual() {
    return await this.diretorService.obterAtual();
  }
  @UseGuards(AuthGuard)
  @Post()
  async criar(@Body() criarDiretorDto: CriarDiretorDto) {
    return await this.diretorService.criar(criarDiretorDto);
  }
}
