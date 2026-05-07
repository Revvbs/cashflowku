export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
  eachDayOfInterval,
  eachMonthOfInterval,
  parseISO,
} from 'date-fns'
import { id as localeID } from 'date-fns/locale/id'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  FileBarChart,
} from 'lucide-react'
import {
  ExpensePieChart,
  MonthlyBarChart,
  DailyTrendChart,
  TopCategoriesTable,
} from './charts'
import DateRangeSelector, { ExportCSVButton } from './date-range-selector'

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const CATEGORY_COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6',
  '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#14b8a6',
]

interface SearchParams {
  range?: string
  from?: string
  to?: string
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check user plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  const isPro = profile?.plan === 'pro'

  // Determine date range
  const now = new Date()
  const range = params.range || 'this_month'
  let dateFrom: Date
  let dateTo: Date

  switch (range) {
    case 'last_month': {
      const lastMonth = subMonths(now, 1)
      dateFrom = startOfMonth(lastMonth)
      dateTo = endOfMonth(lastMonth)
      break
    }
    case 'this_year':
      dateFrom = startOfYear(now)
      dateTo = endOfYear(now)
      break
    case 'custom':
      dateFrom = params.from ? parseISO(params.from) : startOfMonth(now)
      dateTo = params.to ? parseISO(params.to) : endOfMonth(now)
      break
    case 'this_month':
    default:
      dateFrom = startOfMonth(now)
      dateTo = endOfMonth(now)
      break
  }

  const fromStr = format(dateFrom, 'yyyy-MM-dd')
  const toStr = format(dateTo, 'yyyy-MM-dd')

  // Fetch transactions in range
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, categories(name, color, icon), wallets(name)')
    .eq('user_id', user.id)
    .gte('date', fromStr)
    .lte('date', toStr)
    .order('date', { ascending: true })

  const allTransactions = transactions ?? []

  // Also fetch last 6 months data for bar chart
  const sixMonthsAgo = subMonths(startOfMonth(now), 5)
  const { data: sixMonthTransactions } = await supabase
    .from('transactions')
    .select('type, amount, date')
    .eq('user_id', user.id)
    .gte('date', format(sixMonthsAgo, 'yyyy-MM-dd'))
    .lte('date', format(endOfMonth(now), 'yyyy-MM-dd'))

  const sixMonthData = sixMonthTransactions ?? []

