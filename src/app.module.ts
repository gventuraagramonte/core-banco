import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClienteModule } from './cliente/cliente.module';
import { CuentaModule } from './cuenta/cuenta.module';
import { TransaccionModule } from './transaccion/transaccion.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmpresaModule } from './empresa/empresa.module';
import { AuditoriaModule } from './auditoria/auditoria.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    ClienteModule,
    CuentaModule,
    TransaccionModule,
    PrismaModule,
    EmpresaModule,
    AuditoriaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
