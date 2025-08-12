import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { OficioService } from './oficio.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AlterarOficioDto } from 'src/dto/oficio/alterarOficio.dto';

@Controller('oficio')
export class OficioController {
  constructor(private oficioService: OficioService) {}
  @Get('gerar/:id')
  async obterOficio(@Param('id') id: number) {
    return await this.oficioService.gerarOficio(id)
  }

  @Get()
  async obterTodos() {
    return await this.oficioService.obterTodos();
  }

  @Post('criar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now();
          const originalName = file.originalname.replace(/\s+/g, '-');
          const filename = `${uniqueSuffix}-${originalName}`;
          callback(null, filename);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.oficioService.criarOficios(file);
  }

  @Patch()
  async alterar(@Body() alterarOficioDto: AlterarOficioDto) {
    return await this.oficioService.alterar(alterarOficioDto);
  }
}
