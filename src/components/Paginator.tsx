interface PaginatorProps {
  currentPage: number   // 0-based
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Paginator({ currentPage, totalPages, onPageChange }: PaginatorProps) {
  if (totalPages <= 1) return null

  // Build the list of page indices (0-based) + ellipsis markers to render
  const items: (number | '...')[] = []

  if (totalPages <= 7) {
    for (let i = 0; i < totalPages; i++) items.push(i)
  } else {
    // Always show first page
    items.push(0)

    const windowStart = Math.max(1, currentPage - 1)
    const windowEnd = Math.min(totalPages - 2, currentPage + 1)

    if (windowStart > 1) items.push('...')
    for (let i = windowStart; i <= windowEnd; i++) items.push(i)
    if (windowEnd < totalPages - 2) items.push('...')

    // Always show last page
    items.push(totalPages - 1)
  }

  const btnBase = 'min-w-[2rem] h-8 px-2 text-sm rounded-lg border transition-colors'
  const btnActive = 'bg-slate-800 text-white border-slate-800'
  const btnIdle = 'border-slate-200 text-slate-600 hover:bg-slate-50'
  const btnDisabled = 'border-slate-100 text-slate-300 cursor-not-allowed'

  return (
    <div className="flex items-center justify-center gap-1.5">
      <button
        aria-label="Previous"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={`${btnBase} ${currentPage === 0 ? btnDisabled : btnIdle}`}
      >
        ←
      </button>

      {items.map((item, idx) =>
        item === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-1 text-slate-400 text-sm select-none">…</span>
        ) : (
          <button
            key={item}
            aria-current={item === currentPage ? 'page' : undefined}
            onClick={() => onPageChange(item)}
            className={`${btnBase} ${item === currentPage ? btnActive : btnIdle}`}
          >
            {item + 1}
          </button>
        )
      )}

      <button
        aria-label="Next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className={`${btnBase} ${currentPage >= totalPages - 1 ? btnDisabled : btnIdle}`}
      >
        →
      </button>
    </div>
  )
}
