import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Container, 
  Activity, 
  AlertTriangle, 
  BarChart3 
} from 'lucide-react'

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/containers', icon: Container, label: 'Contenedores' },
  { path: '/services', icon: Activity, label: 'Servicios' },
  { path: '/alerts', icon: AlertTriangle, label: 'Alertas' },
  { path: '/grafana', icon: BarChart3, label: 'Grafana' },
]

function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary-500" />
          Monitoreo
        </h1>
      </div>
      <nav className="p-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
