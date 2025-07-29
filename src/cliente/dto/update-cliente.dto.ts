import { PartialType } from '@nestjs/mapped-types';
import { CreateClienteDto } from './create-cliente.dto';

export class UpdateClienteDto extends PartialType(CreateClienteDto) {
  // Inherits all properties from CreateClienteDto
  // Additional properties or methods can be added here if needed
}
