'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CalendarDays, ChevronDown } from 'lucide-react'

const ranges = [
  { value: 'this_month', label: 'Bulan Ini' },
  { value: 'last_month', label: 'Bulan Lalu' },
  { value: 'this_year', label: 'Tahun Ini' },
  { value: 'custom', label: 'Custom' },
]

interface Props {
  currentRange: string
  from?: string
  to?: string
}

export default function DateRangeSelector({ currentRange, from, to }: Props) {
  const [open, setOpen] = useState(false)
  const [showCustom, setShowCustom] = useState(currentRange === 'custom')
  const [customFrom, setCustomFrom] = useState(from || '')
  const [customTo, setCustomTo] = useState(to || '')
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function applyRange(value: string, extra?: { from?: string; to?: string }) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('range', value)
    if (extra?.from) params.set('from', extra.from)
    else params.delete('from')
    if (extra?.to) params.set('to', extra.to)
    else params.delete('to')
    router.push(`/reports?${params.toString()}`)
    setOpen(false)
  }

  const currentLabel = ranges.find((r) => r.value === currentRange)?.label || 'Bulan Ini'

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <CalendarDays className="w-4 h-4 text-gray-500" />
        {currentLabel}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="py-1">
            {ranges.map((r) => (
              <button
                key={r.value}
                onClick={() => {
                  if (r.value === 'custom') {
                    setShowCustom(true)
                  } else {
                    setShowCustom(false)
                    applyRange(r.value)
                  }
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  currentRange === r.value
                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {showCustom && (
            <div className="border-t border-gray-100 p-3 space-y-2">
              <label className="block text-xs font-medium text-gray-600">Dari</label>
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <label className="block text-xs font-medium text-gray-600 mt-2">Sampai</label>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => {
                  if (customFrom && customTo) {
                    applyRange('custom', { from: customFrom, to: customTo })
                  }
                }}
                disabled={!customFrom || !customTo}
                className="w-full mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Terapkan
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Export CSV Button ─── */
interface ExportRow {
  tanggal: string
  deskripsi: string
  kategori: string
  dompet: string
  tipe: string
  jumlah: number
}

export function ExportCSVButton({ data }: { data: ExportRow[] }) {
  function handleExport() {
    if (!data.length) return

    const headers = ['Tanggal', 'Deskripsi', 'Kategori', 'Dompet', 'Tipe', 'Jumlah']
    const csvRows = [
      headers.join(','),
      ...data.map((row) =>
        [
          row.tanggal,
          `"${row.deskripsi.replace(/"/g, '""')}"`,
          `"${row.kategori}"`,
          `"${row.dompet}"`,
          row.tipe,
          row.jumlah,
        ].join(',')
      ),
    ]

    const csvContent = csvRows.join('\n')
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `laporan-cashflowku-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      disabled={data.length === 0}
      className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      Export CSV
    </button>
  )
}
