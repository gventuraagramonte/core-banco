import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { TransaccionEstado, TransaccionMoneda } from '@prisma/client';

export class CreateTransaccionDto {
  @IsNumber()
  @IsNotEmpty()
  monto: number;

  @IsNotEmpty()
  @IsUUID()
  empresaId: string;

  @IsNotEmpty()
  @IsEnum(TransaccionEstado, {
    message:
      'El estado debe ser uno de los siguientes: APROBADA, FALLIDA, PENDIENTE',
  })
  estado: TransaccionEstado;

  @IsNotEmpty()
  @IsEnum(TransaccionMoneda, {
    message: 'Moneda debe ser una de las siguientes: PEN, USD',
  })
  moneda: TransaccionMoneda;

  @IsNotEmpty()
  @IsUUID()
  cuentaId: string;
}
