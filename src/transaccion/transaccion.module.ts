import { Module } from '@nestjs/common';
import { TransaccionService } from './transaccion.service';
import { TransaccionController } from './transaccion.controller';
import { AuditoriaModule } from 'src/auditoria/auditoria.module';

@Module({
  imports: [AuditoriaModule],
  controllers: [TransaccionController],
  providers: [TransaccionService],
})
export class TransaccionModule {}
