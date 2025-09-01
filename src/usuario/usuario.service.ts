import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
import { Repository } from 'typeorm';
import { CriarUsuarioDto } from 'src/dto/usuario/criarUsuario.dto';
import { AlterarUsuarioDto } from 'src/dto/usuario/alterarUsuario.dto';
import 'dotenv/config';
import { Oficio } from 'src/oficio/oficio.entity';
const bcrypt = require('bcrypt');

@Injectable()
export class UsuarioService implements OnModuleInit {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Oficio)
    private oficioRepository: Repository<Oficio>,
  ) {}

  async onModuleInit() {
    const numUsuarios = await this.usuarioRepository.count();
    if (numUsuarios === 0) {
      const usuario: CriarUsuarioDto = {
        cpf: process.env.ADMIN_CPF || '00000000000',
        nome: process.env.ADMIN_NOME || 'ADMIN',
        senha: process.env.ADMIN_SENHA || 'ADMIN',
      };
      await this.criar(usuario);
    }
  }
  async obterTodos() {
    return await this.usuarioRepository.find();
  }

  async obter(cpf: string) {
    return await this.usuarioRepository.findOne({ where: { cpf } });
  }
  async obterAuth(cpf: string) {
    return await this.usuarioRepository.findOne({
      where: { cpf },
      select: { cpf: true, senha: true, nome: true },
    });
  }

  async criar(criarUsuarioDto: CriarUsuarioDto) {
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
      await this.usuarioRepository.save(usuario);
      return await this.obter(criarUsuarioDto.cpf);
    }
  }
  async alterar(alterarUsuarioDto: AlterarUsuarioDto) {
    // 1. Buscar o usuário existente com ofícios
    const usuarioExiste = await this.usuarioRepository.findOne({
      where: { cpf: alterarUsuarioDto.cpf },
      relations: ['oficios'],
    });

    if (!usuarioExiste) {
      throw new NotFoundException('CPF não cadastrado');
    }

    // 2. Verificar se a disponibilidade mudou
    const disponibilidadeAntes = usuarioExiste.disponibilidade;
    const disponibilidadeNova =
      alterarUsuarioDto.disponibilidade ?? usuarioExiste.disponibilidade;

    // 3. Atualizar os dados
    const usuarioAtualizado = this.usuarioRepository.merge(
      usuarioExiste,
      alterarUsuarioDto,
    );
    await this.usuarioRepository.save(usuarioAtualizado);

    // 4. Se a disponibilidade mudou, rebalancear
    if (disponibilidadeAntes !== disponibilidadeNova) {
      await this.rebalancearOficios(usuarioAtualizado.cpf);
    }

    return await this.obter(alterarUsuarioDto.cpf);
  }

  async rebalancearOficios(cpf: string) {
    // 1. Buscar o usuário que mudou a disponibilidade
    const usuario = await this.usuarioRepository.findOne({
      where: { cpf },
      relations: ['oficios'],
    });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // 2. Buscar todos os usuários disponíveis
    const usuariosDisponiveis = await this.usuarioRepository.find({
      where: { disponibilidade: true },
      relations: ['oficios'],
    });

    if (usuariosDisponiveis.length === 0) return;

    let oficiosParaRedistribuir: Oficio[] = [];

    if (!usuario.disponibilidade) {
      // Caso 1: usuário ficou indisponível → redistribuir TODOS os ofícios dele
      oficiosParaRedistribuir = usuario.oficios || [];
      usuario.oficios = [];
      await this.usuarioRepository.save(usuario);
    } else {
      // Caso 2: usuário ficou disponível → pegar ofícios andamento = 0 de outros usuários
      for (const u of usuariosDisponiveis) {
        if (u.cpf === usuario.cpf) continue;
        const andamentoZero = u.oficios.filter((o) => o.andamento === 0);
        oficiosParaRedistribuir.push(...andamentoZero);
      }
    }

    // 3. Redistribuir os ofícios em round-robin entre os usuários disponíveis
    for (let i = 0; i < oficiosParaRedistribuir.length; i++) {
      const idx = i % usuariosDisponiveis.length;
      const usuarioDestino = usuariosDisponiveis[idx];
      oficiosParaRedistribuir[i].usuario = usuarioDestino;
    }

    // 4. Salvar todos os ofícios em lote
    if (oficiosParaRedistribuir.length > 0) {
      await this.oficioRepository.save(oficiosParaRedistribuir);
    }
  }

  async remover(cpf: string) {
    const usuarioExiste = await this.usuarioRepository.findOne({
      where: { cpf },
    });
    if (!usuarioExiste) {
      throw new NotFoundException('CPF não cadastrado');
    }
    await this.alterar({cpf,disponibilidade:false})
    await this.usuarioRepository.delete({ cpf });
  }
}
