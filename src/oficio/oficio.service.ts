import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { exec } from 'child_process';
import { Oficio } from './oficio.entity';
import { Procedimento } from './procedimento.entity';
import * as fs from 'fs';
import { AlterarOficioDto } from 'src/dto/oficio/alterarOficio.dto';
import { DiretorService } from 'src/diretor/diretor.service';

@Injectable()
export class OficioService {
  constructor(
    private diretorService: DiretorService,
    @InjectRepository(Oficio)
    private readonly oficioRepository: Repository<Oficio>,

    @InjectRepository(Procedimento)
    private readonly procedimentoRepository: Repository<Procedimento>,
  ) {}

  async obterTodos() {
    return await this.oficioRepository.find();
  }

  async criarOficios(file: Express.Multer.File) {
    const cmd = 'py scripts/script.py ' + file.path;
    exec(cmd, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao executar script: ${error.message}`);
        return;
      }
      const diretor = await this.diretorService.obterAtual();
      if (!diretor) {
        throw new NotFoundException('Nenhum diretor registrado.');
      }
      try {
        const dados = JSON.parse(stdout);

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

          const oficio = this.oficioRepository.create({
            ano: 2025,
            competencia: 4,
            nome_diretor: diretor.nome,
            sexo_diretor: diretor.sexo,
            ...element,
            procedimentos,
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
    const oficioExiste = await this.oficioRepository.findOne({
      where: { id: alterarOficioDto.id },
    });
    if (!oficioExiste) {
      throw new NotFoundException('Oficio não encontrado');
    }
    return this.oficioRepository.save(alterarOficioDto);
  }
}
