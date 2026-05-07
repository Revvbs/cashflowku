'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'
import { Filter, X } from 'lucide-react'

interface Category {
  id: string
  name: string
  type: string
  icon: string | null
  color: string | null
}

interface Wallet {
  id: string
  name: string
  type: string
  icon: string | null
  color: string | null
}

interface TransactionFiltersProps {
  categories: Category[]
  wallets: Wallet[]
  currentType: string
  currentFrom: string
  currentTo: string
  currentCategory: string
  currentWallet: string
  defaultFrom: string
  defaultTo: string
}

export default function TransactionFilters({
  categories,
  wallets,
  currentType,
  currentFrom,
  currentTo,
  currentCategory,
  currentWallet,
  defaultFrom,
  defaultTo,
}: TransactionFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [expanded, setExpanded] = useState(false)

  const hasActiveFilters =
    currentType !== 'all' ||
    currentFrom !== defaultFrom ||
    currentTo !== defaultTo ||
    currentCategory !== '' ||
    currentWallet !== ''

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && key !== 'page') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      // Reset page when filters change
      if (key !== 'page') {
        params.delete('page')
      }
      router.push(`/transactions?${params.toString()}`)
    },
    [router, searchParams]
  )

  const clearFilters = useCallback(() => {
    router.push('/transactions')
  }, [router])

  const typeOptions = [
    { value: 'all', label: 'Semua' },
    { value: 'expense', label: 'Pengeluaran' },
    { value: 'income', label: 'Pemasukan' },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 mb-6">
      {/* Type Tabs + Filter Toggle */}
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5 flex-1">
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateFilter('type', opt.value === 'all' ? '' : opt.value)}
              className={`flex-1 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                currentType === opt.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
            expanded || hasActiveFilters
              ? 'bg-indigo-50 text-indigo-600'
              : 'bg-gray-100 text-gray-500 hover:text-gray-700'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          Filter
        </button>
      </div>

      {/* Expanded Filters */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Date From */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Dari Tanggal
              </label>
              <input
                type="date"
                value={currentFrom}
                onChange={(e) => updateFilter('from', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Sampai Tanggal
              </label>
              <input
                type="date"
                value={currentTo}
                onChange={(e) => updateFilter('to', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Kategori
              </label>
              <select
                value={currentCategory}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon ? `${cat.icon} ` : ''}{cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Wallet */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Dompet
              </label>
              <select
                value={currentWallet}
                onChange={(e) => updateFilter('wallet', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="">Semua Dompet</option>
                {wallets.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.icon ? `${w.icon} ` : ''}{w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Date Ranges */}
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              { label: 'Hari Ini', from: new Date().toISOString().split('T')[0], to: new Date().toISOString().split('T')[0] },
              { label: 'Bulan Ini', from: defaultFrom, to: defaultTo },
              { label: 'Bulan Lalu', from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) },
            ].map((range) => (
              <button
                key={range.label}
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString())
                  params.set('from', range.from)
                  params.set('to', range.to)
                  params.delete('page')
                  router.push(`/transactions?${params.toString()}`)
                }}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
              >
                {range.label}
              </button>
            ))}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-medium hover:bg-rose-100 transition-colors"
              >
                <X className="w-3 h-3" />
                Reset Filter
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Helper date functions (inline to avoid extra imports)
function startOfMonth(date: Date): string {
  const d = new Date(date.getFullYear(), date.getMonth(), 1)
  return d.toISOString().split('T')[0]
}

function endOfMonth(date: Date): string {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  return d.toISOString().split('T')[0]
}

function subMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() - months, date.getDate())
}
