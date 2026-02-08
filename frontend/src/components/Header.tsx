import { useEffect, useState } from 'react';
import { Bell, Clock } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { api } from '../services/api';

function Header() {
  const [alertCount, setAlertCount] = useState(0);
  const [status, setStatus] = useState('checking');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const overview = await api.getOverview();
        setAlertCount(overview.alerts?.total || 0);
        setStatus('online');
        setLastUpdate(new Date());
      } catch {
        setStatus('offline');
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="ml-12 lg:ml-0">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Panel de Monitoreo</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${
              status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`} />
            <span className="text-sm text-[var(--text-secondary)]">
              {status === 'online' ? 'Sistema operativo' : 'Desconectado'}
            </span>
            <span className="text-[var(--text-tertiary)]">•</span>
            <div className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
              <Clock className="w-3 h-3" />
              Actualizado: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <button className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                {alertCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header
