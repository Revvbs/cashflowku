
'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Wallet,
  Plus,
  Pencil,
  Trash2,
  Star,
  X,
  Banknote,
  CreditCard,
  Smartphone,
  Building2,
  AlertCircle,
  Crown,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────
interface WalletRow {
  id: string
  user_id: string
  name: string
  type: 'cash' | 'bank' | 'e-wallet' | 'credit'
  balance: number
  currency: string
  icon: string | null
  color: string | null
  is_default: boolean
}

interface FormData {
  name: string
  type: 'cash' | 'bank' | 'e-wallet' | 'credit'
  balance: string
  color: string
  icon: string
}

// ── Constants ──────────────────────────────────────────────────────────────────
const TYPE_LABELS: Record<string, string> = {
  cash: 'Tunai',
  bank: 'Bank',
  'e-wallet': 'E-Wallet',
  credit: 'Kartu Kredit',
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  cash: Banknote,
  bank: Building2,
  'e-wallet': Smartphone,
  credit: CreditCard,
}

const ICON_OPTIONS = [
  'wallet', 'banknote', 'building', 'smartphone', 'credit-card',
  'piggy-bank', 'coins', 'landmark', 'gem', 'heart',
  'star', 'zap', 'shield', 'briefcase', 'gift',
]

const COLOR_OPTIONS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e',
  '#f97316', '#f59e0b', '#84cc16', '#10b981', '#14b8a6',
  '#06b6d4', '#3b82f6', '#6b7280', '#1e293b', '#78716c',
]

const FREE_WALLET_LIMIT = 3

