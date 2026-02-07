import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';

@ApiTags('Health')
@Controller()
export class HealthController {
  constructor(private health: HealthCheckService) {}

  @Get()
  @ApiOperation({ summary: 'Health check básico' })
  @HealthCheck()
  check() {
    return this.health.check([]);
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check detallado' })
  @HealthCheck()
  checkDetailed() {
    return this.health.check([]);
  }
}
