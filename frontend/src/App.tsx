import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Containers from './pages/Containers'
import Services from './pages/Services'
import Alerts from './pages/Alerts'
import Grafana from './pages/Grafana'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="containers" element={<Containers />} />
            <Route path="services" element={<Services />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="grafana" element={<Grafana />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
