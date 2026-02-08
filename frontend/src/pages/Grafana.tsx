import { useEffect, useState } from 'react';
import { ExternalLink, BarChart3, ArrowUpRight } from 'lucide-react';
import { api } from '../services/api';

export default function Grafana() {
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getDashboards();
        setDashboards(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-[var(--text-secondary)]">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          Cargando dashboards...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Grafana Dashboards</h2>
          <p className="text-[var(--text-secondary)] mt-1">Visualización avanzada de métricas</p>
        </div>
        
        <a
          href="https://grafana.raspivan.com.es"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Abrir Grafana
        </a>
      </div>

      {dashboards.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
            <BarChart3 className="w-10 h-10 text-[var(--text-tertiary)]" />
          </div>
          <h3 className="mt-6 text-xl font-semibold text-[var(--text-primary)]">No se pudieron cargar los dashboards</h3>
          <p className="mt-2 text-[var(--text-secondary)]">Verifica que Grafana esté configurado correctamente</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboards.map((db: any) => (
            <a
              key={db.uid}
              href={`https://grafana.raspivan.com.es${db.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-6 group hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-primary-600 transition-colors">
                      {db.title}
                    </h3>
                    {db.folderTitle && (
                      <p className="text-sm text-[var(--text-secondary)]">{db.folderTitle}</p>
                    )}
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-primary-600 transition-colors" />
              </div>
              
              {db.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {db.tags.slice(0, 3).map((tag: string) => (
                    <span 
                      key={tag}
                      className="text-xs px-2 py-1 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
