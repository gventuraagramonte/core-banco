import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateClienteDto {
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  dni: string;

  @IsNotEmpty()
  @IsString()
  nombres: string;

  @IsEmail()
  correo: string;

  @IsString()
  telefono: string;
}
