import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Matches,
  IsIn,
  IsUppercase,
  IsNotEmpty,
} from 'class-validator';

export class AlterarOficioDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id: number;

  @IsOptional()
  @IsString()
  endereco?: string;

  @IsOptional()
  @IsString()
  ambito?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  ano?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  competencia?: number;

  @IsOptional()
  @IsString()
  nome_secretario?: string;

  @IsOptional()
  @IsIn(['M', 'F'], { message: 'O sexo do secretário deve ser M ou F' })
  sexo_secretario?: string;

  @IsOptional()
  @Matches(/^\d{8}$/, { message: 'O CEP deve conter exatamente 8 dígitos' })
  cep?: string;

  @IsOptional()
  @IsString()
  municipio?: string;

  @IsOptional()
  @IsIn(['M', 'F'], { message: 'O sexo do diretor deve ser M ou F' })
  sexo_diretor?: string;

  @IsOptional()
  @IsString()
  nome_diretor?: string;

  @IsOptional()
  @IsString()
  processo?: string;

  @IsOptional()
  @IsIn(
    [
      'AC',
      'AL',
      'AP',
      'AM',
      'BA',
      'CE',
      'DF',
      'ES',
      'GO',
      'MA',
      'MT',
      'MS',
      'MG',
      'PA',
      'PB',
      'PR',
      'PE',
      'PI',
      'RJ',
      'RN',
      'RS',
      'RO',
      'RR',
      'SC',
      'SP',
      'SE',
      'TO',
    ],
    { message: 'A UF deve ser uma sigla válida de estado brasileiro' },
  )
  uf?: string;
}
