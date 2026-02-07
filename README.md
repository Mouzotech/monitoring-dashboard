# Monitoring Dashboard

Panel de monitoreo para infraestructura, backend y frontend.

## Estructura

- `src/` - Código fuente NestJS (backend)
- `public/` - Frontend estático (React build)

## Despliegue

```bash
# Construir frontend localmente
cd frontend
npm install
npm run build
cp -r dist ../public

# Construir imagen Docker
docker build -t monitoring-dashboard .

# Ejecutar
docker run -d \
  --name monitoring-dashboard \
  -p 3000:3000 \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  --network traefik-public \
  monitoring-dashboard
```
