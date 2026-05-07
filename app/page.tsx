import Link from 'next/link'
import {
  Wallet,
  PieChart,
  TrendingUp,
  Camera,
  Check,
  ArrowRight,
  Shield,
  Smartphone,
  Zap,
  Star,
  Users,
  BarChart3,
  Heart,
  Repeat,
  Target,
} from 'lucide-react'

const features = [
  {
    icon: TrendingUp,
    title: 'Lacak Pengeluaran',
    description: 'Catat setiap transaksi harianmu dengan mudah. Kategorisasi otomatis dan pencarian cepat.',
    color: '#3B82F6',
    bg: '#EFF6FF',
  },
  {
    icon: Wallet,
    title: 'Multi Wallet',
    description: 'Kelola beberapa dompet sekaligus — tunai, e-wallet, rekening bank, dan kartu kredit.',
    color: '#8B5CF6',
    bg: '#F5F3FF',
  },
  {
    icon: PieChart,
    title: 'Grafik & Laporan',
    description: 'Visualisasi pengeluaranmu dalam grafik yang jelas. Pahami ke mana uangmu pergi.',
    color: '#059669',
    bg: '#ECFDF5',
  },
  {
    icon: Target,
    title: 'Budget & Target',
    description: 'Tetapkan budget per kategori dan target tabungan. Pantau progress secara real-time.',
    color: '#F59E0B',
    bg: '#FFFBEB',
  },
  {
    icon: Heart,
    title: 'Kesehatan Finansial',
    description: 'Skor keuangan pribadi berdasarkan tabungan, budget, dan tren pengeluaranmu.',
    color: '#EF4444',
    bg: '#FEF2F2',
  },
  {
    icon: Repeat,
    title: 'Tracker Langganan',
    description: 'Pantau semua langgananmu — Netflix, Spotify, dan lainnya. Jangan sampai boncos.',
    color: '#EC4899',
    bg: '#FDF2F8',
  },
]

const stats = [
  { value: '10K+', label: 'Pengguna Aktif' },
  { value: '500K+', label: 'Transaksi Tercatat' },
  { value: '4.9', label: 'Rating App' },
  { value: '100%', label: 'Gratis Fitur Dasar' },
]

