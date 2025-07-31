import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuditoriaService {
  constructor(private prisma: PrismaService) {}

  async registrar({
    accion,
    entidad,
    entidadId,
    usuario = 'sistema',
    detalle = '',
  }: {
    accion: 'CREAR' | 'ACTUALIZAR' | 'ELIMINAR';
    entidad: string;
    entidadId: string;
    usuario?: string;
    detalle?: string;
  }) {
    await this.prisma.auditoria.create({
      data: {
        accion,
        entidad,
        entidadId,
        usuario,
        detalle,
      },
    });
  }

  async findAll(query: {
    entidad?: string;
    entidadId?: string;
    accion?: string;
  }) {
    return this.prisma.auditoria.findMany({
      where: {
        entidad: query.entidad,
        entidadId: query.entidadId,
        accion: query.accion,
      },
    });
  }
}
