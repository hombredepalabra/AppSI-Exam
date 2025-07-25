import { ChartBarIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

export default function StatsPanel({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
      <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-300 truncate">Total Registros</dt>
                <dd className="text-3xl font-semibold">{stats.total}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-6 w-6 text-green-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-300 truncate">Registros Activos</dt>
                <dd className="text-3xl font-semibold">{stats.activos}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-6 w-6 text-red-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-300 truncate">Registros Inactivos</dt>
                <dd className="text-3xl font-semibold">{stats.inactivos}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
