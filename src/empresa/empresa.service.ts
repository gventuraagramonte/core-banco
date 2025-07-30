import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

@Injectable()
export class EmpresaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEmpresaDto) {
    console.log('Creating empresa with data:', dto);
    return this.prisma.empresa.create({
      data: {
        nombre: dto.nombre,
        ruc: dto.ruc,
      },
    });
  }

  async findAll() {
    return this.prisma.empresa.findMany();
  }

  async findOne(id: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id },
    });
    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada');
    }
    return empresa;
  }

  async update(id: string, dto: UpdateEmpresaDto) {
    return this.prisma.empresa.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.empresa.update({
      where: { id },
      data: { activa: false },
    });
  }
}
