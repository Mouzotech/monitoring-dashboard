import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DockerModule } from './docker/docker.module';
import { GrafanaModule } from './grafana/grafana.module';
import { MetricsModule } from './metrics/metrics.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule,
    DockerModule,
    GrafanaModule,
    MetricsModule,
    HealthModule,
  ],
})
export class AppModule {}
