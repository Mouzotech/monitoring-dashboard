import { useEffect, useState } from 'react'
import { Bell, Server } from 'lucide-react'
import { api } from '../services/api'

function Header() {
  const [alertCount, setAlertCount] = useState(0)
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const overview = await api.getOverview()
        setAlertCount(overview.alerts?.total || 0)
        setStatus('online')
      } catch {
        setStatus('offline')
      }
    }
    checkStatus()
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Panel de Monitoreo</h2>
          <p className="text-sm text-gray-400">Infraestructura, Backend & Frontend</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Server className={`w-4 h-4 ${status === 'online' ? 'text-green-500' : 'text-red-500'}`} />
            <span className="text-sm text-gray-400">
              {status === 'online' ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
          <button className="relative p-2 text-gray-400 hover:text-white">
            <Bell className="w-5 h-5" />
            {alertCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                {alertCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
