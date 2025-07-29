import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransaccionDto } from './dto/create-transaccion.dto';
import { UpdateTransaccionDto } from './dto/update-transaccion.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransaccionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTransaccionDto) {
    const cuenta = await this.prisma.cuenta.findUnique({
      where: { id: dto.cuentaId },
      include: { cliente: true },
    });

    if (!cuenta || !cuenta.activo || !cuenta.cliente.activo) {
      throw new BadRequestException('Cuenta o cliente inactivo');
    }

    if (cuenta.moneda !== dto.moneda) {
      throw new BadRequestException(
        'La moneda de la transacción no coincide con la de la cuenta',
      );
    }

    if (dto.monto <= 0) {
      throw new BadRequestException(
        'El monto de la cuenta debe ser mayor a cero',
      );
    }

    const montoDecimal = new Prisma.Decimal(dto.monto);

    if (cuenta.saldo.lessThan(montoDecimal)) {
      throw new BadRequestException('Saldo insuficiente');
    }

    const [transaccion] = await this.prisma.$transaction([
      this.prisma.transaccion.create({
        data: {
          monto: new Prisma.Decimal(dto.monto),
          moneda: dto.moneda,
          estado: 'APROBADA',
          cuentaId: dto.cuentaId,
          empresa: dto.empresa,
        },
      }),
      this.prisma.cuenta.update({
        where: { id: dto.cuentaId },
        data: {
          saldo: { decrement: dto.monto },
        },
      }),
    ]);

    return transaccion;
  }

  findAll() {
    return this.prisma.transaccion.findMany({
      include: {
        cuenta: true,
      },
    });
  }

  async findOne(id: number) {
    const trx = await this.prisma.transaccion.findUnique({ where: { id } });
    if (!trx) {
      throw new NotFoundException('Transacción no encontrada');
    }
    return trx;
  }

  async update(id: number, dto: UpdateTransaccionDto) {
    await this.findOne(id); // Ensure the transaction exists
    return this.prisma.transaccion.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.transaccion.delete({ where: { id } });
  }
}
