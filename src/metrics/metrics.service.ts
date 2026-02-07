import { Injectable } from '@nestjs/common';
import { DockerService } from '../docker/docker.service';
import { GrafanaService } from '../grafana/grafana.service';

@Injectable()
export class MetricsService {
  constructor(
    private readonly dockerService: DockerService,
    private readonly grafanaService: GrafanaService,
  ) {}

  async getOverview(): Promise<any> {
    const [docker, grafana, alerts] = await Promise.all([
      this.dockerService.getSystemInfo().catch(() => null),
      this.grafanaService.healthCheck().catch(() => ({ status: 'error' })),
      this.grafanaService.getAlerts().catch(() => []),
    ]);

    return {
      timestamp: new Date().toISOString(),
      docker: docker || { error: 'Docker unavailable' },
      grafana: grafana.status === 'ok' ? { status: 'ok' } : { status: 'error' },
      alerts: {
        total: alerts.length,
        critical: alerts.filter((a: any) => a.severity === 'critical').length,
        warning: alerts.filter((a: any) => a.severity === 'warning').length,
        items: alerts.slice(0, 10),
      },
    };
  }

  async getPrometheusMetrics(): Promise<string> {
    const systemInfo = await this.dockerService.getSystemInfo().catch(() => null);
    const containers = await this.dockerService.getContainers().catch(() => []);

    let metrics = '# HELP monitoring_dashboard_info Info about this dashboard\n';
    metrics += '# TYPE monitoring_dashboard_info gauge\n';
    metrics += `monitoring_dashboard_info{version="1.0.0"} 1\n`;

    if (systemInfo) {
      metrics += '# HELP docker_containers_total Total number of containers\n';
      metrics += '# TYPE docker_containers_total gauge\n';
      metrics += `docker_containers_total{state="running"} ${systemInfo.containers.running}\n`;
      metrics += `docker_containers_total{state="stopped"} ${systemInfo.containers.stopped}\n`;
      metrics += `docker_containers_total{state="paused"} ${systemInfo.containers.paused}\n`;
    }

    metrics += '# HELP docker_container_up Container running status\n';
    metrics += '# TYPE docker_container_up gauge\n';
    containers.forEach(c => {
      metrics += `docker_container_up{name="${c.name}"} ${c.state === 'running' ? 1 : 0}\n`;
    });

    return metrics;
  }

  async getServicesStatus(): Promise<any[]> {
    const containers = await this.dockerService.getContainers().catch(() => []);
    
    return containers.map(c => ({
      name: c.name,
      image: c.image,
      status: c.state,
      health: c.status.includes('healthy') ? 'healthy' : 
              c.status.includes('unhealthy') ? 'unhealthy' : 
              c.state === 'running' ? 'running' : 'stopped',
      uptime: c.status,
      ports: c.ports?.map((p: any) => ({
        internal: p.PrivatePort,
        external: p.PublicPort,
        type: p.Type,
      })),
    }));
  }

  async getErrors(): Promise<any> {
    // Placeholder para integración con Faro en el futuro
    return {
      source: 'placeholder',
      note: 'Integración con Grafana Faro pendiente',
      errors: [],
      total: 0,
      timeframe: 'last 24h',
    };
  }
}
