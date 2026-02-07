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
    // API modules first (order matters in Fastify)
    ConfigModule,
    HealthModule,
    DockerModule,
    GrafanaModule,
    MetricsModule,
    // Static files last
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
      exclude: ['/api/(.*)'],
    }),
  ],
})
export class AppModule {}
