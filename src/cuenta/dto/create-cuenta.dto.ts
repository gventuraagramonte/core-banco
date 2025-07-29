import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCuentaDto {
  @IsString()
  @IsNotEmpty()
  numeroCuenta: string;

  @IsNumber()
  saldo: number;

  @IsString()
  @IsNotEmpty()
  moneda: string;

  @IsNumber()
  clienteId: number;
}
