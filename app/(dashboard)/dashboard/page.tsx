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
  PiggyBank,
  ArrowUpCircle,
  ArrowDownCircle,
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

  const now = new Date()
  const monthStart = format(startOfMonth(now), 'yyyy-MM-dd')
  const monthEnd = format(endOfMonth(now), 'yyyy-MM-dd')

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
  const wallets = walletRes.data ?? []

  const totalPemasukan = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + (t.amount ?? 0), 0)

  const totalPengeluaran = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount ?? 0), 0)

  const totalSaldo = wallets.reduce((sum, w) => sum + (w.balance ?? 0), 0)
  const savingsRate = totalPemasukan > 0 ? Math.round(((totalPemasukan - totalPengeluaran) / totalPemasukan) * 100) : 0

  const recentTransactions = transactions.slice(0, 5)

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
      label: 'Total Saldo',
      value: formatCurrency(totalSaldo),
      icon: Wallet,
      gradient: 'gradient-emerald',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-600',
      change: null,
    },
    {
      label: 'Pemasukan',
      value: formatCurrency(totalPemasukan),
      icon: ArrowUpCircle,
      gradient: 'gradient-blue',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-600',
      change: null,
    },
    {
      label: 'Pengeluaran',
      value: formatCurrency(totalPengeluaran),
      icon: ArrowDownCircle,
      gradient: 'gradient-rose',
      iconBg: 'bg-rose-500/20',
      iconColor: 'text-rose-600',
      change: null,
    },
    {
      label: 'Rasio Tabungan',
      value: `${savingsRate}%`,
      icon: PiggyBank,
      gradient: 'gradient-purple',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-600',
      change: savingsRate >= 20 ? 'Baik' : 'Perlu ditingkatkan',
    },
  ]

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Ringkasan keuangan bulan {format(now, 'MMMM yyyy', { locale: localeID })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-8">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`${stat.gradient} rounded-2xl p-5 text-white card-hover animate-fade-in-up`}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/70 text-xs font-medium">{stat.label}</p>
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
            {stat.change && (
              <p className="text-white/60 text-xs mt-1">{stat.change}</p>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          href="/transaksi?action=tambah"
          className="inline-flex items-center gap-2 px-5 py-2.5 gradient-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-indigo-200"
        >
          <Plus className="w-4 h-4" />
          Tambah Transaksi
        </Link>
        <Link
          href="/reports"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          <FileBarChart className="w-4 h-4" />
          Lihat Laporan
        </Link>
      </div>

      {hasTransactions ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Transaksi Terakhir</h2>
              <Link
                href="/transaksi"
                className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
              >
                Lihat Semua
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentTransactions.map((t) => {
                const catName = (t as any).categories?.name ?? 'Lainnya'
                const catColor = (t as any).categories?.color ?? '#6b7280'
                const walletName = (t as any).wallets?.name ?? '-'
                const isIncome = t.type === 'income'
                return (
                  <div key={t.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${catColor}15` }}
                    >
                      {isIncome ? (
                        <ArrowUpCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <ArrowDownCircle className="w-5 h-5 text-rose-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {t.description ?? catName}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: catColor }}
                        />
                        <p className="text-xs text-gray-400">
                          {catName} · {walletName} ·{' '}
                          {t.date ? format(new Date(t.date), 'dd MMM', { locale: localeID }) : ''}
                        </p>
                      </div>
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
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Pengeluaran per Kategori</h2>
            </div>
            <div className="p-5">
              {pieData.length > 0 ? (
                <DashboardChart data={pieData} />
              ) : (
                <p className="text-sm text-gray-400 text-center py-12">
                  Belum ada pengeluaran bulan ini.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 md:p-16 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-5 shadow-lg shadow-indigo-200">
            <Receipt className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Belum Ada Transaksi
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-8">
            Mulai catat pemasukan dan pengeluaranmu untuk melacak keuangan dengan lebih baik.
          </p>
          <Link
            href="/transaksi?action=tambah"
            className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-indigo-200"
          >
            <Plus className="w-4 h-4" />
            Tambah Transaksi Pertama
          </Link>
        </div>
      )}
    </div>
  )
}
