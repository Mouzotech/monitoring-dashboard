import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GrafanaService } from './grafana.service';

@ApiTags('Grafana')
@Controller('grafana')
export class GrafanaController {
  constructor(private readonly grafanaService: GrafanaService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check de Grafana' })
  async healthCheck() {
    return this.grafanaService.healthCheck();
  }

  @Get('datasources')
  @ApiOperation({ summary: 'Listar datasources de Grafana' })
  async getDatasources() {
    return this.grafanaService.getDatasources();
  }

  @Get('dashboards')
  @ApiOperation({ summary: 'Listar dashboards' })
  async getDashboards() {
    return this.grafanaService.getDashboards();
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Listar alertas activas' })
  async getAlerts() {
    return this.grafanaService.getAlerts();
  }

  @Get('query')
  @ApiOperation({ summary: 'Query a datasource (PromQL)' })
  async query(@Query('q') query: string, @Query('start') start?: string, @Query('end') end?: string) {
    return this.grafanaService.query(query, start, end);
  }
}
