import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
import { Repository } from 'typeorm';
import { CriarUsuarioDto } from 'src/dto/usuario/criarUsuario.dto';
import { AlterarUsuarioDto } from 'src/dto/usuario/alterarUsuario.dto';
const bcrypt = require('bcrypt');

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}
  async obterTodos() {
    return await this.usuarioRepository.find();
  }
  async obter(cpf: string) {
    return await this.usuarioRepository.findOne({ where: { cpf } });
  }
  async criar(criarUsuarioDto: CriarUsuarioDto) {
    console.log(criarUsuarioDto);
    const usuarioExiste = await this.usuarioRepository.findOne({
      where: { cpf: criarUsuarioDto.cpf },
    });
    if (usuarioExiste) {
      throw new ConflictException('CPF já cadastrado');
    } else {
      const senha = await bcrypt.hash(criarUsuarioDto.senha, 10);
      const usuario = this.usuarioRepository.create({
        ...criarUsuarioDto,
        senha,
      });
      return await this.usuarioRepository.save(usuario);
    }
  }
  async alterar(alterarUsuarioDto: AlterarUsuarioDto) {
    const usuarioExiste = await this.usuarioRepository.findOne({
      where: { cpf: alterarUsuarioDto.cpf },
    });
    if (usuarioExiste) {
      const usuario = this.usuarioRepository.create(alterarUsuarioDto);
      return await this.usuarioRepository.save(usuario);
    } else {
      throw new NotFoundException('CPF não cadastrado');
    }
  }
  async remover(cpf: string) {
    const usuarioExiste = await this.usuarioRepository.findOne({
      where: { cpf },
    });
    if (usuarioExiste) {
      return await this.usuarioRepository.delete({ cpf });
    } else {
      throw new NotFoundException('CPF não cadastrado');
    }
  }
}
