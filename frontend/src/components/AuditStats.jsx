export default function AuditStats({ stats }) {
  const colors = {
    crear:  'bg-green-100 text-green-800',
    editar: 'bg-yellow-100 text-yellow-800',
    eliminar: 'bg-red-100 text-red-800',
    consultar: 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-6">
      {stats.map(s => (
        <div key={s.accion} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[s.accion]}`}
            >
              {s.accion.toUpperCase()}
            </span>
            <p className="mt-4 text-3xl font-bold text-gray-900">{s.total}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
