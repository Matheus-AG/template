import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CriarDiretorDto {
  @IsNotEmpty()
  @IsString()
  @IsString()
  nome: string;
  @IsNotEmpty()
  @IsString()
  @IsIn(['M', 'F'], { message: 'O sexo do diretor deve ser M ou F' })
  sexo: string;
}
