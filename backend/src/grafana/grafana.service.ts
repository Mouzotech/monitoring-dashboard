import { Injectable, Inject } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GrafanaService {
  constructor(@Inject('CONFIG') private config: any) {}

  private getHeaders() {
    const headers: any = { 'Content-Type': 'application/json' };
    if (this.config.grafana.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.grafana.apiKey}`;
    }
    return headers;
  }

  async healthCheck(): Promise<any> {
    try {
      const response = await axios.get(`${this.config.grafana.url}/api/health`, {
        headers: this.getHeaders(),
        timeout: 5000,
      });
      return { status: 'ok', grafana: response.data };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async getDatasources(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.config.grafana.url}/api/datasources`, {
        headers: this.getHeaders(),
      });
      return response.data.map((ds: any) => ({
        id: ds.id,
        name: ds.name,
        type: ds.type,
        url: ds.url,
        isDefault: ds.isDefault,
      }));
    } catch (error) {
      return [];
    }
  }

  async getDashboards(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.config.grafana.url}/api/search`, {
        headers: this.getHeaders(),
        params: { type: 'dash-db' },
      });
      return response.data.map((db: any) => ({
        id: db.id,
        uid: db.uid,
        title: db.title,
        folderTitle: db.folderTitle,
        url: db.url,
        tags: db.tags,
      }));
    } catch (error) {
      return [];
    }
  }

  async getAlerts(): Promise<any[]> {
    try {
      // Intentar unified alerting primero (Grafana 8+)
      const response = await axios.get(`${this.config.grafana.url}/api/alertmanager/grafana/api/v2/alerts`, {
        headers: this.getHeaders(),
      });
      return response.data.map((alert: any) => ({
        name: alert.labels?.alertname || 'Unknown',
        severity: alert.labels?.severity || 'unknown',
        state: alert.status?.state || 'unknown',
        summary: alert.annotations?.summary || '',
        description: alert.annotations?.description || '',
        startsAt: alert.startsAt,
        endsAt: alert.endsAt,
        labels: alert.labels,
      }));
    } catch (error) {
      // Fallback a legacy alerting
      try {
        const legacy = await axios.get(`${this.config.grafana.url}/api/alerts`, {
          headers: this.getHeaders(),
        });
        return legacy.data.map((alert: any) => ({
          name: alert.name,
          severity: alert.state,
          state: alert.state,
          summary: alert.message,
          description: alert.message,
        }));
      } catch {
        return [];
      }
    }
  }

  async query(query: string, start?: string, end?: string): Promise<any> {
    try {
      // Query directo a VictoriaMetrics
      const url = `${this.config.victoriaMetrics.url}/api/v1/query_range`;
      const now = Math.floor(Date.now() / 1000);
      const params = {
        query,
        start: start || (now - 3600).toString(),
        end: end || now.toString(),
        step: '60',
      };
      
      const response = await axios.get(url, { params, timeout: 30000 });
      return response.data;
    } catch (error) {
      return { error: error.message, query };
    }
  }
}
