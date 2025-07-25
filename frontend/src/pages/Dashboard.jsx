import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import { recordsApi, usersApi, auditApi } from '../Services/api'
import { useAuth } from '../Context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalRecords: 0,
    activeRecords: 0,
    inactiveRecords: 0,
    pendingRecords: 0,
    totalUsers: 0,
    recentActivities: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const promises = [recordsApi.getAll()]

      if (user?.rol === 'admin') {
        promises.push(usersApi.getAll())
      }

      if (['admin', 'auditor'].includes(user?.rol)) {
        // Traigo solo las 10 primeras actividades
        promises.push(auditApi.getPaginated(1, 10))
      }

      const results = await Promise.all(promises)
      const records = results[0].data
      const users   = user?.rol === 'admin' ? results[1]?.data || [] : []
      const activitiesResponse = results[results.length - 1]
      const activities = activitiesResponse?.data?.data || []

      setStats({
        totalRecords: records.length,
        activeRecords: records.filter(r => r.estado === 'activo').length,
        inactiveRecords: records.filter(r => r.estado === 'inactivo').length,
        pendingRecords: records.filter(r => r.estado === 'pendiente').length,
        totalUsers: users.length,
        recentActivities: activities
      })
    } catch {
      toast.error('Error al cargar datos del dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Total Registros */}
          <div className="bg-gray-800 shadow rounded-lg p-5">
            <dt className="text-sm font-medium text-gray-500">Total Registros</dt>
            <dd className="text-lg font-medium">{stats.totalRecords}</dd>
          </div>
          {/* Activos */}
          <div className="bg-gray-800 shadow rounded-lg p-5">
            <dt className="text-sm font-medium text-gray-500">Activos</dt>
            <dd className="text-lg font-medium">{stats.activeRecords}</dd>
          </div>
          {/* Inactivos */}
          <div className="bg-gray-800 shadow rounded-lg p-5">
            <dt className="text-sm font-medium text-gray-500">Inactivos</dt>
            <dd className="text-lg font-medium">{stats.inactiveRecords}</dd>
          </div>
          {/* Pendientes */}
          <div className="bg-gray-800 shadow rounded-lg p-5">
            <dt className="text-sm font-medium text-gray-500">Pendientes</dt>
            <dd className="text-lg font-medium">{stats.pendingRecords}</dd>
          </div>
          {/* Total Usuarios (solo admin) */}
          {user?.rol === 'admin' && (
            <div className="bg-gray-800 shadow rounded-lg p-5">
              <dt className="text-sm font-medium text-gray-500">Total Usuarios</dt>
              <dd className="text-lg font-medium">{stats.totalUsers}</dd>
            </div>
          )}
        </div>

        {/* Actividad reciente */}
        {['admin','auditor'].includes(user?.rol) && stats.recentActivities.length > 0 && (
          <div className="bg-gray-800 shadow rounded-lg overflow-hidden">
            <h2 className="px-6 py-4 font-medium">Actividad Reciente</h2>
            <ul className="divide-y divide-gray-700">
              {stats.recentActivities.map(act => (
                <li key={act.id} className="px-6 py-4 flex justify-between">
                  <div>
                    <span className="font-medium">{act.usuario_nombre}</span> realizó <span className="font-semibold">{act.accion}</span> en{' '}
                    <span className="italic">{act.tabla}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(act.createdAt).toLocaleString('es-ES')}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