const testimonials = [
  {
    name: 'Rina Wijaya',
    role: 'Freelancer',
    text: 'Akhirnya ada app keuangan yang simpel dan gak ribet. Fitur budget-nya ngebantu banget buat kontrol pengeluaran.',
    avatar: 'RW',
  },
  {
    name: 'Budi Santoso',
    role: 'Mahasiswa',
    text: 'Dulu nyatet di excel, sekarang pake CashflowKu. Lebih praktis dan grafiknya jelas banget.',
    avatar: 'BS',
  },
  {
    name: 'Dewi Lestari',
    role: 'Ibu Rumah Tangga',
    text: 'Fitur multi wallet sangat membantu. Bisa pisahin uang belanja, tabungan, dan dana darurat.',
    avatar: 'DL',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Navbar ───────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1E40AF] flex items-center justify-center">
                <span className="text-white font-bold text-sm">CK</span>
              </div>
              <span className="text-lg font-bold text-gray-900">CashflowKu</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Fitur</a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Harga</a>
              <a href="#testimonials" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Testimoni</a>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Masuk
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-[#1E40AF] text-white text-sm font-semibold hover:bg-[#1E3A8A] transition-all hover:shadow-lg hover:shadow-blue-500/20"
              >
                Daftar Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
              <span className="text-xs font-medium text-[#1E40AF]">Gratis selamanya untuk fitur dasar</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
              Kelola Keuangan{' '}
              <span className="text-[#1E40AF]">dengan Mudah</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Catat pengeluaran, kelola beberapa dompet, dan pahami kebiasaan belanjamu.
              Semua dalam satu aplikasi yang simpel dan indah.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#1E40AF] text-white font-semibold hover:bg-[#1E3A8A] transition-all hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5"
              >
                Mulai Gratis
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-gray-700 font-semibold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                Lihat Fitur
              </a>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 sm:mt-20 max-w-4xl mx-auto">
            <div className="relative rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/50 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-gray-400">cashflowku-75o.pages.dev/dashboard</span>
              </div>
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Saldo', value: 'Rp 12.450.000', color: '#1E40AF', bg: '#EFF6FF' },
                    { label: 'Pemasukan', value: 'Rp 8.500.000', color: '#059669', bg: '#ECFDF5' },
                    { label: 'Pengeluaran', value: 'Rp 3.200.000', color: '#EF4444', bg: '#FEF2F2' },
                    { label: 'Tabungan', value: 'Rp 5.300.000', color: '#8B5CF6', bg: '#F5F3FF' },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl p-4" style={{ background: stat.bg }}>
                      <p className="text-xs font-medium text-gray-500">{stat.label}</p>
                      <p className="mt-1 text-lg font-bold" style={{ color: stat.color }}>{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 h-48 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 text-gray-300 mx-auto" />
                    <p className="mt-2 text-sm text-gray-400">Grafik pengeluaran bulanan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold text-gray-900">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section id="features" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-[#1E40AF] tracking-wide uppercase">Fitur</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Yang Kamu Butuhkan, Semua Ada
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Fitur lengkap untuk mengelola keuangan pribadimu, dari yang dasar sampai yang advanced.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-gray-100 bg-white p-6 hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: feature.bg }}
                  >
                    <Icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Why Us ───────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Kenapa CashflowKu?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Smartphone,
                title: 'Mobile-First',
                desc: 'Dirancang untuk HP. Catat transaksi di mana saja, kapan saja.',
              },
              {
                icon: Shield,
                title: 'Aman & Privat',
                desc: 'Data terenkripsi. Tidak dijual ke pihak ketiga. 100% milikmu.',
              },
              {
                icon: Zap,
                title: 'Cepat & Ringan',
                desc: 'Loading instan. Tidak bikin HP lemot. Hemat kuota.',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#1E40AF] flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section id="testimonials" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-[#1E40AF] tracking-wide uppercase">Testimoni</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Apa Kata Mereka
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-gray-100 bg-white p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1E40AF] flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────── */}
      <section id="pricing" className="py-20 bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-[#1E40AF] tracking-wide uppercase">Harga</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Harga Transparan
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Mulai gratis. Upgrade kapan saja kalau butuh fitur lebih.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
              <h3 className="text-lg font-bold text-gray-900">Gratis</h3>
              <p className="mt-1 text-sm text-gray-500">Untuk penggunaan sehari-hari</p>
              <div className="mt-6">
                <span className="text-4xl font-extrabold text-gray-900">Rp 0</span>
                <span className="text-sm text-gray-500">/bulan</span>
              </div>
              <ul className="mt-8 space-y-3">
                {['Transaksi unlimited', '3 dompet', 'Kategori custom', 'Grafik dasar', 'Laporan bulanan'].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-[#059669] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-8 block w-full text-center py-3 rounded-xl bg-gray-100 text-gray-900 font-semibold hover:bg-gray-200 transition-colors"
              >
                Daftar Sekarang
              </Link>
            </div>

            {/* Pro */}
            <div className="relative rounded-2xl border-2 border-[#1E40AF] bg-white p-8 shadow-lg shadow-blue-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="inline-block px-3 py-1 rounded-full bg-[#1E40AF] text-white text-xs font-semibold">
                  Populer
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Pro</h3>
              <p className="mt-1 text-sm text-gray-500">Untuk power user</p>
              <div className="mt-6">
                <span className="text-4xl font-extrabold text-gray-900">Rp 29K</span>
                <span className="text-sm text-gray-500">/bulan</span>
              </div>
              <ul className="mt-8 space-y-3">
                {[
                  'Semua fitur Gratis',
                  'Dompet unlimited',
                  'Grafik advanced',
                  'AI spending insights',
                  'Scan struk (OCR)',
                  'Export CSV/PDF',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-[#059669] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-8 block w-full text-center py-3 rounded-xl bg-[#1E40AF] text-white font-semibold hover:bg-[#1E3A8A] transition-colors"
              >
                Mulai Pro Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Mulai Kelola Keuanganmu Hari Ini
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Gratis, tanpa kartu kredit. Butuh 30 detik untuk daftar.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#1E40AF] text-white font-semibold text-lg hover:bg-[#1E3A8A] transition-all hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5"
          >
            Buat Akun Gratis
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#1E40AF] flex items-center justify-center">
                <span className="text-white font-bold text-xs">CK</span>
              </div>
              <span className="text-sm font-bold text-gray-900">CashflowKu</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Fitur</a>
              <a href="#pricing" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Harga</a>
              <a href="#testimonials" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Testimoni</a>
              <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Login</Link>
            </div>
            <p className="text-xs text-gray-400">&copy; 2026 CashflowKu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
