import { Controller, Get, Query } from '@nestjs/common';
import { AuditoriaService } from './auditoria.service';

@Controller('auditoria')
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  @Get()
  findAll(
    @Query() query: { entidad?: string; entidadId?: string; accion?: string },
  ) {
    return this.auditoriaService.findAll(query);
  }
}
