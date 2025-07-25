import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import { recordsApi } from '../services/api'

export default function UserPanel() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecords()
  }, [])

  const loadRecords = async () => {
    try {
      const response = await recordsApi.getAll()
      // Filtrar solo registros activos para usuarios
      setRecords(response.data.filter(record => record.estado === 'activo'))
    } catch (error) {
      toast.error('Error al cargar registros')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Panel de Usuario</h1>
          
          {/* Vista de registros */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Registros Disponibles</h2>
              
              {records.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay registros disponibles</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {records.map(record => (
                    <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{record.titulo}</h3>
                      <p className="text-gray-600 mb-2">{record.descripcion}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{record.categoria}</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {record.estado}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}