const DEFAULT_FORM: FormData = {
  name: '',
  type: 'cash',
  balance: '0',
  color: COLOR_OPTIONS[0],
  icon: 'wallet',
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

function getIconComponent(iconName: string) {
  const map: Record<string, React.ElementType> = {
    wallet: Wallet,
    banknote: Banknote,
    building: Building2,
    smartphone: Smartphone,
    'credit-card': CreditCard,
    'piggy-bank': Wallet,
    coins: Banknote,
    landmark: Building2,
    gem: Star,
    heart: Star,
    star: Star,
    zap: Star,
    shield: Star,
    briefcase: Star,
    gift: Star,
  }
  return map[iconName] ?? Wallet
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function WalletsPage() {
  const [wallets, setWallets] = useState<WalletRow[]>([])
  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState<'free' | 'pro'>('free')
  const [showModal, setShowModal] = useState(false)
  const [editingWallet, setEditingWallet] = useState<WalletRow | null>(null)
  const [form, setForm] = useState<FormData>(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const supabase = createClient()

  const fetchData = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [walletRes, profileRes] = await Promise.all([
      supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: true }),
      supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single(),
    ])

    setWallets(walletRes.data ?? [])
    setPlan(profileRes.data?.plan === 'pro' ? 'pro' : 'free')
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const totalBalance = wallets.reduce((sum, w) => sum + (w.balance ?? 0), 0)

  function openAddModal() {
    if (plan === 'free' && wallets.length >= FREE_WALLET_LIMIT) {
      setShowUpgrade(true)
      return
    }
    setEditingWallet(null)
    setForm(DEFAULT_FORM)
    setError('')
    setShowModal(true)
  }

  function openEditModal(wallet: WalletRow) {
    setEditingWallet(wallet)
    setForm({
      name: wallet.name,
      type: wallet.type,
      balance: String(wallet.balance ?? 0),
      color: wallet.color ?? COLOR_OPTIONS[0],
      icon: wallet.icon ?? 'wallet',
    })
    setError('')
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingWallet(null)
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Nama dompet wajib diisi.')
      return
    }
    setSaving(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const payload = {
      name: form.name.trim(),
      type: form.type,
      balance: Number(form.balance) || 0,
      color: form.color,
      icon: form.icon,
      currency: 'IDR',
    }

    if (editingWallet) {
      const { error: updateError } = await supabase
        .from('wallets')
        .update(payload)
        .eq('id', editingWallet.id)
        .eq('user_id', user.id)

      if (updateError) {
        setError('Gagal mengupdate dompet. Silakan coba lagi.')
        setSaving(false)
        return
      }
    } else {
      // Check limit again
      if (plan === 'free' && wallets.length >= FREE_WALLET_LIMIT) {
        setShowUpgrade(true)
        setShowModal(false)
        setSaving(false)
        return
      }

      const { error: insertError } = await supabase.from('wallets').insert({
        ...payload,
        user_id: user.id,
        is_default: wallets.length === 0, // first wallet becomes default
      })

      if (insertError) {
        setError('Gagal menambahkan dompet. Silakan coba lagi.')
        setSaving(false)
        return
      }
    }

    await fetchData()
    closeModal()
    setSaving(false)
  }

  async function handleDelete(id: string) {
    const wallet = wallets.find((w) => w.id === id)
    if (wallet?.is_default) {
      setError('Tidak bisa menghapus dompet default. Ubah dompet default terlebih dahulu.')
      setDeleteConfirm(null)
      return
    }

    const { error: delError } = await supabase
      .from('wallets')
      .delete()
      .eq('id', id)

    if (delError) {
      setError('Gagal menghapus dompet.')
    } else {
      await fetchData()
    }
    setDeleteConfirm(null)
  }

  async function handleSetDefault(id: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Remove default from all, then set the new one
    await supabase
      .from('wallets')
      .update({ is_default: false })
      .eq('user_id', user.id)

    await supabase
      .from('wallets')
      .update({ is_default: true })
      .eq('id', id)

    await fetchData()
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-24 bg-gray-200 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dompet</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola semua dompet dan rekeningmu
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Dompet
        </button>
      </div>

      {/* Total Balance Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-5 md:p-6 mb-6 text-white">
        <p className="text-sm font-medium text-indigo-200">Total Saldo</p>
        <p className="text-2xl md:text-3xl font-bold mt-1">
          {formatCurrency(totalBalance)}
        </p>
        <p className="text-xs text-indigo-200 mt-2">
          {wallets.length} dompet terdaftar
          {plan === 'free' && ` · Maks ${FREE_WALLET_LIMIT} dompet (Free)`}
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Wallet Cards Grid */}
      {wallets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wallets.map((wallet) => {
            const IconComp = TYPE_ICONS[wallet.type] ?? Wallet
            const walletColor = wallet.color ?? '#6366f1'
            return (
              <div
                key={wallet.id}
                className="bg-white rounded-xl border border-gray-200 p-5 relative group hover:shadow-md transition-shadow"
              >
                {/* Color indicator bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
                  style={{ backgroundColor: walletColor }}
                />

                {/* Top row: icon + name + actions */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: walletColor + '1A' }}
                    >
                      <IconComp
                        className="w-5 h-5"
                        style={{ color: walletColor }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {wallet.name}
                        </h3>
                        {wallet.is_default && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                            <Star className="w-2.5 h-2.5" />
                            Utama
                          </span>
                        )}
                      </div>
                      <span
                        className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-0.5"
                        style={{
                          backgroundColor: walletColor + '1A',
                          color: walletColor,
                        }}
                      >
                        {TYPE_LABELS[wallet.type] ?? wallet.type}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!wallet.is_default && (
                      <button
                        onClick={() => handleSetDefault(wallet.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        title="Jadikan dompet utama"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => openEditModal(wallet)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Edit dompet"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(wallet.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Hapus dompet"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Balance */}
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(wallet.balance ?? 0)}
                </p>

                {/* Delete confirmation inline */}
                {deleteConfirm === wallet.id && (
                  <div className="mt-3 p-3 bg-rose-50 rounded-lg border border-rose-200">
                    <p className="text-xs text-rose-700 mb-2">
                      Yakin ingin menghapus <strong>{wallet.name}</strong>?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(wallet.id)}
                        className="px-3 py-1.5 bg-rose-600 text-white text-xs font-medium rounded-lg hover:bg-rose-700 transition-colors"
                      >
                        Hapus
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-1.5 bg-white text-gray-700 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
            <Wallet className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Belum Ada Dompet
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
            Tambahkan dompet pertamamu untuk mulai mencatat transaksi keuangan.
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Dompet Pertama
          </button>
        </div>
      )}

      {/* ── Add / Edit Modal ─────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeModal}
          />
          <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-base font-semibold text-gray-900">
                {editingWallet ? 'Edit Dompet' : 'Tambah Dompet'}
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Dompet
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Contoh: BCA, GoPay, Dompet"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipe
                </label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value as FormData['type'],
                    })
                  }
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="cash">Tunai</option>
                  <option value="bank">Bank</option>
                  <option value="e-wallet">E-Wallet</option>
                  <option value="credit">Kartu Kredit</option>
                </select>
              </div>

              {/* Balance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editingWallet ? 'Saldo Saat Ini' : 'Saldo Awal'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={form.balance}
                    onChange={(e) =>
                      setForm({ ...form, balance: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warna
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setForm({ ...form, color })}
                      className={`w-8 h-8 rounded-full transition-transform ${
                        form.color === color
                          ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Icon Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ikon
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {ICON_OPTIONS.map((iconName) => {
                    const IconC = getIconComponent(iconName)
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setForm({ ...form, icon: iconName })}
                        className={`flex items-center justify-center p-2.5 rounded-lg border transition-colors ${
                          form.icon === iconName
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <IconC className="w-5 h-5" />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Error in modal */}
              {error && (
                <p className="text-sm text-rose-600">{error}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving
                  ? 'Menyimpan...'
                  : editingWallet
                    ? 'Simpan Perubahan'
                    : 'Tambah Dompet'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Upgrade Modal ────────────────────────────────────────────────── */}
      {showUpgrade && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowUpgrade(false)}
          />
          <div className="relative bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl shadow-xl">
            <div className="p-6 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <Crown className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Batas Dompet Tercapai
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Pengguna Free hanya bisa memiliki maksimal {FREE_WALLET_LIMIT} dompet.
                Upgrade ke Pro untuk menambah dompet tanpa batas!
              </p>
              <button
                onClick={() => {
                  setShowUpgrade(false)
                  // Navigate to upgrade page when available
                  window.location.href = '/pengaturan'
                }}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg text-sm font-semibold hover:from-amber-600 hover:to-amber-700 transition-colors"
              >
                Upgrade ke Pro
              </button>
              <button
                onClick={() => setShowUpgrade(false)}
                className="w-full mt-2 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Nanti Saja
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
