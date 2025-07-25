export default function AuditStats({ stats }) {
  const colors = {
    crear: 'bg-green-600 text-white',
    editar: 'bg-yellow-600 text-white',
    eliminar: 'bg-red-600 text-white',
    consultar: 'bg-gray-700 text-white'
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-6">
      {stats.map(s => (
        <div key={s.accion} className="bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[s.accion]}`}
            >
              {s.accion.toUpperCase()}
            </span>
            <p className="mt-4 text-3xl font-bold">{s.total}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
