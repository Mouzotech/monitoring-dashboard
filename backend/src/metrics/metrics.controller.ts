import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Overview completo del sistema' })
  async getOverview() {
    return this.metricsService.getOverview();
  }

  @Get('prometheus')
  @ApiOperation({ summary: 'Métricas en formato Prometheus' })
  async getPrometheusMetrics() {
    return this.metricsService.getPrometheusMetrics();
  }

  @Get('services')
  @ApiOperation({ summary: 'Estado de todos los servicios' })
  async getServicesStatus() {
    return this.metricsService.getServicesStatus();
  }

  @Get('errors')
  @ApiOperation({ summary: 'Errores recopilados (placeholder para Faro)' })
  async getErrors() {
    return this.metricsService.getErrors();
  }
}
