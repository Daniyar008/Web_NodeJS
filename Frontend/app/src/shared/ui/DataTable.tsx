import { useMemo, useState } from 'react'
import { IconDots, IconSearch } from './icons'

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
export type Column<T> = {
  key: keyof T | string
  label: string
  align?: 'left' | 'right' | 'center'
  render?: (row: T) => React.ReactNode
}

type Props<T extends Record<string, unknown>> = {
  title: string
  data: T[]
  columns: Column<T>[]
  searchKeys?: (keyof T)[]
  onAdd?: () => void
  addLabel?: string
  rowKey: keyof T
  actions?: (row: T) => React.ReactNode
}

const PAGE_SIZES = [10, 25, 50]

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────
export function DataTable<T extends Record<string, unknown>>({
  title,
  data,
  columns,
  searchKeys,
  onAdd,
  addLabel = 'Add New',
  rowKey,
  actions,
}: Props<T>) {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase()
    if (!qq || !searchKeys?.length) return data
    return data.filter((row) =>
      searchKeys.some((k) => String(row[k] ?? '').toLowerCase().includes(qq)),
    )
  }, [q, data, searchKeys])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)

  const visible = useMemo(
    () => filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filtered, safePage, pageSize],
  )

  const pageNumbers = useMemo(() => {
    const pages: (number | '...')[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (safePage > 3) pages.push('...')
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++)
        pages.push(i)
      if (safePage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }, [totalPages, safePage])

  return (
    <div className="bg-white border border-slate-100 rounded-[32px] shadow-sm overflow-hidden">
      {/* Table header bar */}
      <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold text-slate-900">{title}</span>
          <span className="text-xs text-slate-400 font-medium">
            Rows per page:{' '}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setPage(1)
              }}
              className="border border-slate-200 rounded-lg px-1.5 py-0.5 text-xs outline-none focus:ring-2 focus:ring-primary/20 ml-1"
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>{' '}
            Total
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onAdd && (
            <button
              onClick={onAdd}
              className="h-10 px-4 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 transition flex items-center gap-1.5 shadow-sm"
            >
              <span className="text-base leading-none">+</span>
              {addLabel}
            </button>
          )}
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value)
                setPage(1)
              }}
              placeholder="Search"
              className="h-10 w-[220px] rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full w-full text-sm">
          <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest">
            <tr className="border-b border-slate-100">
              <th className="py-4 px-6 text-left">
                <input type="checkbox" className="accent-primary rounded" />
              </th>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`py-4 px-4 font-bold ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                >
                  {col.label}
                </th>
              ))}
              {actions && (
                <th className="py-4 px-6 text-right font-bold">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr
                key={String(row[rowKey])}
                className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
              >
                <td className="py-3 px-6">
                  <input type="checkbox" className="accent-primary" />
                </td>
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={`py-3 px-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}
                  >
                    {col.render
                      ? col.render(row)
                      : String(row[col.key as keyof T] ?? '')}
                  </td>
                ))}
                {actions && (
                  <td className="py-3 px-6 text-right">
                    {actions(row) ?? (
                      <button
                        className="h-8 w-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 inline-grid place-items-center text-slate-500 transition shadow-sm"
                        aria-label="Action"
                      >
                        <IconDots />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 2 : 1)}
                  className="py-16 text-center text-slate-400 text-sm font-medium"
                >
                  No data to display
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 bg-slate-50/30">
        <span className="font-medium">
          Showing {visible.length} of {filtered.length}
        </span>
        <div className="flex items-center gap-1">
          <button
            disabled={safePage === 1}
            onClick={() => setPage((p) => p - 1)}
            className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-bold"
          >
            Prev
          </button>
          {pageNumbers.map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className="px-1 text-slate-300">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p as number)}
                className={`h-8 w-8 rounded-lg text-xs font-bold transition shadow-sm ${
                  p === safePage
                    ? 'bg-primary text-white'
                    : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                {p}
              </button>
            ),
          )}
          <button
            disabled={safePage === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-bold"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
