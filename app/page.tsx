'use client';

import Link from 'next/link';
import {
  Wallet, BarChart3, Shield, Smartphone, Zap, Lock,
  Star, ChevronRight, Check, ArrowRight, Menu, X, Sparkles
} from 'lucide-react';
import { useState } from 'react';

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* ─── NAVBAR ─────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">CashflowKu</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Fitur</a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Harga</a>
              <a href="#testimonials" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Testimoni</a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Masuk
              </Link>
              <Link href="/register" className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
                Daftar Gratis
              </Link>
            </div>

            <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
            <a href="#features" className="block text-sm text-gray-600 py-2" onClick={() => setMobileMenu(false)}>Fitur</a>
            <a href="#pricing" className="block text-sm text-gray-600 py-2" onClick={() => setMobileMenu(false)}>Harga</a>
            <a href="#testimonials" className="block text-sm text-gray-600 py-2" onClick={() => setMobileMenu(false)}>Testimoni</a>
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <Link href="/login" className="text-center py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl">Masuk</Link>
              <Link href="/register" className="text-center py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl">Daftar Gratis</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ─── HERO ───────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-xs font-medium text-indigo-700">Gratis selamanya untuk fitur dasar</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
            Kelola Uang Tanpa
            <span className="block text-indigo-600 mt-1">Ribet & Pusing</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-500 max-w-xl mx-auto leading-relaxed">
            Catat pengeluaran, pantau budget, dan capai target finansialmu. Semua dalam satu aplikasi yang simpel dan cepat.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 w-full sm:w-auto">
              Mulai Gratis
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#features" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-medium text-gray-700 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors w-full sm:w-auto">
              Lihat Fitur
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> Tanpa kartu kredit</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> Setup 2 menit</span>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Saldo', value: 'Rp 12.450.000', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Pemasukan', value: 'Rp 8.500.000', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Pengeluaran', value: 'Rp 3.200.000', color: 'text-rose-500', bg: 'bg-rose-50' },
                { label: 'Budget Sisa', value: 'Rp 1.800.000', color: 'text-amber-600', bg: 'bg-amber-50' },
              ].map((stat) => (
                <div key={stat.label} className={`${stat.bg} rounded-xl p-4`}>
                  <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                  <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-700">Pengeluaran Bulanan</span>
                <span className="text-xs text-gray-400">Mei 2026</span>
              </div>
              <div className="flex items-end gap-2 h-32">
                {[40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 65].map((h, i) => (
                  <div key={i} className="flex-1 bg-indigo-100 rounded-t-md relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-t-md" style={{ height: `${h}%` }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>Mei</span><span>Jun</span>
                <span>Jul</span><span>Agu</span><span>Sep</span><span>Okt</span><span>Nov</span><span>Des</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ───────────────────────────────────── */}
      <section id="features" className="py-20 bg-gray-50 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Fitur Lengkap</h2>
            <p className="mt-4 text-gray-500 text-lg">Semua yang kamu butuhkan untuk kelola keuangan pribadi</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Wallet, title: 'Multi Dompet', desc: 'Kelola semua rekening, e-wallet, dan kartu kredit dalam satu tempat', color: 'bg-indigo-50 text-indigo-600' },
              { icon: BarChart3, title: 'Laporan Interaktif', desc: 'Visualisasi pengeluaran dengan chart yang mudah dipahami', color: 'bg-emerald-50 text-emerald-600' },
              { icon: Shield, title: 'Budget & Target', desc: 'Set budget bulanan dan target tabungan, pantau progress-nya', color: 'bg-amber-50 text-amber-600' },
              { icon: Smartphone, title: 'Mobile-First', desc: 'Didesain untuk mobile, bisa dipakai kapan saja dan di mana saja', color: 'bg-purple-50 text-purple-600' },
              { icon: Zap, title: 'Cepat & Ringan', desc: 'Teknologi modern membuat aplikasi super cepat dan responsif', color: 'bg-rose-50 text-rose-600' },
              { icon: Lock, title: 'Aman & Privat', desc: 'Data terenkripsi, hanya kamu yang bisa akses datamu', color: 'bg-sky-50 text-sky-600' },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ───────────────────────────────── */}
      <section id="testimonials" className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Dipercaya 10.000+ Pengguna</h2>
            <p className="mt-4 text-gray-500 text-lg">Rating 4.8 di Play Store & App Store</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Rina Wijaya', role: 'Freelancer', review: 'CashflowKu bantu saya sadar kemana uang pergi. Sekarang bisa nabung 30% lebih banyak!', avatar: 'RW' },
              { name: 'Dimas Prayoga', role: 'Mahasiswa', review: 'UI-nya paling enak dibanding app sejenis. Simple, cepat, dan gratis!', avatar: 'DP' },
              { name: 'Sarah Amalia', role: 'Ibu Rumah Tangga', review: 'Fitur budget-nya sangat membantu kontrol pengeluaran rumah tangga kami.', avatar: 'SA' },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">&ldquo;{t.review}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ────────────────────────────────────── */}
      <section id="pricing" className="py-20 bg-gray-50 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Harga Transparan</h2>
            <p className="mt-4 text-gray-500 text-lg">Mulai gratis, upgrade kapan saja</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Gratis</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">Rp 0</span>
                <span className="text-gray-400 text-sm ml-1">/bulan</span>
              </div>
              <ul className="mt-8 space-y-3">
                {['Transaksi unlimited', '3 dompet', 'Grafik dasar', 'Ekspor CSV'].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="mt-8 block text-center py-3 text-sm font-semibold text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors">
                Mulai Gratis
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-2xl p-8 border-2 border-indigo-600 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">Populer</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Pro</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">Rp 29K</span>
                <span className="text-gray-400 text-sm ml-1">/bulan</span>
              </div>
              <ul className="mt-8 space-y-3">
                {['Semua fitur Gratis', 'Dompet unlimited', 'Grafik advanced', 'AI Insight', 'OCR scan struk', 'Priority support'].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="mt-8 block text-center py-3 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors">
                Mulai Pro Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Mulai Kelola Keuanganmu Hari Ini
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            Gratis, tanpa ribet, tanpa kartu kredit.
          </p>
          <Link href="/register" className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
            Buat Akun Gratis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <Wallet className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-gray-600">CashflowKu</span>
          </div>
          <p>© 2026 CashflowKu. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
