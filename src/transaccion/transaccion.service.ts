import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransaccionDto } from './dto/create-transaccion.dto';
import { UpdateTransaccionDto } from './dto/update-transaccion.dto';
import { Prisma } from '@prisma/client';
import { AuditoriaService } from 'src/auditoria/auditoria.service';

@Injectable()
export class TransaccionService {
  constructor(
    private prisma: PrismaService,
    private auditoriaService: AuditoriaService,
  ) {}

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
          cuenta: {
            connect: { id: dto.cuentaId },
          },
          empresa: {
            connect: { id: dto.empresaId },
          },
        },
      }),
      this.prisma.cuenta.update({
        where: { id: dto.cuentaId },
        data: {
          saldo: { decrement: dto.monto },
        },
      }),
    ]);

    await this.auditoriaService.registrar({
      entidad: 'Transacción',
      entidadId: transaccion.id,
      accion: 'CREAR',
      detalle: `Transacción creada con monto ${dto.monto} ${dto.moneda} para la cuenta ${dto.cuentaId}`,
    });

    return transaccion;
  }

  findAll() {
    return this.prisma.transaccion.findMany({
      include: {
        cuenta: true,
      },
    });
  }

  async findOne(id: string) {
    const trx = await this.prisma.transaccion.findUnique({ where: { id } });
    if (!trx) {
      throw new NotFoundException('Transacción no encontrada');
    }
    return trx;
  }

  async update(id: string, dto: UpdateTransaccionDto) {
    await this.findOne(id); // Ensure the transaction exists
    await this.auditoriaService.registrar({
      entidad: 'Transaccion',
      entidadId: id,
      accion: 'ACTUALIZAR',
      detalle: `Se actualizo la transacción con ID ${id}`,
    });
    return this.prisma.transaccion.update({
      where: { id },
      data: {
        monto: dto.monto,
        moneda: dto.moneda,
        estado: dto.estado,
        cuentaId: dto.cuentaId,
        empresaId: dto.empresaId, // Assuming empresaId is a string
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.auditoriaService.registrar({
      entidad: 'Transaccion',
      entidadId: id,
      accion: 'ELIMINAR',
      detalle: `Se eliminó la transacción con ID ${id}`,
    });
    return this.prisma.transaccion.delete({ where: { id } });
  }
}
