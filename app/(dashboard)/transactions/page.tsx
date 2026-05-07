
export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns'
import { id as localeID } from 'date-fns/locale/id'
import {
  Plus,
  Receipt,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import TransactionFilters from './transaction-filters'
import AddTransactionButton from './add-transaction-button'

const PAGE_SIZE = 20

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

interface PageProps {
  searchParams: Promise<{
    type?: string
    from?: string
    to?: string
    category?: string
    wallet?: string
    page?: string
    action?: string
  }>
}

export default async function TransactionsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Default date range: this month
  const now = new Date()
  const defaultFrom = format(startOfMonth(now), 'yyyy-MM-dd')
  const defaultTo = format(endOfMonth(now), 'yyyy-MM-dd')

  const filterType = params.type || 'all'
  const filterFrom = params.from || defaultFrom
  const filterTo = params.to || defaultTo
  const filterCategory = params.category || ''
  const filterWallet = params.wallet || ''
  const currentPage = parseInt(params.page || '1', 10)
  const showForm = params.action === 'tambah'

  // Fetch categories and wallets for filters
  const [categoryRes, walletRes] = await Promise.all([
    supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('name'),
    supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .order('name'),
  ])

  const categories = categoryRes.data ?? []
  const wallets = walletRes.data ?? []

  // Build query
  let query = supabase
    .from('transactions')
    .select('*, categories(name, color, icon), wallets(name, color, icon)', { count: 'exact' })
    .eq('user_id', user.id)
    .gte('date', filterFrom)
    .lte('date', filterTo)

  if (filterType === 'income') {
    query = query.eq('type', 'income')
  } else if (filterType === 'expense') {
    query = query.eq('type', 'expense')
  }

  if (filterCategory) {
    query = query.eq('category_id', filterCategory)
  }

  if (filterWallet) {
    query = query.eq('wallet_id', filterWallet)
  }

  // Pagination
  const offset = (currentPage - 1) * PAGE_SIZE
  query = query
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  const { data: transactions, count } = await query
  const totalCount = count ?? 0
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  // Summary stats for current filter
  const filteredTotalIncome = transactions
    ?.filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + (t.amount ?? 0), 0) ?? 0

  const filteredTotalExpense = transactions
    ?.filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount ?? 0), 0) ?? 0

  // Group transactions by date
  const groupedByDate: Record<string, typeof transactions> = {}
  transactions?.forEach((t) => {
    const dateKey = t.date || 'unknown'
    if (!groupedByDate[dateKey]) groupedByDate[dateKey] = []
    groupedByDate[dateKey].push(t)
  })

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a))

  // Build pagination URLs
  function buildPageUrl(page: number) {
    const p = new URLSearchParams()
    if (filterType !== 'all') p.set('type', filterType)
    if (filterFrom !== defaultFrom) p.set('from', filterFrom)
    if (filterTo !== defaultTo) p.set('to', filterTo)
    if (filterCategory) p.set('category', filterCategory)
    if (filterWallet) p.set('wallet', filterWallet)
    p.set('page', String(page))
    return `/transactions?${p.toString()}`
  }

  const hasFilters =
    filterType !== 'all' ||
    filterFrom !== defaultFrom ||
    filterTo !== defaultTo ||
    filterCategory !== '' ||
    filterWallet !== ''

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaksi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola pemasukan dan pengeluaranmu
          </p>
        </div>
        <AddTransactionButton
          categories={categories}
          wallets={wallets}
          initialDate={filterFrom}
          showForm={showForm}
        />
      </div>

      {/* Filters */}
      <TransactionFilters
        categories={categories}
        wallets={wallets}
        currentType={filterType}
        currentFrom={filterFrom}
        currentTo={filterTo}
        currentCategory={filterCategory}
        currentWallet={filterWallet}
        defaultFrom={defaultFrom}
        defaultTo={defaultTo}
      />

      {/* Summary Bar */}
      {(filteredTotalIncome > 0 || filteredTotalExpense > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
            <p className="text-xs text-gray-500">Pemasukan</p>
            <p className="text-base font-bold text-emerald-600 mt-0.5">
              +{formatCurrency(filteredTotalIncome)}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
            <p className="text-xs text-gray-500">Pengeluaran</p>
            <p className="text-base font-bold text-rose-600 mt-0.5">
              -{formatCurrency(filteredTotalExpense)}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 col-span-2 sm:col-span-1">
            <p className="text-xs text-gray-500">Total Transaksi</p>
            <p className="text-base font-bold text-gray-900 mt-0.5">{totalCount}</p>
          </div>
        </div>
      )}

      {/* Transaction List */}
      {transactions && transactions.length > 0 ? (
        <>
          {/* Mobile View: Cards */}
          <div className="md:hidden space-y-4">
            {sortedDates.map((dateKey) => {
              const dateTransactions = groupedByDate[dateKey]
              const dateObj = parseISO(dateKey)
              const dayLabel = format(dateObj, 'EEEE, dd MMMM yyyy', { locale: localeID })

              return (
                <div key={dateKey}>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
                    {dayLabel}
                  </h3>
                  <div className="space-y-2">
                    {(dateTransactions || []).map((t) => {
                      const isIncome = t.type === 'income'
                      const catName = (t as any).categories?.name ?? 'Lainnya'
                      const catColor = (t as any).categories?.color ?? '#6b7280'
                      const catIcon = (t as any).categories?.icon
                      const walletName = (t as any).wallets?.name ?? '-'

                      return (
                        <div
                          key={t.id}
                          className="bg-white rounded-xl border border-gray-200 px-4 py-3.5 flex items-center gap-3"
                        >
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-base shrink-0 ${
                              isIncome ? 'bg-emerald-50' : 'bg-rose-50'
                            }`}
                          >
                            {catIcon || (isIncome ? '↑' : '↓')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {t.description || catName}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span
                                className="inline-block w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: catColor }}
                              />
                              <span className="text-xs text-gray-500 truncate">
                                {catName}
                              </span>
                              <span className="text-xs text-gray-300">·</span>
                              <span className="text-xs text-gray-500 truncate">
                                {walletName}
                              </span>
                            </div>
                          </div>
                          <p
                            className={`text-sm font-semibold whitespace-nowrap shrink-0 ${
                              isIncome ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {isIncome ? '+' : '-'}{formatCurrency(t.amount ?? 0)}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Tanggal
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Deskripsi
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Kategori
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Dompet
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Jumlah
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((t) => {
                    const isIncome = t.type === 'income'
                    const catName = (t as any).categories?.name ?? 'Lainnya'
                    const catColor = (t as any).categories?.color ?? '#6b7280'
                    const catIcon = (t as any).categories?.icon
                    const walletName = (t as any).wallets?.name ?? '-'

                    return (
                      <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">
                          {t.date
                            ? format(parseISO(t.date), 'dd MMM yyyy', { locale: localeID })
                            : '-'}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                                isIncome ? 'bg-emerald-50' : 'bg-rose-50'
                              }`}
                            >
                              {catIcon || (isIncome ? '↑' : '↓')}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate max-w-[240px]">
                                {t.description || catName}
                              </p>
                              {t.notes && (
                                <p className="text-xs text-gray-400 truncate max-w-[240px]">
                                  {t.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${catColor}15`,
                              color: catColor,
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: catColor }}
                            />
                            {catName}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">
                          {walletName}
                        </td>
                        <td
                          className={`px-5 py-3.5 text-sm font-semibold text-right whitespace-nowrap ${
                            isIncome ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {isIncome ? '+' : '-'}{formatCurrency(t.amount ?? 0)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-500">
                Halaman {currentPage} dari {totalPages} ({totalCount} transaksi)
              </p>
              <div className="flex items-center gap-2">
                {currentPage > 1 ? (
                  <a
                    href={buildPageUrl(currentPage - 1)}
                    className="inline-flex items-center gap-1 px-3.5 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Sebelumnya</span>
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3.5 py-2 border border-gray-100 rounded-lg text-sm font-medium text-gray-300 cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Sebelumnya</span>
                  </span>
                )}
                {currentPage < totalPages ? (
                  <a
                    href={buildPageUrl(currentPage + 1)}
                    className="inline-flex items-center gap-1 px-3.5 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className="hidden sm:inline">Selanjutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3.5 py-2 border border-gray-100 rounded-lg text-sm font-medium text-gray-300 cursor-not-allowed">
                    <span className="hidden sm:inline">Selanjutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
            <Receipt className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {hasFilters ? 'Tidak Ada Transaksi Ditemukan' : 'Belum Ada Transaksi'}
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
            {hasFilters
              ? 'Coba ubah filter untuk melihat transaksi lainnya.'
              : 'Mulai catat pemasukan dan pengeluaranmu untuk melacak keuangan dengan lebih baik.'}
          </p>
          {!hasFilters && (
            <a
              href="/transactions?action=tambah"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Transaksi Pertama
            </a>
          )}
        </div>
      )}
    </div>
  )
}
