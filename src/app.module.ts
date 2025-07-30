import { Module } from '@nestjs/common';
import { ClienteModule } from './cliente/cliente.module';
import { CuentaModule } from './cuenta/cuenta.module';
import { TransaccionModule } from './transaccion/transaccion.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmpresaModule } from './empresa/empresa.module';

@Module({
  imports: [
    ClienteModule,
    CuentaModule,
    TransaccionModule,
    PrismaModule,
    EmpresaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
