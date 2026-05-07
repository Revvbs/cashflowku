'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Repeat,
  Plus,
  X,
  AlertCircle,
  Calendar,
  Clock,
  Pause,
  Play,
  Trash2,
  Pencil,
  CreditCard,
} from 'lucide-react'

interface CategoryRow { id: string; name: string; icon: string; color: string }
interface WalletRow { id: string; name: string; color: string | null }
interface SubscriptionRow {
  id: string; user_id: string; name: string; amount: number; billing_cycle: string;
  category_id: string | null; wallet_id: string | null; next_billing_date: string;
  auto_renew: boolean; status: string; logo_url: string | null; notes: string | null;
  created_at: string; categories?: CategoryRow | null; wallets?: WalletRow | null
}

const PRESETS = [
  { name: 'Netflix', amount: 65000, icon: '🎬', color: '#E50914' },
  { name: 'Spotify', amount: 54990, icon: '🎵', color: '#1DB954' },
  { name: 'YouTube Premium', amount: 59000, icon: '▶️', color: '#FF0000' },
  { name: 'ChatGPT Plus', amount: 320000, icon: '🤖', color: '#10A37F' },
  { name: 'Disney+ Hotstar', amount: 39000, icon: '✨', color: '#113CCF' },
  { name: 'Apple iCloud', amount: 15000, icon: '☁️', color: '#007AFF' },
  { name: 'Google One', amount: 26900, icon: '🔷', color: '#4285F4' },
  { name: 'Microsoft 365', amount: 119999, icon: '📊', color: '#F25022' },
]

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
function daysUntil(dateStr: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr); target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}
function getMonthlyAmount(amount: number, cycle: string): number {
  switch (cycle) { case 'weekly': return amount * 4.33; case 'yearly': return amount / 12; default: return amount }
}
const CYCLE_LABELS: Record<string, string> = { monthly: '/bulan', yearly: '/tahun', weekly: '/minggu' }
const STATUS_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  active: { label: 'Aktif', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  paused: { label: 'Dijeda', bg: 'bg-amber-50', text: 'text-amber-700' },
  cancelled: { label: 'Dibatalkan', bg: 'bg-gray-100', text: 'text-gray-500' },
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionRow[]>([])
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [wallets, setWallets] = useState<WalletRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingSub, setEditingSub] = useState<SubscriptionRow | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', amount: '', billing_cycle: 'monthly', category_id: '', wallet_id: '', next_billing_date: '', auto_renew: true, notes: '' })

  const supabase = createClient()

  const fetchData = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const [subRes, catRes, walletRes] = await Promise.all([
      supabase.from('subscriptions').select('*, categories(id, name, icon, color), wallets(id, name, color)').eq('user_id', user.id).order('next_billing_date', { ascending: true }),
      supabase.from('categories').select('id, name, icon, color').eq('user_id', user.id).eq('type', 'expense').order('name'),
      supabase.from('wallets').select('id, name, color').eq('user_id', user.id).order('name'),
    ])
    const subs = (subRes.data ?? []).map((s: any) => ({ ...s, categories: Array.isArray(s.categories) ? s.categories[0] ?? null : s.categories ?? null, wallets: Array.isArray(s.wallets) ? s.wallets[0] ?? null : s.wallets ?? null }))
    setSubscriptions(subs); setCategories(catRes.data ?? []); setWallets(walletRes.data ?? []); setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const activeSubs = subscriptions.filter((s) => s.status === 'active')
  const totalMonthly = activeSubs.reduce((sum, s) => sum + getMonthlyAmount(s.amount, s.billing_cycle), 0)
  const activeCount = activeSubs.length
  const nextBilling = activeSubs.length > 0 ? activeSubs[0].next_billing_date : null
  const upcomingThisWeek = activeSubs.filter((s) => { const days = daysUntil(s.next_billing_date); return days >= 0 && days <= 7 })

  function openAddModal(preset?: typeof PRESETS[0]) {
    setEditingSub(null)
    if (preset) { setForm({ name: preset.name, amount: String(preset.amount), billing_cycle: 'monthly', category_id: '', wallet_id: '', next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], auto_renew: true, notes: '' }) }
    else { setForm({ name: '', amount: '', billing_cycle: 'monthly', category_id: '', wallet_id: '', next_billing_date: '', auto_renew: true, notes: '' }) }
    setError(''); setShowModal(true)
  }

  function openEditModal(sub: SubscriptionRow) {
    setEditingSub(sub)
    setForm({ name: sub.name, amount: String(sub.amount), billing_cycle: sub.billing_cycle, category_id: sub.category_id ?? '', wallet_id: sub.wallet_id ?? '', next_billing_date: sub.next_billing_date, auto_renew: sub.auto_renew, notes: sub.notes ?? '' })
    setError(''); setShowModal(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Nama langganan wajib diisi.'); return }
    if (!form.amount || Number(form.amount) <= 0) { setError('Jumlah wajib diisi.'); return }
    if (!form.next_billing_date) { setError('Tanggal tagihan berikutnya wajib diisi.'); return }
    setSaving(true); setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const payload = { name: form.name.trim(), amount: Number(form.amount), billing_cycle: form.billing_cycle, category_id: form.category_id || null, wallet_id: form.wallet_id || null, next_billing_date: form.next_billing_date, auto_renew: form.auto_renew, notes: form.notes || null, user_id: user.id }
    if (editingSub) { const { error: updateErr } = await supabase.from('subscriptions').update(payload).eq('id', editingSub.id).eq('user_id', user.id); if (updateErr) { setError('Gagal mengupdate langganan.'); setSaving(false); return } }
    else { const { error: insertErr } = await supabase.from('subscriptions').insert(payload); if (insertErr) { setError('Gagal menambahkan langganan.'); setSaving(false); return } }
    await fetchData(); setShowModal(false); setSaving(false)
  }

  async function handleToggleStatus(sub: SubscriptionRow) { const newStatus = sub.status === 'active' ? 'paused' : 'active'; await supabase.from('subscriptions').update({ status: newStatus }).eq('id', sub.id); await fetchData() }
  async function handleDelete(id: string) { await supabase.from('subscriptions').delete().eq('id', id); await fetchData() }
  function getSubLogo(sub: SubscriptionRow): string { const preset = PRESETS.find((p) => p.name.toLowerCase() === sub.name.toLowerCase()); return preset?.icon ?? '📺' }

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-28 bg-gray-200 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[1, 2, 3].map((i) => (<div key={i} className="h-24 bg-gray-200 rounded-2xl" />))}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Langganan</h1>
          <p className="text-sm text-gray-500 mt-1">Lacak semua langganan bulananmu</p>
        </div>
        <button onClick={() => openAddModal()} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 gradient-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-indigo-200">
          <Plus className="w-4 h-4" /> Tambah Langganan
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{error}</span>
          <button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      {subscriptions.length > 0 ? (
        <>
          {/* Summary Card */}
          <div className="gradient-primary rounded-2xl p-6 md:p-7 mb-6 text-white shadow-lg shadow-indigo-200">
            <div className="grid grid-cols-3 gap-4">
              <div><p className="text-xs text-indigo-200">Total / Bulan</p><p className="text-lg font-bold mt-0.5">{formatCurrency(totalMonthly)}</p></div>
              <div><p className="text-xs text-indigo-200">Aktif</p><p className="text-lg font-bold mt-0.5">{activeCount} langganan</p></div>
              <div><p className="text-xs text-indigo-200">Tagihan Berikutnya</p><p className="text-lg font-bold mt-0.5">{nextBilling ? formatDate(nextBilling) : '-'}</p></div>
            </div>
          </div>

          {/* Upcoming This Week */}
          {upcomingThisWeek.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /> Tagihan Minggu Ini</h2>
              <div className="space-y-2">
                {upcomingThisWeek.map((sub) => {
                  const days = daysUntil(sub.next_billing_date)
                  return (
                    <div key={sub.id} className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5 flex items-center gap-3">
                      <span className="text-xl">{getSubLogo(sub)}</span>
                      <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900">{sub.name}</p><p className="text-xs text-amber-700">{days === 0 ? 'Hari ini!' : days === 1 ? 'Besok' : `${days} hari lagi`}</p></div>
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(sub.amount)}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Subscription List */}
          <div className="space-y-3">
            {subscriptions.map((sub) => {
              const statusInfo = STATUS_LABELS[sub.status] ?? STATUS_LABELS.active
              const days = daysUntil(sub.next_billing_date)
              const catColor = sub.categories?.color ?? '#6366f1'
              return (
                <div key={sub.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 flex items-center gap-4 group hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: catColor + '15' }}>{getSubLogo(sub)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{sub.name}</h3>
                      <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${statusInfo.bg} ${statusInfo.text}`}>{statusInfo.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className="font-medium" style={{ color: catColor }}>{formatCurrency(sub.amount)}{CYCLE_LABELS[sub.billing_cycle] ?? ''}</span>
                      {sub.categories && (<><span className="text-gray-300">·</span><span>{sub.categories.name}</span></>)}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-400"><Calendar className="w-3 h-3" /><span>{days >= 0 ? `Tagihan ${days === 0 ? 'hari ini' : `dalam ${days} hari`}` : `Terlambat ${Math.abs(days)} hari`}</span></div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-sm font-bold text-gray-900">{formatCurrency(sub.amount)}</p>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleToggleStatus(sub)} className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors" title={sub.status === 'active' ? 'Jeda' : 'Aktifkan'}>
                        {sub.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => openEditModal(sub)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(sub.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="Hapus"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 md:p-16 text-center mb-6">
            <div className="mx-auto w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-5 shadow-lg shadow-indigo-200"><Repeat className="w-8 h-8 text-white" /></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Langganan</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-8">Lacak langganan bulananmu agar tidak ada yang terlewat.</p>
            <button onClick={() => openAddModal()} className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-indigo-200"><Plus className="w-4 h-4" /> Tambah Langganan Pertama</button>
          </div>

          {/* Quick presets */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Langganan Populer</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESETS.slice(0, 4).map((preset) => (
                <button key={preset.name} onClick={() => openAddModal(preset)} className="bg-white border border-gray-100 rounded-2xl p-4 text-center hover:shadow-md transition-shadow">
                  <span className="text-2xl block mb-2">{preset.icon}</span>
                  <p className="text-xs font-medium text-gray-900">{preset.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{formatCurrency(preset.amount)}/bln</p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="h-1.5 gradient-primary sm:rounded-t-2xl" />
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-base font-semibold text-gray-900">{editingSub ? 'Edit Langganan' : 'Tambah Langganan'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Nama</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Netflix" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm input-modern" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Jumlah (Rp)</label><input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm input-modern" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Billing Cycle</label><select value={form.billing_cycle} onChange={(e) => setForm({ ...form, billing_cycle: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm input-modern"><option value="monthly">Bulanan</option><option value="yearly">Tahunan</option><option value="weekly">Mingguan</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label><select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm input-modern"><option value="">Pilih kategori</option>{categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.icon ? `${cat.icon} ` : ''}{cat.name}</option>))}</select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Dompet</label><select value={form.wallet_id} onChange={(e) => setForm({ ...form, wallet_id: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm input-modern"><option value="">Pilih dompet</option>{wallets.map((w) => (<option key={w.id} value={w.id}>{w.name}</option>))}</select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Tagihan Berikutnya</label><input type="date" value={form.next_billing_date} onChange={(e) => setForm({ ...form, next_billing_date: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm input-modern" /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 gradient-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50">{saving ? 'Menyimpan...' : editingSub ? 'Simpan' : 'Tambah'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
