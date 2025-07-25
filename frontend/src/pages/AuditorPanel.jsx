import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Pagination from '../components/Pagination'
import TopActiveUsers from '../components/TopActiveUsers'
import AuditStats from '../components/AuditStats'
import { auditApi } from '../Services/api'

const colors = {
  crear: 'bg-green-600 text-white',
  editar: 'bg-yellow-600 text-white',
  eliminar: 'bg-red-600 text-white',
  consultar: 'bg-gray-700 text-white'
}

export default function AuditorPanel() {
  const [logs, setLogs] = useState([])
  const [stats, setStats] = useState([])
  const [topUsers, setTopUsers] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData(page)
  }, [page])

  const loadData = async (p) => {
    setLoading(true)
    try {
      const [{ data }, topRes, statsRes] = await Promise.all([
        auditApi.getPaginated(p, 7),
        auditApi.getTopActive(),
        auditApi.getStats()
      ])
      setLogs(data.data)
      setTotalPages(data.totalPages)
      setTopUsers(topRes.data)
      setStats(statsRes.data)
    } catch {
      toast.error('Error al cargar auditoría')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (d) => new Date(d).toLocaleString('es-ES')

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
        <h1 className="text-2xl font-bold text-gray-100 mb-6">Panel de Auditoría</h1>

        <AuditStats stats={stats} />
        <TopActiveUsers users={topUsers} />

        <div className="bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium mb-4">Registros</h2>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Acción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Tabla
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Detalle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                      Likert
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {logs.map(l => (
                    <tr key={l.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(l.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{l.User?.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${colors[l.accion]}`}>
                          {l.accion.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{l.tabla}</td>
                      <td className="px-6 py-4 text-sm truncate max-w-xs">{l.detalle}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{l.likert ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      </div>
    </div>
  )
}
