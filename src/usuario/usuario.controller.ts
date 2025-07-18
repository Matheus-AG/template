import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CriarUsuarioDto } from 'src/dto/usuario/criarUsuario.dto';
import { AlterarUsuarioDto } from 'src/dto/usuario/alterarUsuario.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('usuario')
export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}
  @UseGuards(AuthGuard)
  @Get()
  async obterTodos() {
    return await this.usuarioService.obterTodos();
  }
  @UseGuards(AuthGuard)
  @Get(':cpf')
  async obter(@Param('cpf') cpf: string) {
    return await this.usuarioService.obter(cpf);
  }

  @Post()
  async criar(@Body() criarUsuarioDto: CriarUsuarioDto) {
    return await this.usuarioService.criar(criarUsuarioDto);
  }
  @UseGuards(AuthGuard)
  @Patch()
  async alterar(@Body() alterarUsuarioDto: AlterarUsuarioDto) {
    return await this.usuarioService.alterar(alterarUsuarioDto);
  }
  @UseGuards(AuthGuard)
  @Delete(':cpf')
  async remover(@Param('cpf') cpf: string) {
    return await this.usuarioService.remover(cpf);
  }
}
