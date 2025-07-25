import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

export default function Pagination({ page, totalPages, onPageChange }) {
  const pages = []

  // Siempre mostramos la 1
  pages.push(1)

  // Si estamos lejos de la 1, mostrar ellipsis
  if (page > 3) pages.push('start-ellipsis')

  // Mostrar la página anterior y siguiente al actual
  for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) {
    pages.push(p)
  }

  // Ellipsis antes de la última
  if (page < totalPages - 2) pages.push('end-ellipsis')

  // Siempre mostramos la última (si hay más de 1)
  if (totalPages > 1) pages.push(totalPages)

  const handleClick = (p) => {
    if (p === 'start-ellipsis' || p === 'end-ellipsis') return
    onPageChange(p)
  }

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <button
        onClick={() => page > 1 && onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded border disabled:opacity-50"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      {pages.map((p, i) =>
        p === 'start-ellipsis' || p === 'end-ellipsis' ? (
          <span key={i} className="px-3 py-1">…</span>
        ) : (
          <button
            key={p}
            onClick={() => handleClick(p)}
            className={`px-3 py-1 rounded border ${
              p === page
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => page < totalPages && onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded border disabled:opacity-50"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  )
}
