export default function DeletionStats({ stats }) {
  if (!stats.length) return null

  return (
    <div className="bg-gray-800 shadow rounded-lg p-6 mb-6 overflow-x-auto">
      <h2 className="text-lg font-medium mb-4">Eliminaciones por tabla</h2>
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Tabla</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Total</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {stats.map((s, idx) => (
            <tr key={idx}>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{s.tabla}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{s.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
