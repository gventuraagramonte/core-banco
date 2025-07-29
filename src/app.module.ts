import { Module } from '@nestjs/common';
import { ClienteModule } from './cliente/cliente.module';
import { CuentaModule } from './cuenta/cuenta.module';
import { TransaccionModule } from './transaccion/transaccion.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ClienteModule, CuentaModule, TransaccionModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
