import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import * as Docker from 'dockerode';

@Injectable()
export class DockerService implements OnModuleInit {
  private docker: Docker;

  constructor(@Inject('CONFIG') private config: any) {}

  onModuleInit() {
    this.docker = new Docker({ socketPath: this.config.docker.socketPath });
  }

  async getContainers(): Promise<any[]> {
    const containers = await this.docker.listContainers({ all: true });
    return containers.map(c => ({
      id: c.Id.slice(0, 12),
      name: c.Names[0]?.replace('/', '') || 'unnamed',
      image: c.Image,
      state: c.State,
      status: c.Status,
      ports: c.Ports,
      created: c.Created,
      labels: c.Labels,
    }));
  }

  async getContainer(id: string): Promise<any> {
    const container = this.docker.getContainer(id);
    const info = await container.inspect();
    return {
      id: info.Id.slice(0, 12),
      name: info.Name.replace('/', ''),
      image: info.Config.Image,
      state: info.State.Status,
      health: info.State.Health?.Status || null,
      restartCount: info.RestartCount,
      created: info.Created,
      started: info.State.StartedAt,
      finished: info.State.FinishedAt,
      exitCode: info.State.ExitCode,
      error: info.State.Error,
      env: info.Config.Env,
      labels: info.Config.Labels,
      mounts: info.Mounts,
      networkMode: info.HostConfig.NetworkMode,
      ports: info.NetworkSettings.Ports,
    };
  }

  async getContainerLogs(id: string, tail = 100): Promise<string> {
    const container = this.docker.getContainer(id);
    const logs = await container.logs({
      stdout: true,
      stderr: true,
      tail,
      timestamps: true,
    });
    return logs.toString('utf-8');
  }

  async getContainerStats(id: string): Promise<any> {
    const container = this.docker.getContainer(id);
    const stats = await container.stats({ stream: false });
    
    const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
    const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
    const cpuPercent = systemDelta > 0 ? (cpuDelta / systemDelta) * stats.cpu_stats.cpu_usage.percpu_usage.length * 100 : 0;

    const memUsage = stats.memory_stats.usage || 0;
    const memLimit = stats.memory_stats.limit || 1;
    const memPercent = (memUsage / memLimit) * 100;

    return {
      cpu: {
        usage: cpuPercent.toFixed(2),
        cores: stats.cpu_stats.cpu_usage.percpu_usage?.length || 1,
      },
      memory: {
        usage: memUsage,
        limit: memLimit,
        percent: memPercent.toFixed(2),
        usageMB: (memUsage / 1024 / 1024).toFixed(2),
        limitMB: (memLimit / 1024 / 1024).toFixed(2),
      },
      networks: stats.networks,
      processes: stats.pids_stats?.current || 0,
    };
  }

  async getSystemInfo(): Promise<any> {
    const info = await this.docker.info();
    return {
      version: info.ServerVersion,
      containers: {
        total: info.Containers,
        running: info.ContainersRunning,
        paused: info.ContainersPaused,
        stopped: info.ContainersStopped,
      },
      images: info.Images,
      driver: info.Driver,
      cpus: info.NCPU,
      memory: info.MemTotal,
      kernel: info.KernelVersion,
      os: info.OperatingSystem,
      architecture: info.Architecture,
    };
  }

  async getDiskUsage(): Promise<any> {
    const df = await this.docker.df();
    return {
      layersSize: df.LayersSize,
      images: df.Images.map(img => ({
        id: img.Id.slice(0, 12),
        size: img.Size,
        sharedSize: img.SharedSize,
        virtualSize: img.VirtualSize,
        containers: img.Containers,
      })),
      containers: df.Containers.map(c => ({
        id: c.Id.slice(0, 12),
        names: c.Names,
        image: c.Image,
        sizeRw: c.SizeRw,
        sizeRootFs: c.SizeRootFs,
      })),
      volumes: df.Volumes?.map(v => ({
        name: v.Name,
        driver: v.Driver,
        size: v.UsageData?.Size || 0,
      })) || [],
    };
  }
}
