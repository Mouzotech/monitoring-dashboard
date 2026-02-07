import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DockerService } from './docker.service';

@ApiTags('Docker')
@Controller('docker')
export class DockerController {
  constructor(private readonly dockerService: DockerService) {}

  @Get('containers')
  @ApiOperation({ summary: 'Listar todos los contenedores' })
  async getContainers() {
    return this.dockerService.getContainers();
  }

  @Get('containers/:id')
  @ApiOperation({ summary: 'Obtener detalles de un contenedor' })
  async getContainer(@Param('id') id: string) {
    return this.dockerService.getContainer(id);
  }

  @Get('containers/:id/logs')
  @ApiOperation({ summary: 'Obtener logs de un contenedor' })
  async getContainerLogs(@Param('id') id: string) {
    return this.dockerService.getContainerLogs(id);
  }

  @Get('containers/:id/stats')
  @ApiOperation({ summary: 'Obtener estadísticas de un contenedor' })
  async getContainerStats(@Param('id') id: string) {
    return this.dockerService.getContainerStats(id);
  }

  @Get('system')
  @ApiOperation({ summary: 'Información del sistema Docker' })
  async getSystemInfo() {
    return this.dockerService.getSystemInfo();
  }

  @Get('system/df')
  @ApiOperation({ summary: 'Uso de disco de Docker' })
  async getDiskUsage() {
    return this.dockerService.getDiskUsage();
  }
}
