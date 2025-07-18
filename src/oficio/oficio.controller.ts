import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { OficioService } from './oficio.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('oficio')
export class OficioController {
  constructor(private oficioService: OficioService) {}
  @Get()
  async obterTodos() {
    return await this.oficioService.obterTodos();
  }

  @Post('criar')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.oficioService.criarOficios(file)
  }
}
