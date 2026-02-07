import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from './config/config.module';
import { DockerModule } from './docker/docker.module';
import { GrafanaModule } from './grafana/grafana.module';
import { MetricsModule } from './metrics/metrics.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'],
    }),
    ConfigModule,
    DockerModule,
    GrafanaModule,
    MetricsModule,
    HealthModule,
  ],
})
export class AppModule {}
