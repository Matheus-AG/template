import {
  IsString,
  Length,
  IsNotEmpty,
  Matches,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class AlterarUsuarioDto {
  @Transform(({ value }) => (value ? value.replace(/\D/g, '') : null))
  @IsString()
  @Length(11, 11)
  @IsNotEmpty()
  cpf: string;
  @IsOptional()
  @IsString()
  nome?: string;
  @IsOptional()
  @IsString()
  @Length(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'A senha deve conter pelo menos uma letra e um número',
  })
  senha?: string;
  @IsOptional()
  @IsBoolean()
  disponibilidade?: boolean;
}