  // ─── Summary Calculations ───
  const totalPemasukan = allTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + (t.amount ?? 0), 0)

  const totalPengeluaran = allTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount ?? 0), 0)

  const selisih = totalPemasukan - totalPengeluaran

  // ─── Pie Chart: Pengeluaran per Kategori ───
  const expenseByCategory: Record<string, number> = {}
  allTransactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const catName = (t as any).categories?.name ?? 'Lainnya'
      expenseByCategory[catName] = (expenseByCategory[catName] ?? 0) + (t.amount ?? 0)
    })

  const pieData = Object.entries(expenseByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  // ─── Bar Chart: Monthly Income vs Expense (6 months) ───
  const monthlyMap: Record<string, { pemasukan: number; pengeluaran: number }> = {}
  const monthsRange = eachMonthOfInterval({ start: sixMonthsAgo, end: endOfMonth(now) })
  monthsRange.forEach((m) => {
    const key = format(m, 'MMM yyyy', { locale: localeID })
    monthlyMap[key] = { pemasukan: 0, pengeluaran: 0 }
  })

  sixMonthData.forEach((t) => {
    if (!t.date) return
    const key = format(new Date(t.date), 'MMM yyyy', { locale: localeID })
    if (!monthlyMap[key]) {
      monthlyMap[key] = { pemasukan: 0, pengeluaran: 0 }
    }
    if (t.type === 'income') {
      monthlyMap[key].pemasukan += t.amount ?? 0
    } else {
      monthlyMap[key].pengeluaran += t.amount ?? 0
    }
  })

  const barData = Object.entries(monthlyMap).map(([month, vals]) => ({
    month,
    ...vals,
  }))

  // ─── Line Chart: Daily Expense Trend ───
  // Always compute daily trend for the current month (Pro feature)
  // But also support daily breakdown for the selected range if it's <= 31 days
  const trendDays = eachDayOfInterval({ start: dateFrom, end: dateTo })

  const dailyExpenseMap: Record<string, number> = {}
  trendDays.forEach((d) => {
    dailyExpenseMap[format(d, 'yyyy-MM-dd')] = 0
  })

  allTransactions
    .filter((t) => t.type === 'expense' && t.date)
    .forEach((t) => {
      const dayKey = format(new Date(t.date), 'yyyy-MM-dd')
      if (dailyExpenseMap[dayKey] !== undefined) {
        dailyExpenseMap[dayKey] += t.amount ?? 0
      }
    })

  const trendData = Object.entries(dailyExpenseMap).map(([date, amount]) => ({
    day: format(parseISO(date), 'dd', { locale: localeID }),
    amount,
  }))

  // ─── Top 5 Kategori Pengeluaran ───
  const totalExpenseForPercentage = totalPengeluaran || 1
  const topCategories = pieData.slice(0, 5).map((item, i) => ({
    name: item.name,
    total: item.value,
    percentage: (item.value / totalExpenseForPercentage) * 100,
    color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  }))

  // ─── Export data (passed to client) ───
  const exportData = allTransactions.map((t) => ({
    tanggal: t.date ?? '',
    deskripsi: t.description ?? '',
    kategori: (t as any).categories?.name ?? 'Lainnya',
    dompet: (t as any).wallets?.name ?? '-',
    tipe: t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
    jumlah: t.amount ?? 0,
  }))

  const rangeLabel = {
    this_month: 'Bulan Ini',
    last_month: 'Bulan Lalu',
    this_year: 'Tahun Ini',
    custom: `${format(dateFrom, 'dd MMM yyyy', { locale: localeID })} – ${format(dateTo, 'dd MMM yyyy', { locale: localeID })}`,
  }[range]

  const summaryCards = [
    {
      label: 'Total Pemasukan',
      value: formatCurrency(totalPemasukan),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Total Pengeluaran',
      value: formatCurrency(totalPengeluaran),
      icon: TrendingDown,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
    {
      label: 'Selisih',
      value: formatCurrency(selisih),
      icon: selisih >= 0 ? TrendingUp : Minus,
      color: selisih >= 0 ? 'text-indigo-600' : 'text-rose-600',
      bg: selisih >= 0 ? 'bg-indigo-50' : 'bg-rose-50',
    },
  ]

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileBarChart className="w-6 h-6 text-indigo-600" />
            Laporan Keuangan
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Analisis keuangan {(rangeLabel || "").toLowerCase()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DateRangeSelector currentRange={range} from={params.from} to={params.to} />
          <ExportCSVButton data={exportData} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4"
          >
            <div className={`${card.bg} p-3 rounded-lg`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Pengeluaran per Kategori</h2>
          </div>
          <div className="p-5">
            <ExpensePieChart data={pieData} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Pemasukan vs Pengeluaran</h2>
            <p className="text-xs text-gray-500 mt-0.5">6 bulan terakhir</p>
          </div>
          <div className="p-5">
            <MonthlyBarChart data={barData} />
          </div>
        </div>

        {/* Line Chart — Pro Feature */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              Trend Pengeluaran Harian
              {!isPro && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  Pro
                </span>
              )}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {format(now, 'MMMM yyyy', { locale: localeID })}
            </p>
          </div>
          <div className="p-5">
            <DailyTrendChart data={trendData} isPro={isPro} />
          </div>
        </div>

        {/* Top 5 Kategori */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Top 5 Kategori Pengeluaran</h2>
          </div>
          <div className="p-5">
            <TopCategoriesTable data={topCategories} />
          </div>
        </div>
      </div>
    </div>
  )
}
