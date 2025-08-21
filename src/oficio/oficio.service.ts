import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { exec, spawn } from 'child_process';
import { Oficio } from './oficio.entity';
import { Procedimento } from './procedimento.entity';
import * as fs from 'fs';
import { AlterarOficioDto } from 'src/dto/oficio/alterarOficio.dto';
import { DiretorService } from 'src/diretor/diretor.service';
import { Usuario } from 'src/usuario/usuario.entity';

@Injectable()
export class OficioService {
  constructor(
    private diretorService: DiretorService,
    @InjectRepository(Oficio)
    private readonly oficioRepository: Repository<Oficio>,

    @InjectRepository(Procedimento)
    private readonly procedimentoRepository: Repository<Procedimento>,

    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async obterTodos() {
    return await this.oficioRepository.find({ order: { id: 'ASC' } });
  }

  async gerarOficio(id: number) {
    const oficio = await this.oficioRepository.findOne({ where: { id } });

    if (!oficio) {
      throw new NotFoundException('Ofício não encontrado');
    }

    if (oficio.andamento === 0) {
      throw new ConflictException('Preenchimento está pendente');
    }

    const nomeArquivo = `oficio_${oficio.id}.txt`;

    await fs.writeFileSync(nomeArquivo, JSON.stringify(oficio));

    const execCommand = (cmd: string) =>
      new Promise<string>((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
          if (error) {
            console.error(`Erro ao executar script: ${error.message}`);
            reject(error);
            return;
          }
          if (stderr) {
            console.error(`Stderr do script: ${stderr}`);
          }
          resolve(stdout);
        });
      });

    await execCommand(`py scripts/gerar_oficio.py ${nomeArquivo}`);

    const texto = await fs.readFileSync(nomeArquivo).toString();
    fs.unlink(nomeArquivo, () => {});

    return texto;
  }
  async criarOficios(file: Express.Multer.File) {
    const diretor = await this.diretorService.obterAtual();
    if (!diretor) {
      throw new NotFoundException('Nenhum diretor registrado.');
    }

    const cmd = 'py scripts/processar_dados.py ' + file.path;
    exec(cmd, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao executar script: ${error.message}`);
        return;
      }
      try {
        const dados = JSON.parse(stdout);

        // 🔹 Buscar usuários disponíveis
        const usuariosDisponiveis = await this.usuarioRepository.find({
          where: { disponibilidade: true },
          relations: ['oficios'],
        });

        if (usuariosDisponiveis.length === 0) {
          throw new NotFoundException(
            'Nenhum usuário disponível para receber ofícios.',
          );
        }

        let idx = 0; // controle para balanceamento round-robin

        for (const element of dados) {
          const procedimentos: Procedimento[] = element.procedimentos.map((p) =>
            this.procedimentoRepository.create({
              agrupamento: p[0],
              procedimento: p[1],
              codigo: p[2],
              idade: p[3],
              frequencia: p[4],
            }),
          );

          // 🔹 Escolher o usuário destino (round-robin)
          const usuarioDestino =
            usuariosDisponiveis[idx % usuariosDisponiveis.length];
          idx++;

          // 🔹 Criar o ofício já vinculado ao usuário
          const oficio = this.oficioRepository.create({
            ano: 2025,
            competencia: 4,
            nome_diretor: diretor.nome,
            sexo_diretor: diretor.sexo,
            ...element,
            procedimentos,
            usuario: usuarioDestino,
          });

          await this.oficioRepository.save(oficio);
        }

        fs.unlink(file.path, () => {});
      } catch (parseError) {
        console.error(
          'Erro ao parsear o JSON retornado pelo script:',
          parseError,
        );
      }
    });
  }
  async alterar(alterarOficioDto: AlterarOficioDto) {
    const oficio = await this.oficioRepository.findOne({
      where: { id: alterarOficioDto.id },
    });
    if (!oficio) {
      throw new NotFoundException('Oficio não encontrado');
    }
    return this.oficioRepository.save(
      this.oficioRepository.create({ ...oficio, ...alterarOficioDto }),
    );
  }
}
