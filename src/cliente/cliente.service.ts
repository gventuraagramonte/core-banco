import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateClienteDto) {
    console.log('Creating cliente with data:', dto);
    return this.prisma.cliente.create({
      data: {
        dni: dto.dni,
        nombres: dto.nombres,
        correo: dto.correo,
        telefono: dto.telefono,
      },
    });
  }

  async findAll() {
    return this.prisma.cliente.findMany({
      where: { activo: true },
    });
  }

  async findOne(id: string) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
      include: { cuentas: true },
    });
    if (!cliente || !cliente.activo) {
      throw new NotFoundException('Cliente not found or inactive');
    }
    return cliente;
  }

  async update(id: string, data: UpdateClienteDto) {
    const cliente = await this.findOne(id);
    return this.prisma.cliente.update({
      where: { id: cliente.id },
      data,
    });
  }

  async remove(id: string) {
    const cliente = await this.findOne(id);
    return this.prisma.cliente.update({
      where: { id: cliente.id },
      data: { activo: false },
    });
  }

  async findCuentasByCliente(id: string) {
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

  async obtenerClienteCompleto(id: string) {
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
