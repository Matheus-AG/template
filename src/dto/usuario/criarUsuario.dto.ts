import { IsString, Length, IsNotEmpty, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CriarUsuarioDto {
  @Transform(({ value }) => (value ? value.replace(/\D/g, '') : null))
  @IsString()
  @Length(11, 11)
  @IsNotEmpty()
  cpf: string;
  @IsNotEmpty()
  @IsString()
  nome: string;
  @IsString()
  @Length(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'A senha deve conter pelo menos uma letra e um número',
  })
  senha: string;
}
