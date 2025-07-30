import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCuentaDto } from './dto/create-cuenta.dto';
import { UpdateCuentaDto } from './dto/update-cuenta.dto';

@Injectable()
export class CuentaService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCuentaDto) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: dto.clienteId },
    });

    if (!cliente || !cliente.activo) {
      throw new NotFoundException('Cliente no encontrado o inactivo');
    }
    return this.prisma.cuenta.create({ data: dto });
  }

  findAll() {
    return this.prisma.cuenta.findMany({
      where: { activo: true },
      include: { cliente: true },
    });
  }

  async findOne(id: string) {
    const cuenta = await this.prisma.cuenta.findUnique({
      where: { id },
    });

    if (!cuenta || !cuenta.activo) {
      throw new NotFoundException('Cuenta no encontrada');
    }
    return cuenta;
  }

  async update(id: string, dto: UpdateCuentaDto) {
    await this.findOne(id); // Verifica si la cuenta existe
    return this.prisma.cuenta.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.cuenta.update({
      where: { id },
      data: { activo: false },
    });
  }
}
