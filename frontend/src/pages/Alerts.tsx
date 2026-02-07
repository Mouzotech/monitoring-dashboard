import { useEffect, useState } from 'react'
import { AlertTriangle, Bell, CheckCircle2, Clock } from 'lucide-react'
import { api } from '../services/api'

interface Alert {
  name: string
  severity: string
  state: string
  summary: string
  description?: string
  startsAt?: string
  endsAt?: string
  labels?: Record<string, string>
}

function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await api.getAlerts()
        setAlerts(data)
      } catch (error) {
        console.error('Error fetching alerts:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 30000)
    return () => clearInterval(interval)
  }, [])

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'all') return true
    return a.severity === filter
  })

  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    warning: alerts.filter(a => a.severity === 'warning').length,
    info: alerts.filter(a => a.severity === 'info').length,
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <Bell className="w-5 h-5 text-yellow-500" />
      default:
        return <CheckCircle2 className="w-5 h-5 text-blue-500" />
    }
  }

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 border-red-500/30'
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30'
      default:
        return 'bg-blue-500/10 border-blue-500/30'
    }
  }

  if (loading) {
    return (<div className="flex items-center justify-center h-full">
      <div className="text-gray-400">Cargando alertas...</div>
    </div>)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">Total Alertas</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">Críticas</p>
          <p className="text-2xl font-bold text-red-500">{stats.critical}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">Advertencias</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.warning}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">Info</p>
          <p className="text-2xl font-bold text-blue-500">{stats.info}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {['all', 'critical', 'warning', 'info'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {f === 'all' && 'Todas'}
            {f === 'critical' && 'Críticas'}
            {f === 'warning' && 'Advertencias'}
            {f === 'info' && 'Info'}
          </button>
        ))}
      </div>

      {filteredAlerts.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white">No hay alertas activas</h3>
          <p className="text-gray-400 mt-2">Todos los sistemas funcionan correctamente</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert, idx) => (
            <div 
              key={idx} 
              className={`rounded-lg p-4 border ${getSeverityClass(alert.severity)}`}
            >
              <div className="flex items-start gap-3">
                {getSeverityIcon(alert.severity)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">{alert.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      alert.severity === 'critical'
                        ? 'bg-red-500/20 text-red-400'
                        : alert.severity === 'warning'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-gray-300 mt-1">{alert.summary}</p>
                  {alert.description && (
                    <p className="text-sm text-gray-400 mt-2">{alert.description}</p>
                  )}
                  {alert.startsAt && (
                    <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      Desde: {new Date(alert.startsAt).toLocaleString()}
                    </div>
                  )}
                  {alert.labels && Object.keys(alert.labels).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {Object.entries(alert.labels).slice(0, 5).map(([key, value]) => (
                        <span key={key} className="text-xs px-2 py-1 bg-gray-900/50 rounded text-gray-400">
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Alerts
