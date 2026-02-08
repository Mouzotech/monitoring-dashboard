# Monitoring Dashboard - Estado del Despliegue

## ✅ Funcionando

El panel de monitoreo está **funcionando correctamente en caliban**:

```bash
# Verificar estado
curl http://localhost:3001/api/health
# {"status":"ok"}

# Ver métricas
curl http://localhost:3001/api/metrics/overview
```

**Datos disponibles:**
- 17 contenedores Docker (14 running, 3 stopped)
- Métricas de sistema (CPU, memoria, versión Docker)
- Grafana conectado (status ok)
- 0 alertas activas

## 📁 Estructura del Proyecto

```
monitoring-dashboard/
├── src/                          # Backend NestJS
│   ├── docker/                   # API Docker (contenedores, stats, logs)
│   ├── grafana/                  # API Grafana (dashboards, alertas, query)
│   ├── metrics/                  # Métricas consolidadas
│   ├── health/                   # Health checks
│   └── main.ts                   # Punto de entrada
├── public/                       # Frontend React compilado
│   ├── index.html
│   └── assets/
├── Dockerfile                    # Build multi-stage
├── docker-compose.yml            # Despliegue
├── package.json
└── .github/workflows/deploy.yml  # GitHub Actions
```

## 🚀 APIs Disponibles

| Endpoint | Descripción |
|----------|-------------|
| `GET /api/health` | Health check |
| `GET /api/docker/containers` | Lista todos los contenedores |
| `GET /api/docker/containers/:id` | Detalle de un contenedor |
| `GET /api/docker/containers/:id/stats` | Estadísticas en tiempo real |
| `GET /api/docker/system` | Info del sistema Docker |
| `GET /api/grafana/dashboards` | Dashboards de Grafana |
| `GET /api/grafana/alerts` | Alertas activas |
| `GET /api/grafana/query?q=` | Query PromQL |
| `GET /api/metrics/overview` | Overview completo |
| `GET /api/metrics/services` | Estado de todos los servicios |

## ⚠️ Problema: Acceso Público

El servicio está accesible **solo localmente** en caliban (`localhost:3001`).

### Causa
Traefik no detecta el contenedor a pesar de tener las labels correctas. Los logs de Traefik muestran errores de configuración (faltan entrypoints y certificados).

### Soluciones Propuestas

#### Opción 1: Cloudflare Tunnel (Recomendada)
Agregar ruta al túnel existente desde el dashboard de Cloudflare:

1. Ir a https://dash.cloudflare.com
2. Zero Trust → Networks → Tunnels
3. Seleccionar el túnel `caliban` (o el nombre que tengas)
4. Agregar public host name:
   - Subdominio: `monitoring`
   - Dominio: `raspivan.com.es`
   - Type: HTTP
   - URL: `monitoring-dashboard:3000`

#### Opción 2: Arreglar Traefik
Investigar y corregir la configuración de Traefik para que detecte nuevos contenedores.

#### Opción 3: Nginx Reverse Proxy
Configurar nginx como reverse proxy temporal.

## 🔧 Comandos Útiles

```bash
# Ver logs
docker logs monitoring-dashboard --tail 50

# Restart
docker restart monitoring-dashboard

# Rebuild
cd /home/caliban/monitoring-dashboard
docker compose down
docker compose up -d --build

# Verificar APIs
curl http://localhost:3001/api/docker/containers | jq length
curl http://localhost:3001/api/metrics/overview | jq
```

## 📊 Frontend

El frontend React está disponible en `http://localhost:3001/` (cuando se accede desde caliban).

Páginas:
- **Dashboard**: Vista general con métricas principales
- **Contenedores**: Lista de contenedores Docker con detalles
- **Servicios**: Estado de servicios con filtros
- **Alertas**: Alertas de Grafana
- **Grafana**: Links a dashboards de Grafana

## 🔗 Repositorio

https://github.com/Mouzotech/monitoring-dashboard

## 📝 TODO

- [x] Backend API con NestJS
- [x] Frontend React con Tailwind
- [x] Integración Docker API
- [x] Integración Grafana API
- [x] Despliegue en caliban
- [ ] Acceso público (pendiente decisión)
- [ ] Integración Grafana Faro (errores frontend)
- [ ] Alertas en tiempo real (WebSockets)
