import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Pagination from '../components/Pagination'
import TopActiveUsers from '../components/TopActiveUsers'
import AuditStats from '../components/AuditStats'
import UserTableStats from '../components/UserTableStats'
import DeletionStats from '../components/DeletionStats'
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
  const [tableStats, setTableStats] = useState([])
  const [deletionStats, setDeletionStats] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    loadData(page)
  }, [page, startDate, endDate])

  const loadData = async (p) => {
    setLoading(true)
    try {
      const params = { startDate, endDate }
      const [{ data }, topRes, statsRes, tableRes, delRes] = await Promise.all([
        auditApi.getPaginated(p, 7),
        auditApi.getTopActive(),
        auditApi.getStats(params),
        auditApi.getTableStats(params),
        auditApi.getDeletionStats(params)
      ])
      setLogs(data.data)
      setTotalPages(data.totalPages)
      setTopUsers(topRes.data)
      setStats(statsRes.data)
      setTableStats(tableRes.data)
      setDeletionStats(delRes.data)
    } catch {
      toast.error('Error al cargar auditoría')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (d) => new Date(d).toLocaleString('es-ES')

  const exportCsv = () => {
    const header = 'Fecha,Usuario,Accion,Tabla,Detalle,Likert\n'
    const rows = logs.map(l => {
      const fecha = formatDate(l.createdAt).replace(/,/g, '')
      const usuario = l.User?.nombre || ''
      const accion = l.accion
      const tabla = l.tabla
      const detalle = (l.detalle || '').replace(/,/g, ' ')
      const likert = l.likert ?? ''
      return [fecha, usuario, accion, tabla, detalle, likert].join(',')
    })
    const csv = header + rows.join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'auditoria.csv'
    link.click()
    URL.revokeObjectURL(url)
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
        <h1 className="text-2xl font-bold text-gray-100 mb-6">Panel de Auditoría</h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-sm">Desde:</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="bg-gray-700 border-gray-600 rounded p-1 text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Hasta:</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="bg-gray-700 border-gray-600 rounded p-1 text-sm" />
          </div>
          <button onClick={() => loadData(1)} className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm">Filtrar</button>
          <button onClick={exportCsv} className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm">Exportar CSV</button>
          <button onClick={() => window.print()} className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm">PDF</button>
        </div>

        <AuditStats stats={stats} />
        <TopActiveUsers users={topUsers} />
        <UserTableStats stats={tableStats} />
        <DeletionStats stats={deletionStats} />

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
