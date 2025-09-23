import {
  Controller,
  Get,
  HttpCode,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HealthService } from './health.service';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('/livez')
  @HttpCode(200)
  livez() {
    return 'ok';
  }

  @Get('/readyz')
  async readyz() {
    try {
      await this.healthService.pingDb();
      return { status: 'ready' };
    } catch (error) {
      throw new ServiceUnavailableException({
        status: 'not-ready',
        reason: String(error),
      });
    }
  }

  @Get('/healthz')
  @HttpCode(200)
  healthz() {
    return {
      uptime: process.uptime(),
      pid: process.pid,
      memory: process.memoryUsage(),
      status: 'ok',
    };
  }
}
