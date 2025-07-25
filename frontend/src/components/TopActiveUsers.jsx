export default function TopActiveUsers({ users }) {
  if (!users.length) return null

  return (
    <div className="bg-gray-800 shadow rounded-lg p-6 mb-6">
      <h2 className="text-lg font-medium mb-4">Top 3 usuarios con más actividad</h2>
      <ul className="divide-y divide-gray-700">
        {users.map((u, idx) => (
          <li key={u.usuario_id} className="py-2 flex justify-between">
            <span className="font-medium">
              {idx + 1}. {u.User.nombre} ({u.User.email})
            </span>
            <span className="text-indigo-400 font-semibold">{u.acciones}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
