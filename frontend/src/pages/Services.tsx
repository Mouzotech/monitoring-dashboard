import { useEffect, useState } from 'react';
import { Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.getServices();
        setServices(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
    const interval = setInterval(fetchServices, 15000);
    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: services.length,
    running: services.filter((s: any) => s.status === 'running').length,
    issues: services.filter((s: any) => s.health === 'unhealthy').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-[var(--text-secondary)]">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          Cargando servicios...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Total Servicios</p>
              <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Activos</p>
              <p className="text-2xl font-bold text-green-600">{stats.running}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Problemas</p>
              <p className="text-2xl font-bold text-red-600">{stats.issues}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service: any) => (
          <div key={service.name} className="card p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[var(--text-primary)] truncate">{service.name}</h3>
                <p className="text-sm text-[var(--text-secondary)] truncate mt-1">{service.image}</p>
              </div>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                service.health === 'healthy' ? 'bg-green-500' : 
                service.health === 'unhealthy' ? 'bg-red-500' : 'bg-gray-400'
              }`} />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                service.status === 'running'
                  ? 'bg-green-500/10 text-green-600'
                  : 'bg-gray-500/10 text-gray-600'
              }`}>
                {service.status}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                service.health === 'healthy' ? 'bg-green-500/10 text-green-600' :
                service.health === 'unhealthy' ? 'bg-red-500/10 text-red-600' :
                'bg-gray-500/10 text-gray-600'
              }`}>
                {service.health}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
