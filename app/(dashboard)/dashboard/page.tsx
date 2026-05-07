export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { id as localeID } from 'date-fns/locale/id'
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  Plus,
  FileBarChart,
  ArrowRight,
} from 'lucide-react'
import DashboardChart from './chart'

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6',
  '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#14b8a6',
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Date range for this month
  const now = new Date()
  const monthStart = format(startOfMonth(now), 'yyyy-MM-dd')
  const monthEnd = format(endOfMonth(now), 'yyyy-MM-dd')

  // Fetch all data in parallel
  const [transactionsRes, categoryRes, walletRes] = await Promise.all([
    supabase
      .from('transactions')
      .select('*, categories(name, color, icon), wallets(name)')
      .eq('user_id', user.id)
      .gte('date', monthStart)
      .lte('date', monthEnd)
      .order('date', { ascending: false }),
    supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id),
    supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id),
  ])

  const transactions = transactionsRes.data ?? []
  const categories = categoryRes.data ?? []
  const wallets = walletRes.data ?? []

  // Calculate stats
  const totalPemasukan = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + (t.amount ?? 0), 0)

  const totalPengeluaran = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount ?? 0), 0)

  const totalSaldo = wallets.reduce((sum, w) => sum + (w.balance ?? 0), 0)
  const transaksiCount = transactions.length

  // Recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5)

  // Expense by category for pie chart
  const expenseByCategory: Record<string, number> = {}
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const catName = (t as any).categories?.name ?? 'Lainnya'
      expenseByCategory[catName] = (expenseByCategory[catName] ?? 0) + (t.amount ?? 0)
    })

  const pieData = Object.entries(expenseByCategory).map(([name, value], i) => ({
    name,
    value,
    fill: COLORS[i % COLORS.length],
  }))

  const hasTransactions = transactions.length > 0

  const stats = [
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
      label: 'Saldo',
      value: formatCurrency(totalSaldo),
      icon: Wallet,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      label: 'Transaksi Bulan Ini',
      value: transaksiCount.toString(),
      icon: Receipt,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ]

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Ringkasan keuangan bulan {format(now, 'MMMM yyyy', { locale: localeID })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4"
          >
            <div className={`${stat.bg} p-3 rounded-lg`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          href="/transaksi?action=tambah"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Transaksi
        </Link>
        <Link
          href="/laporan"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          <FileBarChart className="w-4 h-4" />
          Lihat Laporan
        </Link>
      </div>

      {hasTransactions ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Transaksi Terakhir</h2>
              <Link
                href="/transaksi"
                className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium hover:text-indigo-700"
              >
                Lihat Semua
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {recentTransactions.map((t) => {
                const catName = (t as any).categories?.name ?? 'Lainnya'
                const walletName = (t as any).wallets?.name ?? '-'
                const isIncome = t.type === 'income'
                return (
                  <div key={t.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                        isIncome ? 'bg-emerald-50' : 'bg-rose-50'
                      }`}
                    >
                      {isIncome ? '↑' : '↓'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {t.description ?? catName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {catName} · {walletName} ·{' '}
                        {t.date ? format(new Date(t.date), 'dd MMM yyyy', { locale: localeID }) : ''}
                      </p>
                    </div>
                    <p
                      className={`text-sm font-semibold whitespace-nowrap ${
                        isIncome ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isIncome ? '+' : '-'} {formatCurrency(t.amount ?? 0)}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Pengeluaran per Kategori</h2>
            </div>
            <div className="p-5">
              {pieData.length > 0 ? (
                <DashboardChart data={pieData} />
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  Belum ada pengeluaran bulan ini.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
            <Receipt className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Belum Ada Transaksi
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
            Mulai catat pemasukan dan pengeluaranmu untuk melacak keuangan dengan lebih baik.
          </p>
          <Link
            href="/transaksi?action=tambah"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Transaksi Pertama
          </Link>
        </div>
      )}
    </div>
  )
}
