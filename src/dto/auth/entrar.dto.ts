import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class EntrarDto {
  @Transform(({ value }) => (value ? value.replace(/\D/g, '') : null))
  @IsString()
  @Length(11, 11)
  @IsNotEmpty()
  cpf: string;

  @IsString()
  @Length(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'A senha deve conter pelo menos uma letra e um número',
  })
  senha: string;
}
