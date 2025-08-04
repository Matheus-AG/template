import { Module } from '@nestjs/common';
import { UsuarioModule } from './usuario/usuario.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';
import { Usuario } from './usuario/usuario.entity';
import { OficioModule } from './oficio/oficio.module';
import { Oficio } from './oficio/oficio.entity';
import { AuthModule } from './auth/auth.module';
import { DiretorModule } from './diretor/diretor.module';
import { Diretor } from './diretor/diretor.entity';
import { Procedimento } from './oficio/procedimento.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Usuario, Diretor, Oficio, Procedimento],
      synchronize: false,
    }),
    UsuarioModule,
    OficioModule,
    AuthModule,
    DiretorModule,
  ],
})
export class AppModule {}
