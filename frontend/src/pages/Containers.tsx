import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Containers() {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchContainers = async () => {
      try {
        const data = await api.getContainers();
        setContainers(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContainers();
    const interval = setInterval(fetchContainers, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredContainers = containers.filter((c: any) => {
    if (filter === 'all') return true;
    if (filter === 'running') return c.state === 'running';
    if (filter === 'stopped') return c.state !== 'running';
    return true;
  });

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'running': return <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />;
      case 'exited': return <div className="w-3 h-3 rounded-full bg-gray-400" />;
      default: return <div className="w-3 h-3 rounded-full bg-yellow-500" />;
    }
  };

  const getStateClass = (state: string) => {
    switch (state) {
      case 'running': return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'exited': return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
      default: return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-[var(--text-secondary)]">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          Cargando contenedores...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Contenedores Docker</h2>
          <p className="text-[var(--text-secondary)] mt-1">
            {containers.filter((c: any) => c.state === 'running').length} activos de {containers.length} total
          </p>
        </div>
        
        <div className="flex gap-2">
          {['all', 'running', 'stopped'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'running' ? 'Activos' : 'Detenidos'}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--bg-secondary)]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Imagen</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden md:table-cell">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredContainers.map((container: any) => (
                <tr key={container.id} className="hover:bg-[var(--hover-bg)] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getStateIcon(container.state)}
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStateClass(container.state)}`}>
                        {container.state}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-[var(--text-primary)]">{container.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[var(--text-secondary)] truncate max-w-[200px] block">{container.image}</span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-sm text-[var(--text-tertiary)]">{container.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
