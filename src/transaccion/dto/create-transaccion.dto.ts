import { IsIn, IsNumber, IsString } from 'class-validator';

export class CreateTransaccionDto {
  @IsNumber()
  monto: number;

  @IsString()
  empresa: string;

  @IsIn(['APROBADA', 'FALLIDO', 'PENDIENTE'])
  estado: string;

  @IsIn(['PEN', 'USD'])
  moneda: string;

  @IsNumber()
  cuentaId: number;
}
