import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { api } from '../services/api';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await api.getAlerts();
        setAlerts(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: alerts.length,
    critical: alerts.filter((a: any) => a.severity === 'critical').length,
    warning: alerts.filter((a: any) => a.severity === 'warning').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-[var(--text-secondary)]">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          Cargando alertas...
        </div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="mt-6 text-xl font-semibold text-[var(--text-primary)]">No hay alertas activas</h3>
        <p className="mt-2 text-[var(--text-secondary)]">Todos los sistemas funcionan correctamente</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-6">
          <p className="text-sm text-[var(--text-secondary)]">Total Alertas</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.total}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-[var(--text-secondary)]">Críticas</p>
          <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-[var(--text-secondary)]">Advertencias</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.warning}</p>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((alert: any, idx) => (
          <div 
            key={idx} 
            className={`card p-5 border-l-4 ${
              alert.severity === 'critical' 
                ? 'border-l-red-500' 
                : 'border-l-yellow-500'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`w-5 h-5 ${
                    alert.severity === 'critical' ? 'text-red-500' : 'text-yellow-500'
                  }`} />
                  <h3 className="font-semibold text-[var(--text-primary)]">{alert.name}</h3>
                </div>
                <p className="mt-2 text-[var(--text-secondary)]">{alert.summary}</p>
                {alert.startsAt && (
                  <p className="mt-3 text-sm text-[var(--text-tertiary)] flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Desde: {new Date(alert.startsAt).toLocaleString()}
                  </p>
                )}
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                alert.severity === 'critical'
                  ? 'bg-red-500/10 text-red-600'
                  : 'bg-yellow-500/10 text-yellow-600'
              }`}>
                {alert.severity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
