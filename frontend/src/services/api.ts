const API_URL = import.meta.env.VITE_API_URL || ''

export const api = {
  async getOverview() {
    const res = await fetch(`${API_URL}/api/metrics/overview`)
    return res.json()
  },

  async getContainers() {
    const res = await fetch(`${API_URL}/api/docker/containers`)
    return res.json()
  },

  async getContainer(id: string) {
    const res = await fetch(`${API_URL}/api/docker/containers/${id}`)
    return res.json()
  },

  async getContainerStats(id: string) {
    const res = await fetch(`${API_URL}/api/docker/containers/${id}/stats`)
    return res.json()
  },

  async getServices() {
    const res = await fetch(`${API_URL}/api/metrics/services`)
    return res.json()
  },

  async getAlerts() {
    const res = await fetch(`${API_URL}/api/grafana/alerts`)
    return res.json()
  },

  async getDashboards() {
    const res = await fetch(`${API_URL}/api/grafana/dashboards`)
    return res.json()
  },

  async queryPrometheus(query: string) {
    const res = await fetch(`${API_URL}/api/grafana/query?q=${encodeURIComponent(query)}`)
    return res.json()
  },
}
