import { TransaccionMoneda } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateCuentaDto {
  @IsString()
  @IsNotEmpty()
  numeroCuenta: string;

  @IsNumber()
  saldo: number;

  @IsString()
  @IsNotEmpty()
  moneda: TransaccionMoneda;

  @IsNotEmpty()
  @IsUUID()
  clienteId: string;
}
