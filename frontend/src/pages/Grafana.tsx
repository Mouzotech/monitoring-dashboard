import { useEffect, useState } from 'react'
import { ExternalLink, BarChart3, RefreshCw } from 'lucide-react'
import { api } from '../services/api'

interface Dashboard {
  id: number
  uid: string
  title: string
  folderTitle: string
  url: string
  tags: string[]
}

function Grafana() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([])
  const [loading, setLoading] = useState(true)
  const [grafanaUrl, setGrafanaUrl] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dbs, health] = await Promise.all([
          api.getDashboards(),
          api.queryPrometheus('up').catch(() => null),
        ])
        setDashboards(dbs)
        // Extraer URL base de Grafana
        setGrafanaUrl('https://grafana.raspivan.com.es')
      } catch (error) {
        console.error('Error fetching Grafana data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (<div className="flex items-center justify-center h-full">
      <div className="text-gray-400">Cargando datos de Grafana...</div>
    </div>)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Grafana Dashboards</h2>
          <p className="text-gray-400">Visualización avanzada de métricas</p>
        </div>
        <div className="flex gap-2">
          <a
            href={grafanaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Abrir Grafana
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboards.map((db) => (
          <a
            key={db.uid}
            href={`${grafanaUrl}${db.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-primary-500 transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-500/10 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors">
                    {db.title}
                  </h3>
                  {db.folderTitle && (
                    <p className="text-sm text-gray-400">{db.folderTitle}</p>
                  )}
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            {db.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {db.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>

      {dashboards.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
          <RefreshCw className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white">No se pudieron cargar los dashboards</h3>
          <p className="text-gray-400 mt-2">
            Verifica que Grafana esté configurado correctamente
          </p>
          <a
            href={grafanaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-500 hover:text-primary-400 mt-4 inline-block"
          >
            Ir a Grafana directamente →
          </a>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">Integración Directa con VictoriaMetrics</h3>
        <p className="text-gray-400 mb-4">
          El backend puede consultar métricas directamente desde VictoriaMetrics usando PromQL.
          Esto permite visualizar métricas personalizadas sin pasar por Grafana.
        </p>
        
        <div className="bg-gray-900 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-2">Ejemplo de queries disponibles:</p>
          <pre className="text-sm text-green-400 font-mono overflow-x-auto">
{`# Uso de CPU por contenedor
rate(container_cpu_usage_seconds_total[5m])

# Uso de memoria
container_memory_usage_bytes / container_spec_memory_limit_bytes

# Contenedores en ejecución
up{job="docker-containers"}

# Tráfico de red
rate(container_network_receive_bytes_total[5m])`}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default Grafana
