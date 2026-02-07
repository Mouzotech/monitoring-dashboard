import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { DockerModule } from '../docker/docker.module';
import { GrafanaModule } from '../grafana/grafana.module';

@Module({
  imports: [DockerModule, GrafanaModule],
  controllers: [MetricsController],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class MetricsModule {}
