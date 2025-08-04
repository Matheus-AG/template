import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { exec } from 'child_process';
import { Oficio } from './oficio.entity';
import { Procedimento } from './procedimento.entity';
import * as fs from 'fs';

@Injectable()
export class OficioService {
  constructor(
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
            nome_secretario: 'CBA',
            sexo_secretario: 'H',
            nome_diretor: 'ABC',
            sexo_diretor: 'M',
            andamento: 'A preencher',
            ...element,
            procedimentos,
          });

          await this.oficioRepository.save(oficio);
        }
        fs.unlink(file.path, () => {});
      } catch (parseError) {
        console.error('Erro ao parsear o JSON retornado pelo script:', parseError);
      }
    });
  }
}