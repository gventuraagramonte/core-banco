// src/common/middleware/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;

      const log = {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration,
        timestamp: new Date().toISOString(),

        // Campos personalizados
        clienteId: req.body?.clienteId || req.query?.clienteId || req.headers['x-cliente-id'],
        monto: parseFloat(req.body?.monto) || 0,
        moneda: req.body?.moneda || 'PEN',
        transaccionId: res.locals?.transaccionId || undefined,
      };

      console.log(JSON.stringify(log));
    });

    next();
  }
}

