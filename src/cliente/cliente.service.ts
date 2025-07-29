import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateClienteDto) {
    return this.prisma.cliente.create({ data });
  }

  async findAll() {
    return this.prisma.cliente.findMany({
      where: { activo: true },
    });
  }

  async findOne(id: number) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
      include: { cuentas: true },
    });
    if (!cliente || !cliente.activo) {
      throw new NotFoundException('Cliente not found or inactive');
    }
    return cliente;
  }

  async update(id: number, data: UpdateClienteDto) {
    const cliente = await this.findOne(id);
    return this.prisma.cliente.update({
      where: { id: cliente.id },
      data,
    });
  }

  async remove(id: number) {
    const cliente = await this.findOne(id);
    return this.prisma.cliente.update({
      where: { id: cliente.id },
      data: { activo: false },
    });
  }

  async findCuentasByCliente(id: number) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
      include: {
        cuentas: {
          where: { activo: true },
        },
      },
    });

    if (!cliente || !cliente.activo) {
      throw new NotFoundException('Cliente no encontrado o inactivo');
    }

    return cliente.cuentas;
  }

  async obtenerClienteCompleto(id: number) {
    return this.prisma.cliente.findUnique({
      where: { id },
      include: {
        cuentas: {
          where: { activo: true },
          include: {
            transacciones: true,
          },
        },
      },
    });
  }
}
