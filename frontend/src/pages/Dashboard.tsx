import { useEffect, useState } from 'react'
import { 
  Container, 
  AlertTriangle, 
  Server,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { api } from '../services/api'

function Dashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const overview = await api.getOverview()
        setData(overview)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (<div className="flex items-center justify-center h-full">
      <div className="text-gray-400">Cargando...</div>
    </div>)
  }

  const docker = data?.docker
  const alerts = data?.alerts || { total: 0, critical: 0, warning: 0 }

  const stats = [
    {
      title: 'Contenedores Activos',
      value: docker?.containers?.running || 0,
      total: docker?.containers?.total || 0,
      icon: Container,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Alertas Activas',
      value: alerts.total,
      icon: AlertTriangle,
      color: alerts.total > 0 ? 'text-red-500' : 'text-green-500',
      bg: alerts.total > 0 ? 'bg-red-500/10' : 'bg-green-500/10',
    },
    {
      title: 'Estado Docker',
      value: docker ? 'OK' : 'Error',
      icon: docker ? CheckCircle2 : XCircle,
      color: docker ? 'text-green-500' : 'text-red-500',
      bg: docker ? 'bg-green-500/10' : 'bg-red-500/10',
    },
    {
      title: 'CPUs Disponibles',
      value: docker?.cpus || '-',
      icon: Server,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stat.value}
                  {stat.total && <span className="text-sm text-gray-500"> / {stat.total}</span>}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Resumen de Alertas</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Críticas</span>
              <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                {alerts.critical}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Advertencias</span>
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                {alerts.warning}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total</span>
              <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                {alerts.total}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Estado del Sistema</h3>
          {docker ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Versión Docker</span>
                <span className="text-white">{docker.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Kernel</span>
                <span className="text-white">{docker.kernel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">OS</span>
                <span className="text-white">{docker.os}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Arquitectura</span>
                <span className="text-white">{docker.architecture}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Docker no disponible</p>
          )}
        </div>
      </div>

      {alerts.items?.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Últimas Alertas</h3>
          <div className="space-y-3">
            {alerts.items.slice(0, 5).map((alert: any, idx: number) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg">
                <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                  alert.severity === 'critical' ? 'text-red-500' : 'text-yellow-500'
                }`} />
                <div className="flex-1">
                  <p className="font-medium text-white">{alert.name}</p>
                  <p className="text-sm text-gray-400">{alert.summary}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  alert.severity === 'critical' 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {alert.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
