'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  PiggyBank,
  Plus,
  Target,
  X,
  AlertCircle,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Circle,
  Pause,
  Trash2,
  Pencil,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────
interface CategoryRow {
  id: string
  name: string
  type: string
  icon: string
  color: string
}

interface BudgetRow {
  id: string
  user_id: string
  category_id: string | null
  amount: number
  period: string
  start_date: string
  created_at: string
  categories?: CategoryRow | null
  spent?: number
}

interface TargetRow {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  deadline: string | null
  icon: string
  color: string
  status: string
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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const ICON_OPTIONS = [
  'Target', 'PiggyBank', 'Home', 'Car', 'Plane', 'GraduationCap',
  'Heart', 'Gift', 'Smartphone', 'Gem', 'Star', 'Zap',
]

const COLOR_OPTIONS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e',
  '#f97316', '#f59e0b', '#84cc16', '#10b981', '#14b8a6',
  '#06b6d4', '#3b82f6',
]

// ── Component ──────────────────────────────────────────────────────────────────
export default function BudgetPage() {
  const [activeTab, setActiveTab] = useState<'budget' | 'target'>('budget')
  const [budgets, setBudgets] = useState<BudgetRow[]>([])
  const [targets, setTargets] = useState<TargetRow[]>([])
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Budget modal
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [budgetForm, setBudgetForm] = useState({
    category_id: '',
    amount: '',
    period: 'monthly',
  })
  const [editingBudget, setEditingBudget] = useState<BudgetRow | null>(null)

  // Target modal
  const [showTargetModal, setShowTargetModal] = useState(false)
  const [targetForm, setTargetForm] = useState({
    name: '',
    target_amount: '',
    deadline: '',
    icon: 'Target',
    color: '#6366f1',
  })
  const [editingTarget, setEditingTarget] = useState<TargetRow | null>(null)

  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  const fetchData = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]

    const [budgetRes, targetRes, catRes, transactionRes] = await Promise.all([
      supabase
        .from('budgets')
        .select('*, categories(id, name, type, icon, color)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('targets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'expense')
        .order('name'),
      supabase
        .from('transactions')
        .select('category_id, amount, type')
        .eq('user_id', user.id)
        .eq('type', 'expense')
        .gte('date', monthStart)
        .lte('date', monthEnd),
    ])

    // Calculate spent per category
    const spentByCategory: Record<string, number> = {}
    transactionRes.data?.forEach((t) => {
      if (t.category_id) {
        spentByCategory[t.category_id] = (spentByCategory[t.category_id] ?? 0) + (t.amount ?? 0)
      }
    })

    const budgetsWithSpent = (budgetRes.data ?? []).map((b) => ({
      ...b,
      categories: Array.isArray(b.categories) ? b.categories[0] ?? null : b.categories ?? null,
      spent: b.category_id ? (spentByCategory[b.category_id] ?? 0) : 0,
    }))

    setBudgets(budgetsWithSpent)
    setTargets(targetRes.data ?? [])
    setCategories(catRes.data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Budget calculations
  const totalBudget = budgets.reduce((sum, b) => sum + (b.amount ?? 0), 0)
  const totalSpent = budgets.reduce((sum, b) => sum + (b.spent ?? 0), 0)
  const totalRemaining = totalBudget - totalSpent

  // ── Budget Handlers ─────────────────────────────────────────────────────────
  function openAddBudget() {
    setEditingBudget(null)
    setBudgetForm({ category_id: '', amount: '', period: 'monthly' })
    setError('')
    setShowBudgetModal(true)
  }

  function openEditBudget(budget: BudgetRow) {
    setEditingBudget(budget)
    setBudgetForm({
      category_id: budget.category_id ?? '',
      amount: String(budget.amount ?? 0),
      period: budget.period,
    })
    setError('')
    setShowBudgetModal(true)
  }

  async function handleBudgetSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!budgetForm.amount || Number(budgetForm.amount) <= 0) {
      setError('Jumlah budget wajib diisi.')
      return
    }
    setSaving(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const payload = {
      category_id: budgetForm.category_id || null,
      amount: Number(budgetForm.amount),
      period: budgetForm.period,
      start_date: new Date().toISOString().split('T')[0],
      user_id: user.id,
    }

    if (editingBudget) {
      const { error: updateErr } = await supabase
        .from('budgets')
        .update({ category_id: payload.category_id, amount: payload.amount, period: payload.period })
        .eq('id', editingBudget.id)
        .eq('user_id', user.id)
      if (updateErr) {
        setError('Gagal mengupdate budget.')
        setSaving(false)
        return
      }
    } else {
      const { error: insertErr } = await supabase.from('budgets').insert(payload)
      if (insertErr) {
        setError('Gagal menambahkan budget.')
        setSaving(false)
        return
      }
    }

    await fetchData()
    setShowBudgetModal(false)
    setSaving(false)
  }

  async function handleDeleteBudget(id: string) {
    await supabase.from('budgets').delete().eq('id', id)
    await fetchData()
  }

  // ── Target Handlers ─────────────────────────────────────────────────────────
  function openAddTarget() {
    setEditingTarget(null)
    setTargetForm({ name: '', target_amount: '', deadline: '', icon: 'Target', color: '#6366f1' })
    setError('')
    setShowTargetModal(true)
  }

  function openEditTarget(target: TargetRow) {
    setEditingTarget(target)
    setTargetForm({
      name: target.name,
      target_amount: String(target.target_amount),
      deadline: target.deadline ?? '',
      icon: target.icon,
      color: target.color,
    })
    setError('')
    setShowTargetModal(true)
  }

  async function handleTargetSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!targetForm.name.trim()) {
      setError('Nama target wajib diisi.')
      return
    }
    if (!targetForm.target_amount || Number(targetForm.target_amount) <= 0) {
      setError('Jumlah target wajib diisi.')
      return
    }
    setSaving(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const payload = {
      name: targetForm.name.trim(),
      target_amount: Number(targetForm.target_amount),
      deadline: targetForm.deadline || null,
      icon: targetForm.icon,
      color: targetForm.color,
      user_id: user.id,
    }

    if (editingTarget) {
      const { error: updateErr } = await supabase
        .from('targets')
        .update(payload)
        .eq('id', editingTarget.id)
        .eq('user_id', user.id)
      if (updateErr) {
        setError('Gagal mengupdate target.')
        setSaving(false)
        return
      }
    } else {
      const { error: insertErr } = await supabase.from('targets').insert(payload)
      if (insertErr) {
        setError('Gagal menambahkan target.')
        setSaving(false)
        return
      }
    }

    await fetchData()
    setShowTargetModal(false)
    setSaving(false)
  }

  async function handleDeleteTarget(id: string) {
    await supabase.from('targets').delete().eq('id', id)
    await fetchData()
  }

  async function handleUpdateTargetAmount(target: TargetRow, newAmount: number) {
    await supabase
      .from('targets')
      .update({
        current_amount: newAmount,
        status: newAmount >= target.target_amount ? 'completed' : 'active',
      })
      .eq('id', target.id)
    await fetchData()
  }

  function getProgressColor(pct: number): string {
    if (pct >= 90) return '#f43f5e'
    if (pct >= 70) return '#f59e0b'
    return '#10b981'
  }

  // ── Loading State ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded-xl" />
          <div className="h-32 bg-gray-200 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budget & Target</h1>
          <p className="text-sm text-gray-500 mt-1">
            Atur anggaran dan target keuanganmu
          </p>
        </div>
        <button
          onClick={activeTab === 'budget' ? openAddBudget : openAddTarget}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {activeTab === 'budget' ? 'Tambah Budget' : 'Tambah Target'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6 max-w-xs">
        <button
          onClick={() => setActiveTab('budget')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'budget'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <PiggyBank className="w-4 h-4" />
          Budget
        </button>
        <button
          onClick={() => setActiveTab('target')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'target'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Target className="w-4 h-4" />
          Target
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Budget Tab ─────────────────────────────────────────────────────── */}
      {activeTab === 'budget' && (
        <>
          {budgets.length > 0 ? (
            <>
              {/* Overview Card */}
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-5 md:p-6 mb-6 text-white">
                <p className="text-sm font-medium text-indigo-200">Budget Bulan Ini</p>
                <div className="grid grid-cols-3 gap-4 mt-3">
                  <div>
                    <p className="text-xs text-indigo-200">Total Budget</p>
                    <p className="text-lg font-bold mt-0.5">{formatCurrency(totalBudget)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-indigo-200">Terpakai</p>
                    <p className="text-lg font-bold mt-0.5">{formatCurrency(totalSpent)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-indigo-200">Sisa</p>
                    <p className={`text-lg font-bold mt-0.5 ${totalRemaining < 0 ? 'text-rose-200' : ''}`}>
                      {formatCurrency(totalRemaining)}
                    </p>
                  </div>
                </div>
                {totalBudget > 0 && (
                  <div className="mt-4">
                    <div className="w-full h-2 bg-indigo-400/30 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%`,
                          backgroundColor: getProgressColor((totalSpent / totalBudget) * 100),
                        }}
                      />
                    </div>
                    <p className="text-xs text-indigo-200 mt-1">
                      {((totalSpent / totalBudget) * 100).toFixed(0)}% terpakai
                    </p>
                  </div>
                )}
              </div>

              {/* Budget Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {budgets.map((budget) => {
                  const pct = budget.amount > 0 ? ((budget.spent ?? 0) / budget.amount) * 100 : 0
                  const catName = budget.categories?.name ?? 'Semua Kategori'
                  const catColor = budget.categories?.color ?? '#6366f1'
                  const progressColor = getProgressColor(pct)

                  return (
                    <div
                      key={budget.id}
                      className="bg-white rounded-xl border border-gray-200 p-5 relative group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: catColor + '1A' }}
                          >
                            <PiggyBank className="w-5 h-5" style={{ color: catColor }} />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">{catName}</h3>
                            <span className="text-xs text-gray-500 capitalize">
                              {budget.period === 'monthly' ? 'Bulanan' : budget.period === 'weekly' ? 'Mingguan' : 'Tahunan'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditBudget(budget)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBudget(budget.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-baseline justify-between mb-2">
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(budget.spent ?? 0)}
                        </p>
                        <p className="text-sm text-gray-500">
                          dari {formatCurrency(budget.amount)}
                        </p>
                      </div>

                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(pct, 100)}%`,
                            backgroundColor: progressColor,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs font-medium" style={{ color: progressColor }}>
                          {pct.toFixed(0)}%
                        </span>
                        <span className="text-xs text-gray-500">
                          Sisa {formatCurrency(Math.max(budget.amount - (budget.spent ?? 0), 0))}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                <PiggyBank className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Belum Ada Budget
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                Atur budget per kategori untuk mengontrol pengeluaranmu setiap bulan.
              </p>
              <button
                onClick={openAddBudget}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Buat Budget Pertama
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Target Tab ─────────────────────────────────────────────────────── */}
      {activeTab === 'target' && (
        <>
          {targets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {targets.map((target) => {
                const pct = target.target_amount > 0 ? (target.current_amount / target.target_amount) * 100 : 0
                const isCompleted = target.status === 'completed'
                const radius = 36
                const circumference = 2 * Math.PI * radius
                const offset = circumference - (Math.min(pct, 100) / 100) * circumference

                return (
                  <div
                    key={target.id}
                    className="bg-white rounded-xl border border-gray-200 p-5 relative group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {/* Circular Progress */}
                        <div className="relative w-14 h-14 flex-shrink-0">
                          <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 80 80">
                            <circle cx="40" cy="40" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="6" />
                            <circle
                              cx="40" cy="40" r={radius} fill="none"
                              stroke={isCompleted ? '#10b981' : target.color}
                              strokeWidth="6"
                              strokeLinecap="round"
                              strokeDasharray={circumference}
                              strokeDashoffset={offset}
                              className="transition-all duration-700"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-700">
                              {Math.min(pct, 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                            {target.name}
                            {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                          </h3>
                          {target.deadline && (
                            <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3" />
                              {formatDate(target.deadline)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditTarget(target)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTarget(target.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between mb-1">
                      <p className="text-lg font-bold" style={{ color: isCompleted ? '#10b981' : target.color }}>
                        {formatCurrency(target.current_amount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        dari {formatCurrency(target.target_amount)}
                      </p>
                    </div>

                    {/* Quick add button */}
                    {!isCompleted && (
                      <div className="flex gap-2 mt-3">
                        {[100000, 500000, 1000000].map((amt) => (
                          <button
                            key={amt}
                            onClick={() => handleUpdateTargetAmount(target, target.current_amount + amt)}
                            className="flex-1 px-2 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            +{formatCurrency(amt)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Belum Ada Target
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                Buat target tabungan untuk memotivasi dirimu mencapai tujuan finansial.
              </p>
              <button
                onClick={openAddTarget}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Buat Target Pertama
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Budget Modal ────────────────────────────────────────────────────── */}
      {showBudgetModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowBudgetModal(false)} />
          <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-base font-semibold text-gray-900">
                {editingBudget ? 'Edit Budget' : 'Tambah Budget'}
              </h2>
              <button onClick={() => setShowBudgetModal(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleBudgetSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
                <select
                  value={budgetForm.category_id}
                  onChange={(e) => setBudgetForm({ ...budgetForm, category_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Semua Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Jumlah (Rp)</label>
                <input
                  type="number"
                  value={budgetForm.amount}
                  onChange={(e) => setBudgetForm({ ...budgetForm, amount: e.target.value })}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Periode</label>
                <select
                  value={budgetForm.period}
                  onChange={(e) => setBudgetForm({ ...budgetForm, period: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="monthly">Bulanan</option>
                  <option value="weekly">Mingguan</option>
                  <option value="yearly">Tahunan</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBudgetModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : editingBudget ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Target Modal ────────────────────────────────────────────────────── */}
      {showTargetModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowTargetModal(false)} />
          <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-base font-semibold text-gray-900">
                {editingTarget ? 'Edit Target' : 'Tambah Target'}
              </h2>
              <button onClick={() => setShowTargetModal(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleTargetSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Target</label>
                <input
                  type="text"
                  value={targetForm.name}
                  onChange={(e) => setTargetForm({ ...targetForm, name: e.target.value })}
                  placeholder="Contoh: Liburan ke Bali"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Jumlah Target (Rp)</label>
                <input
                  type="number"
                  value={targetForm.target_amount}
                  onChange={(e) => setTargetForm({ ...targetForm, target_amount: e.target.value })}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Deadline (Opsional)</label>
                <input
                  type="date"
                  value={targetForm.deadline}
                  onChange={(e) => setTargetForm({ ...targetForm, deadline: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Warna</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setTargetForm({ ...targetForm, color: c })}
                      className={`w-8 h-8 rounded-lg transition-all ${
                        targetForm.color === c ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTargetModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : editingTarget ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
