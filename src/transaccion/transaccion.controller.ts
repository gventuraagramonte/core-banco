import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TransaccionService } from './transaccion.service';
import { CreateTransaccionDto } from './dto/create-transaccion.dto';
import { UpdateTransaccionDto } from './dto/update-transaccion.dto';

@Controller('transaccion')
export class TransaccionController {
  constructor(private readonly transaccionService: TransaccionService) {}

  @Post()
  create(@Body() dto: CreateTransaccionDto) {
    return this.transaccionService.create(dto);
  }

  @Get()
  findAll() {
    return this.transaccionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transaccionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTransaccionDto) {
    return this.transaccionService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transaccionService.remove(id);
  }
}
