import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EntrarDto } from 'src/dto/auth/entrar.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('entrar')
  signIn(@Body() entrarDto: EntrarDto) {
    return this.authService.entrar(entrarDto);
  }
}
