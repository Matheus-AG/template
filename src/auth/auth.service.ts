import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
const bcrypt = require('bcrypt');
import { EntrarDto } from 'src/dto/auth/entrar.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async entrar(entrarDto: EntrarDto) {
    const usuario = await this.usuarioService.obter(entrarDto.cpf);
    if (!(usuario && bcrypt.compareSync(entrarDto.senha, usuario.senha))) {
      throw new UnauthorizedException();
    }
    const payload = { sub: usuario.cpf, nome: usuario.nome };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
