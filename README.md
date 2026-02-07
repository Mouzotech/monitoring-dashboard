# Monitoring Dashboard

Panel de monitoreo para infraestructura, backend y frontend. Desplegado en caliban con Docker, Traefik y Cloudflare Tunnel.

## Arquitectura

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│   React (UI)    │────▶│  NestJS API  │────▶│  Docker Engine  │
│   Port 5173     │     │  Port 3000   │     │  /var/run/docker.sock│
└─────────────────┘     └──────┬───────┘     └─────────────────┘
                               │
                               ▼
                     ┌─────────────────┐
                     │  Grafana API    │
                     │  VictoriaMetrics│
                     └─────────────────┘
```

## Stack Tecnológico

### Backend
- **NestJS 10** + Fastify
- **Dockerode** - Cliente Docker
- **Axios** - HTTP client
- **Swagger** - API docs

### Frontend
- **React 18** + TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons

## Despliegue

```bash
# Push a main o dev
git push origin main

# GitHub Actions se encarga del resto:
# - Build Docker image
# - Deploy en caliban
# - Verificación de salud
```

## Endpoints API

| Endpoint | Descripción |
|----------|-------------|
| `GET /` | Health check |
| `GET /api/docs` | Swagger UI |
| `GET /api/docker/containers` | Lista contenedores |
| `GET /api/docker/containers/:id` | Detalle contenedor |
| `GET /api/docker/containers/:id/stats` | Estadísticas |
| `GET /api/docker/system` | Info sistema Docker |
| `GET /api/grafana/dashboards` | Dashboards Grafana |
| `GET /api/grafana/alerts` | Alertas activas |
| `GET /api/grafana/query?q=` | Query PromQL |
| `GET /api/metrics/overview` | Overview completo |
| `GET /api/metrics/services` | Estado servicios |

## Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | 3000 |
| `DOCKER_SOCKET` | Path al socket Docker | /var/run/docker.sock |
| `GRAFANA_URL` | URL de Grafana | http://grafana:3000 |
| `VICTORIA_METRICS_URL` | URL VictoriaMetrics | http://victoriametrics:8428 |
| `GRAFANA_API_KEY` | API key Grafana (opcional) | - |

## Acceso

- **Dashboard**: https://monitoring.raspivan.com.es
- **API Docs**: https://monitoring.raspivan.com.es/api/docs

## Desarrollo Local

```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev
```

## Roadmap

- [x] Dashboard básico de contenedores
- [x] Integración con Grafana API
- [ ] Integración Grafana Faro (errores frontend)
- [ ] Alertas en tiempo real (WebSockets)
- [ ] Historial de métricas
