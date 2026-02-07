import { Module, Global } from '@nestjs/common';

@Global()
@Module({
  providers: [
    {
      provide: 'CONFIG',
      useValue: {
        docker: {
          socketPath: process.env.DOCKER_SOCKET || '/var/run/docker.sock',
        },
        grafana: {
          url: process.env.GRAFANA_URL || 'http://grafana:3000',
          apiKey: process.env.GRAFANA_API_KEY || '',
        },
        victoriaMetrics: {
          url: process.env.VICTORIA_METRICS_URL || 'http://victoriametrics:8428',
        },
      },
    },
  ],
  exports: ['CONFIG'],
})
export class ConfigModule {}
