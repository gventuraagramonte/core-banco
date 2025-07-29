import { PartialType } from '@nestjs/mapped-types';
import { CreateTransaccionDto } from './create-transaccion.dto';

export class UpdateTransaccionDto extends PartialType(CreateTransaccionDto) {
  // Inherits all properties from CreateTransaccionDto
  // and makes them optional for updates.
}
