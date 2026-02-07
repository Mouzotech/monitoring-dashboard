import { useEffect, useState } from 'react'
import { 
  Container, 
  Play, 
  Square, 
  Pause, 
  Activity,
  Clock,
  Server
} from 'lucide-react'
import { api } from '../services/api'

interface ContainerData {
  id: string
  name: string
  image: string
  state: string
  status: string
  ports: { PrivatePort: number; PublicPort?: number; Type: string }[]
  created: number
  labels: Record<string, string>
}

function Containers() {
  const [containers, setContainers] = useState<ContainerData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContainer, setSelectedContainer] = useState<ContainerData | null>(null)

  useEffect(() => {
    const fetchContainers = async () => {
      try {
        const data = await api.getContainers()
        setContainers(data)
      } catch (error) {
        console.error('Error fetching containers:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchContainers()
    const interval = setInterval(fetchContainers, 10000)
    return () => clearInterval(interval)
  }, [])

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'running':
        return <Play className="w-4 h-4 text-green-500" />
      case 'exited':
        return <Square className="w-4 h-4 text-gray-500" />
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-500" />
      default:
        return <Container className="w-4 h-4 text-gray-400" />
    }
  }

  const getStateBadge = (state: string) => {
    const classes = {
      running: 'bg-green-500/20 text-green-400',
      exited: 'bg-gray-500/20 text-gray-400',
      paused: 'bg-yellow-500/20 text-yellow-400',
      restarting: 'bg-orange-500/20 text-orange-400',
    }
    return classes[state as keyof typeof classes] || 'bg-gray-500/20 text-gray-400'
  }

  if (loading) {
    return (<div className="flex items-center justify-center h-full">
      <div className="text-gray-400">Cargando contenedores...</div>
    </div>)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Contenedores Docker</h2>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
            {containers.filter(c => c.state === 'running').length} Activos
          </span>
          <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
            {containers.length} Total
          </span>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Estado</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Imagen</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Puertos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {containers.map((container) => (
              <tr 
                key={container.id}
                className="hover:bg-gray-700/50 cursor-pointer transition-colors"
                onClick={() => setSelectedContainer(container)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {getStateIcon(container.state)}
                    <span className={`text-xs px-2 py-1 rounded ${getStateBadge(container.state)}`}>
                      {container.state}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-white">{container.name}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-400">{container.image}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-400">{container.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {container.ports?.slice(0, 3).map((port, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-300">
                        {port.PublicPort || '-'}{port.PublicPort ? ':' : ''}{port.PrivatePort}/{port.Type}
                      </span>
                    ))}
                    {container.ports?.length > 3 && (
                      <span className="text-xs text-gray-500">+{container.ports.length - 3}</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedContainer && (
        <ContainerDetails 
          container={selectedContainer} 
          onClose={() => setSelectedContainer(null)}
        />
      )}
    </div>
  )
}

function ContainerDetails({ container, onClose }: { container: ContainerData; onClose: () => void }) {
  const [stats, setStats] = useState<any>(null)
  const [, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (container.state !== 'running') {
        setLoading(false)
        return
      }
      try {
        const data = await api.getContainerStats(container.id)
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
    const interval = setInterval(fetchStats, 5000)
    return () => clearInterval(interval)
  }, [container.id, container.state])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{container.name}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-1">{container.image}</p>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Server className="w-4 h-4" />
                <span className="text-sm">ID</span>
              </div>
              <p className="text-white font-mono text-sm">{container.id}</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Creado</span>
              </div>
              <p className="text-white text-sm">
                {new Date(container.created * 1000).toLocaleString()}
              </p>
            </div>
          </div>

          {stats && container.state === 'running' && (
            <>
              <h4 className="text-white font-medium mt-6 mb-3">Estadísticas en tiempo real</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Activity className="w-4 h-4" />
                    <span className="text-sm">CPU</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-white">{stats.cpu?.usage}%</span>
                    <span className="text-sm text-gray-400">{stats.cpu?.cores} cores</span>
                  </div>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Server className="w-4 h-4" />
                    <span className="text-sm">Memoria</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-white">{stats.memory?.usageMB}MB</span>
                    <span className="text-sm text-gray-400">/ {stats.memory?.limitMB}MB</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(stats.memory?.percent || 0, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {container.labels && Object.keys(container.labels).length > 0 && (
            <>
              <h4 className="text-white font-medium mt-6 mb-3">Labels</h4>
              <div className="bg-gray-700/50 p-4 rounded-lg space-y-2">
                {Object.entries(container.labels).slice(0, 10).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-400">{key}</span>
                    <span className="text-white">{value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Containers
