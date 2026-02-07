import { useEffect, useState } from 'react'
import { Activity, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react'
import { api } from '../services/api'

interface Service {
  name: string
  image: string
  status: string
  health: string
  uptime: string
  ports: { internal: number; external?: number; type: string }[]
}

function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.getServices()
        setServices(data)
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
    const interval = setInterval(fetchServices, 15000)
    return () => clearInterval(interval)
  }, [])

  const filteredServices = services.filter(s => {
    if (filter === 'all') return true
    if (filter === 'running') return s.status === 'running'
    if (filter === 'stopped') return s.status !== 'running'
    if (filter === 'issues') return s.health === 'unhealthy' || s.status !== 'running'
    return true
  })

  const stats = {
    total: services.length,
    running: services.filter(s => s.status === 'running').length,
    stopped: services.filter(s => s.status !== 'running').length,
    issues: services.filter(s => s.health === 'unhealthy').length,
  }

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'unhealthy':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'running':
        return <Activity className="w-5 h-5 text-blue-500" />
      default:
        return <XCircle className="w-5 h-5 text-gray-500" />
    }
  }

  if (loading) {
    return (<div className="flex items-center justify-center h-full">
      <div className="text-gray-400">Cargando servicios...</div>
    </div>)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">Total</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">Activos</p>
          <p className="text-2xl font-bold text-green-500">{stats.running}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">Detenidos</p>
          <p className="text-2xl font-bold text-gray-500">{stats.stopped}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">Problemas</p>
          <p className="text-2xl font-bold text-red-500">{stats.issues}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {['all', 'running', 'stopped', 'issues'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {f === 'all' && 'Todos'}
            {f === 'running' && 'Activos'}
            {f === 'stopped' && 'Detenidos'}
            {f === 'issues' && 'Con Problemas'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => (
          <div key={service.name} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-white">{service.name}</h3>
                <p className="text-sm text-gray-400 truncate">{service.image}</p>
              </div>
              {getHealthIcon(service.health)}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-400">{service.uptime}</span>
              </div>

              {service.ports && service.ports.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {service.ports.slice(0, 3).map((port, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-300">
                      {port.external || '-'}{port.external ? ':' : ''}{port.internal}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 mt-3">
                <span className={`text-xs px-2 py-1 rounded ${
                  service.status === 'running'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {service.status}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  service.health === 'healthy'
                    ? 'bg-green-500/20 text-green-400'
                    : service.health === 'unhealthy'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {service.health}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Services
