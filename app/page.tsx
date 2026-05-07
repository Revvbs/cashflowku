'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Wallet,
  PieChart,
  Receipt,
  TrendingUp,
  Camera,
  BarChart3,
  Check,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  Shield,
  Smartphone,
  Zap,
} from 'lucide-react'

const features = [
  {
    icon: TrendingUp,
    title: 'Lacak Pengeluaran',
    description: 'Catat setiap transaksi harianmu dengan mudah. Kategorisasi otomatis dan pencarian cepat.',
  },
  {
    icon: Wallet,
    title: 'Multi Wallet',
    description: 'Kelola beberapa dompet sekaligus — tunai, e-wallet, rekening bank, dan kartu kredit.',
  },
  {
    icon: PieChart,
    title: 'Grafik & Laporan',
    description: 'Visualisasi pengeluaran dengan grafik pie dan bar chart. Pahami kebiasaan belanjamu.',
  },
  {
    icon: Camera,
    title: 'Scan Struk',
    description: 'Foto struk belanja dan biarkan AI kami mengisi data transaksi secara otomatis.',
  },
]

const freeFeatures = [
  'Transaksi unlimited',
  '3 dompet',
  'Grafik dasar (pie & bar)',
  'Kategori pengeluaran',
  'Export CSV',
]

const proFeatures = [
  'Semua fitur Free',
  'Dompet unlimited',
  'Advanced charts & trend analysis',
  'AI Insights & rekomendasi',
  'Scan struk (OCR)',
  'Prioritas support',
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">CashflowKu</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-3">
              <a href="#fitur" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Fitur
              </a>
              <a href="#harga" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Harga
              </a>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
              >
                Mulai Gratis
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-slate-100 mt-2 pt-4 space-y-3">
              <a href="#fitur" className="block text-sm font-medium text-slate-600 hover:text-slate-900" onClick={() => setMobileMenuOpen(false)}>Fitur</a>
              <a href="#harga" className="block text-sm font-medium text-slate-600 hover:text-slate-900" onClick={() => setMobileMenuOpen(false)}>Harga</a>
              <Link href="/login" className="block text-sm font-medium text-slate-600 hover:text-slate-900" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link
                href="/register"
                className="block text-center text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mulai Gratis
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 opacity-60" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Gratis selamanya untuk fitur dasar
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
              Kelola Keuangan Pribadi{' '}
              <span className="text-indigo-600">dengan Mudah</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-xl mx-auto">
              Catat pengeluaran, kelola beberapa dompet, dan pahami kebiasaan belanjamu.
              Semua dalam satu aplikasi yang simpel dan indah.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-200"
              >
                Mulai Gratis
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#fitur"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl hover:bg-slate-50 transition-all duration-200"
              >
                Lihat Fitur
              </a>
            </div>
          </div>

          {/* Hero visual - mock app */}
          <div className="mt-14 max-w-sm mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Total Saldo</p>
                  <p className="text-2xl font-bold text-slate-900">Rp 12.450.000</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 rounded-xl p-3">
                  <p className="text-xs text-emerald-600 font-medium">Pemasukan</p>
                  <p className="text-sm font-bold text-emerald-700">Rp 8.500.000</p>
                </div>
                <div className="bg-red-50 rounded-xl p-3">
                  <p className="text-xs text-red-600 font-medium">Pengeluaran</p>
                  <p className="text-sm font-bold text-red-700">Rp 3.200.000</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Transaksi Terakhir</p>
                {[
                  { name: 'Grab Food', amount: '-Rp 85.000', cat: 'Makanan' },
                  { name: 'Gopay Top Up', amount: '-Rp 200.000', cat: 'Transfer' },
                  { name: 'Gaji Bulanan', amount: '+Rp 8.500.000', cat: 'Pendapatan' },
                ].map((t, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.cat}</p>
                    </div>
                    <span className={`text-sm font-semibold ${t.amount.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                      {t.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="fitur" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
            Fitur yang Kamu Butuhkan
          </h2>
          <p className="text-slate-600 max-w-lg mx-auto">
            Semua alat untuk mengelola keuangan pribadi, dari pencatatan harian hingga analisis mendalam.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why section */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
              Kenapa CashflowKu?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Smartphone, title: 'Mobile-First', desc: 'Dirancang untuk layar kecil. Catat transaksi kapan saja, di mana saja.' },
              { icon: Shield, title: 'Aman & Privat', desc: 'Data terenkripsi dan tersimpan aman. Kami tidak menjual data kamu.' },
              { icon: Zap, title: 'Cepat & Ringan', desc: 'Tanpa iklan, tanpa bloat. Aplikasi yang langsung responsif.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="harga" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
            Harga Transparan
          </h2>
          <p className="text-slate-600 max-w-lg mx-auto">
            Mulai gratis. Upgrade ke Pro kapan saja untuk fitur lebih lengkap.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {/* Free */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
            <p className="text-sm font-semibold text-slate-500 mb-1">Free</p>
            <p className="text-3xl font-extrabold text-slate-900 mb-1">Gratis</p>
            <p className="text-sm text-slate-500 mb-6">Selamanya</p>
            <ul className="space-y-2.5 mb-6">
              {freeFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="block w-full text-center bg-white border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition-all duration-200 text-sm"
            >
              Daftar Sekarang
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-white border-2 border-indigo-600 shadow-md rounded-xl p-6 relative">
            <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              Populer
            </div>
            <p className="text-sm font-semibold text-indigo-600 mb-1">Pro</p>
            <p className="text-3xl font-extrabold text-slate-900 mb-1">Rp 39K<span className="text-base font-medium text-slate-500">/bulan</span></p>
            <p className="text-sm text-slate-500 mb-6">Bayar bulanan, batalkan kapan saja</p>
            <ul className="space-y-2.5 mb-6">
              {proFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 text-sm"
            >
              Mulai Pro Trial
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Mulai Kelola Keuanganmu Hari Ini
          </h2>
          <p className="text-indigo-100 mb-6 max-w-md mx-auto">
            Gratis, tanpa kartu kredit. Butuh waktu kurang dari 1 menit untuk mulai.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-200 shadow-lg"
          >
            Buat Akun Gratis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900">CashflowKu</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <a href="#fitur" className="hover:text-slate-900 transition-colors">Fitur</a>
              <a href="#harga" className="hover:text-slate-900 transition-colors">Harga</a>
              <Link href="/login" className="hover:text-slate-900 transition-colors">Login</Link>
            </div>
            <p className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} CashflowKu. Semua hak dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
