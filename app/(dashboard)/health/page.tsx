'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Heart,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  BarChart3,
  Target,
  Lightbulb,
  ArrowRight,
  RefreshCw,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

// ── Types ──────────────────────────────────────────────────────────────────────
interface HealthBreakdown {
  savings_rate: number
  budget_adherence: number
  spending_trend: number
  expense_distribution: number
}

interface HealthScoreRow {
  id: string
  user_id: string
  score: number
  breakdown: HealthBreakdown
  month: string
  created_at: string
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function getScoreLabel(score: number): { label: string; color: string; bg: string } {
  if (score >= 80) return { label: 'Sangat Baik', color: '#10b981', bg: '#ecfdf5' }
  if (score >= 60) return { label: 'Baik', color: '#3b82f6', bg: '#eff6ff' }
  if (score >= 40) return { label: 'Cukup', color: '#f59e0b', bg: '#fffbeb' }
  return { label: 'Perlu Perbaikan', color: '#f43f5e', bg: '#fff1f2' }
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981'
  if (score >= 60) return '#3b82f6'
  if (score >= 40) return '#f59e0b'
  return '#f43f5e'
}

const FACTOR_LABELS: Record<string, string> = {
  savings_rate: 'Rasio Tabungan',
  budget_adherence: 'Kepatuhan Budget',
  spending_trend: 'Tren Pengeluaran',
  expense_distribution: 'Distribusi Pengeluaran',
}

const FACTOR_DESCRIPTIONS: Record<string, string> = {
  savings_rate: 'Persentase pendapatan yang berhasil ditabung',
  budget_adherence: 'Seberapa baik kamu patuh pada budget yang ditetapkan',
  spending_trend: 'Perbandingan pengeluaran bulan ini vs bulan lalu',
  expense_distribution: 'Keragaman pengeluaran di berbagai kategori',
}

const TIPS: Record<string, string[]> = {
  savings_rate: [
    'Tetapkan minimal 20% dari pendapatan untuk ditabung.',
    'Bayar tabungan di awal bulan sebelum pengeluaran lainnya.',
    'Kurangi pengeluaran non-esensial untuk meningkatkan rasio tabungan.',
  ],
  budget_adherence: [
    'Atur budget per kategori dan pantau secara rutin.',
    'Gunakan aturan 50/30/20: 50% kebutuhan, 30% keinginan, 20% tabungan.',
    'Evaluasi dan sesuaikan budget setiap bulan.',
  ],
  spending_trend: [
    'Bandingkan pengeluaranmu setiap bulan untuk menemukan pola.',
    'Hindari pengeluaran impulsif dengan aturan 24 jam.',
    'Catat setiap transaksi, sekecil apapun.',
  ],
  expense_distribution: [
    'Diversifikasi pengeluaran agar tidak terlalu terfokus di satu kategori.',
    'Jika satu kategori > 50%, cari cara untuk menguranginya.',
    'Alokasikan dana ke kategori tabungan dan investasi.',
  ],
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function HealthPage() {
  const [score, setScore] = useState<HealthScoreRow | null>(null)
  const [history, setHistory] = useState<HealthScoreRow[]>([])
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)

  const supabase = createClient()

  const calculateAndFetch = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0]
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0]

    // Fetch all needed data in parallel
    const [thisMonthTx, lastMonthTx, budgetsRes, categoriesRes, historyRes] = await Promise.all([
      supabase
        .from('transactions')
        .select('category_id, amount, type')
        .eq('user_id', user.id)
        .gte('date', monthStart)
        .lte('date', monthEnd),
      supabase
        .from('transactions')
        .select('amount, type')
        .eq('user_id', user.id)
        .gte('date', lastMonthStart)
        .lte('date', lastMonthEnd),
      supabase
        .from('budgets')
        .select('category_id, amount')
        .eq('user_id', user.id),
      supabase
        .from('categories')
        .select('id')
        .eq('user_id', user.id)
        .eq('type', 'expense'),
      supabase
        .from('health_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('month', { ascending: true })
        .limit(12),
    ])

    const thisMonth = thisMonthTx.data ?? []
    const lastMonth = lastMonthTx.data ?? []
    const budgets = budgetsRes.data ?? []

    // Calculate income and expenses
    const income = thisMonth.filter((t) => t.type === 'income').reduce((s, t) => s + (t.amount ?? 0), 0)
    const expenses = thisMonth.filter((t) => t.type === 'expense').reduce((s, t) => s + (t.amount ?? 0), 0)
    const lastMonthExpenses = lastMonth.filter((t) => t.type === 'expense').reduce((s, t) => s + (t.amount ?? 0), 0)

    // 1. Savings Rate (30%): (income - expenses) / income * 100
    let savingsRate = 0
    if (income > 0) {
      savingsRate = Math.max(0, Math.min(100, ((income - expenses) / income) * 100))
    } else if (expenses === 0) {
      savingsRate = 100 // No income and no expenses = neutral
    }

    // 2. Budget Adherence (25%): % of categories within budget
    let budgetAdherence = 100
    if (budgets.length > 0) {
      const spentByCategory: Record<string, number> = {}
      thisMonth.filter((t) => t.type === 'expense' && t.category_id).forEach((t) => {
        spentByCategory[t.category_id!] = (spentByCategory[t.category_id!] ?? 0) + (t.amount ?? 0)
      })
      let withinBudget = 0
      budgets.forEach((b) => {
        if (b.category_id) {
          const spent = spentByCategory[b.category_id] ?? 0
          if (spent <= b.amount) withinBudget++
        }
      })
      budgetAdherence = (withinBudget / budgets.length) * 100
    }

    // 3. Spending Trend (25%): compare this month vs last month
    let spendingTrend = 50
    if (lastMonthExpenses > 0) {
      const change = (expenses - lastMonthExpenses) / lastMonthExpenses
      if (change <= 0) {
        // Decreased spending = good
        spendingTrend = Math.min(100, 70 + Math.abs(change) * 30)
      } else {
        // Increased spending = worse
        spendingTrend = Math.max(0, 70 - change * 50)
      }
    } else if (expenses === 0) {
      spendingTrend = 100
    } else {
      spendingTrend = 50
    }

    // 4. Expense Distribution (20%): no single category > 50% of total
    let expenseDistribution = 100
    if (expenses > 0) {
      const spentByCategory: Record<string, number> = {}
      thisMonth.filter((t) => t.type === 'expense' && t.category_id).forEach((t) => {
        spentByCategory[t.category_id!] = (spentByCategory[t.category_id!] ?? 0) + (t.amount ?? 0)
      })
      const amounts = Object.values(spentByCategory)
      if (amounts.length > 0) {
        const maxSpent = Math.max(...amounts)
        const maxRatio = maxSpent / expenses
        if (maxRatio > 0.5) {
          expenseDistribution = Math.max(0, 100 - (maxRatio - 0.5) * 200)
        }
      }
    }

    const breakdown: HealthBreakdown = {
      savings_rate: Math.round(savingsRate),
      budget_adherence: Math.round(budgetAdherence),
      spending_trend: Math.round(spendingTrend),
      expense_distribution: Math.round(expenseDistribution),
    }

    // Total score (weighted)
    const totalScore = Math.round(
      breakdown.savings_rate * 0.3 +
      breakdown.budget_adherence * 0.25 +
      breakdown.spending_trend * 0.25 +
      breakdown.expense_distribution * 0.2
    )

    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]

    // Save to database
    const { data: existingScore } = await supabase
      .from('health_scores')
      .select('id')
      .eq('user_id', user.id)
      .eq('month', currentMonth)
      .single()

    if (existingScore) {
      await supabase
        .from('health_scores')
        .update({ score: totalScore, breakdown })
        .eq('id', existingScore.id)
    } else {
      await supabase
        .from('health_scores')
        .insert({ user_id: user.id, score: totalScore, breakdown, month: currentMonth })
    }

    // Re-fetch history
    const { data: updatedHistory } = await supabase
      .from('health_scores')
      .select('*')
      .eq('user_id', user.id)
      .order('month', { ascending: true })
      .limit(12)

    const latestScore: HealthScoreRow = {
      id: existingScore?.id ?? '',
      user_id: user.id,
      score: totalScore,
      breakdown,
      month: currentMonth,
      created_at: new Date().toISOString(),
    }

    setScore(latestScore)
    setHistory(updatedHistory ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    calculateAndFetch()
  }, [calculateAndFetch])

  async function handleRecalculate() {
    setCalculating(true)
    await calculateAndFetch()
    setCalculating(false)
  }

  // Chart data
  const chartData = history.map((h) => ({
    month: new Date(h.month).toLocaleDateString('id-ID', { month: 'short' }),
    score: h.score,
  }))

  // Find weakest factor
  function getWeakestFactor(): string {
    if (!score) return 'savings_rate'
    const { breakdown } = score
    const factors = [
      { key: 'savings_rate', value: breakdown.savings_rate },
      { key: 'budget_adherence', value: breakdown.budget_adherence },
      { key: 'spending_trend', value: breakdown.spending_trend },
      { key: 'expense_distribution', value: breakdown.expense_distribution },
    ]
    factors.sort((a, b) => a.value - b.value)
    return factors[0].key
  }

  const weakestFactor = score ? getWeakestFactor() : 'savings_rate'

  // ── Loading State ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!score) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kesehatan Finansial</h1>
            <p className="text-sm text-gray-500 mt-1">
              Pantau skor kesehatan keuanganmu
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Belum Ada Data
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
            Mulai catat transaksi dan atur budget untuk menghitung skor kesehatan finansialmu.
          </p>
          <button
            onClick={handleRecalculate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Hitung Skor
          </button>
        </div>
      </div>
    )
  }

  const scoreInfo = getScoreLabel(score.score)
  const scoreColor = getScoreColor(score.score)
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score.score / 100) * circumference

  const factors = [
    { key: 'savings_rate', value: score.breakdown.savings_rate, icon: PiggyBank },
    { key: 'budget_adherence', value: score.breakdown.budget_adherence, icon: Target },
    { key: 'spending_trend', value: score.breakdown.spending_trend, icon: TrendingDown },
    { key: 'expense_distribution', value: score.breakdown.expense_distribution, icon: BarChart3 },
  ]

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kesehatan Finansial</h1>
          <p className="text-sm text-gray-500 mt-1">
            Pantau skor kesehatan keuanganmu
          </p>
        </div>
        <button
          onClick={handleRecalculate}
          disabled={calculating}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${calculating ? 'animate-spin' : ''}`} />
          {calculating ? 'Menghitung...' : 'Perbarui Skor'}
        </button>
      </div>

      {/* Score Gauge */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6 text-center">
        <div className="relative w-40 h-40 mx-auto mb-4">
          <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="10" />
            <circle
              cx="70" cy="70" r={radius} fill="none"
              stroke={scoreColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold" style={{ color: scoreColor }}>
              {score.score}
            </span>
            <span className="text-xs text-gray-500">dari 100</span>
          </div>
        </div>
        <span
          className="inline-block text-sm font-semibold px-3 py-1 rounded-full"
          style={{ backgroundColor: scoreInfo.bg, color: scoreInfo.color }}
        >
          {scoreInfo.label}
        </span>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {factors.map((factor) => {
          const factorColor = getScoreColor(factor.value)
          const factorInfo = getScoreLabel(factor.value)
          const Icon = factor.icon
          return (
            <div
              key={factor.key}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: factorColor + '1A' }}
                >
                  <Icon className="w-5 h-5" style={{ color: factorColor }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {FACTOR_LABELS[factor.key]}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {FACTOR_DESCRIPTIONS[factor.key]}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold" style={{ color: factorColor }}>
                  {factor.value}
                </span>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: factorInfo.bg, color: factorInfo.color }}
                >
                  {factorInfo.label}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${factor.value}%`,
                    backgroundColor: factorColor,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Tips Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-semibold text-gray-900">Tips untuk Meningkatkan Skor</h2>
        </div>
        <p className="text-sm text-gray-500 mb-3">
          Faktor terlemahmu: <strong className="text-gray-700">{FACTOR_LABELS[weakestFactor]}</strong> ({score.breakdown[weakestFactor as keyof HealthBreakdown]}/100)
        </p>
        <ul className="space-y-2">
          {(TIPS[weakestFactor] ?? []).map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <ArrowRight className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Historical Chart */}
      {chartData.length > 1 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Riwayat Skor</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: any) => [`${value}`, 'Skor']}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke={scoreColor}
                  strokeWidth={3}
                  dot={{ fill: scoreColor, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
