import { useEffect, useState } from 'react';
import { 
  Container, 
  AlertTriangle, 
  Server,
  CheckCircle2,
  XCircle,
  Cpu,
  HardDrive,
  Clock,
  TrendingUp
} from 'lucide-react';
import { api } from '../services/api';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange';
  trend?: string;
}

const colorClasses = {
  blue: 'from-blue-500 to-blue-600 shadow-blue-500/25',
  green: 'from-green-500 to-green-600 shadow-green-500/25',
  red: 'from-red-500 to-red-600 shadow-red-500/25',
  purple: 'from-purple-500 to-purple-600 shadow-purple-500/25',
  orange: 'from-orange-500 to-orange-600 shadow-orange-500/25',
};

function StatCard({ title, value, subtitle, icon: Icon, color, trend }: StatCardProps) {
  return (
    <div className="card card-hover p-6 animate-slide-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-[var(--text-primary)]">{value}</p>
            {subtitle && (
              <span className="text-sm text-[var(--text-tertiary)]">{subtitle}</span>
            )}
          </div>
          {trend && (
            <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {trend}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const overview = await api.getOverview();
        setData(overview);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-[var(--text-secondary)]">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          Cargando dashboard...
        </div>
      </div>
    );
  }

  const docker = data?.docker;
  const alerts = data?.alerts || { total: 0, critical: 0, warning: 0 };

  const stats: StatCardProps[] = [
    {
      title: 'Contenedores Activos',
      value: docker?.containers?.running || 0,
      subtitle: `de ${docker?.containers?.total || 0} total`,
      icon: Container,
      color: 'blue',
    },
    {
      title: 'Alertas Activas',
      value: alerts.total,
      subtitle: alerts.total > 0 ? `${alerts.critical} críticas` : 'Todo OK',
      icon: AlertTriangle,
      color: alerts.total > 0 ? 'red' : 'green',
    },
    {
      title: 'Estado del Sistema',
      value: docker ? 'Operativo' : 'Error',
      icon: docker ? CheckCircle2 : XCircle,
      color: docker ? 'green' : 'red',
    },
    {
      title: 'CPUs Disponibles',
      value: docker?.cpus || '-',
      icon: Cpu,
      color: 'purple',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Info */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Server className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Información del Sistema</h3>
              <p className="text-sm text-[var(--text-secondary)]">Docker & Host</p>
            </div>
          </div>
          
          {docker ? (
            <div className="space-y-4">
              {[
                { label: 'Versión Docker', value: docker.version, icon: Container },
                { label: 'Kernel', value: docker.kernel, icon: HardDrive },
                { label: 'Sistema Operativo', value: docker.os, icon: Server },
                { label: 'Arquitectura', value: docker.architecture, icon: Cpu },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)]">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-[var(--text-tertiary)]" />
                    <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium text-[var(--text-primary)]">{item.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[var(--text-tertiary)]">
              Docker no disponible
            </div>
          )}
        </div>

        {/* Alerts Summary */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Resumen de Alertas</h3>
              <p className="text-sm text-[var(--text-secondary)]">{alerts.total} alertas activas</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { label: 'Críticas', count: alerts.critical, color: 'bg-red-500' },
              { label: 'Advertencias', count: alerts.warning, color: 'bg-yellow-500' },
              { label: 'Info', count: alerts.total - alerts.critical - alerts.warning, color: 'bg-blue-500' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
                </div>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                  item.count > 0 
                    ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]' 
                    : 'text-[var(--text-tertiary)]'
                }`}>
                  {item.count}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-[var(--border-color)]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Estado general</span>
              <span className={`font-medium ${alerts.total === 0 ? 'text-green-500' : 'text-yellow-500'}`}>
                {alerts.total === 0 ? '✓ Todo OK' : '⚠ Requiere atención'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      {alerts.items?.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Últimas Alertas</h3>
              <p className="text-sm text-[var(--text-secondary)]">Alertas recientes del sistema</p>
            </div>
          </div>

          <div className="space-y-3">
            {alerts.items.slice(0, 5).map((alert: any, idx: number) => (
              <div 
                key={idx} 
                className="flex items-start gap-4 p-4 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
              >
                <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                  alert.severity === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--text-primary)] truncate">{alert.name}</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{alert.summary}</p>
                  {alert.startsAt && (
                    <p className="text-xs text-[var(--text-tertiary)] mt-2">
                      Desde: {new Date(alert.startsAt).toLocaleString()}
                    </p>
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                  alert.severity === 'critical' 
                    ? 'bg-red-500/10 text-red-600 dark:text-red-400' 
                    : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                }`}>
                  {alert.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard
