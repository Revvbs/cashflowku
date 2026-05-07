import Link from 'next/link'
import {
  Wallet,
  PieChart,
  Receipt,
  TrendingUp,
  Camera,
  Check,
  ArrowRight,
  Shield,
  Smartphone,
  Zap,
  Star,
  Users,
  CreditCard,
  BarChart3,
} from 'lucide-react'

const features = [
  {
    icon: TrendingUp,
    title: 'Lacak Pengeluaran',
    description: 'Catat setiap transaksi harianmu dengan mudah. Kategorisasi otomatis dan pencarian cepat.',
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Wallet,
    title: 'Multi Wallet',
    description: 'Kelola beberapa dompet sekaligus — tunai, e-wallet, rekening bank, dan kartu kredit.',
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
  },
  {
    icon: PieChart,
    title: 'Grafik & Laporan',
    description: 'Visualisasi pengeluaran dengan grafik pie dan bar chart. Pahami kebiasaan belanjamu.',
    gradient: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50',
  },
  {
    icon: Camera,
    title: 'Scan Struk',
    description: 'Foto struk belanja dan biarkan AI kami mengisi data transaksi secara otomatis.',
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
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

const testimonials = [
  {
    name: 'Rina Wijaya',
    role: 'Freelancer',
    content: 'CashflowKu membantu saya melacak pengeluaran freelance yang sering berubah-ubah. Sangat praktis!',
    avatar: 'RW',
  },
  {
    name: 'Budi Santoso',
    role: 'Mahasiswa',
    content: 'Sebagai mahasiswa, aplikasi ini sangat membantu mengatur uang saku. UI-nya juga cantik dan mudah dipakai.',
    avatar: 'BS',
  },
  {
    name: 'Dewi Lestari',
    role: 'Ibu Rumah Tangga',
    content: 'Fitur multi wallet sangat berguna untuk memisahkan budget belanja, tabungan, dan dana darurat.',
    avatar: 'DL',
  },
]

const stats = [
  { value: '10K+', label: 'Pengguna Aktif' },
  { value: '500K+', label: 'Transaksi Dicatat' },
  { value: '4.9', label: 'Rating App Store' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Wallet className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">CashflowKu</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#fitur" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Fitur
              </a>
              <a href="#harga" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Harga
              </a>
              <a href="#testimoni" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Testimoni
              </a>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold gradient-primary text-white px-5 py-2 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-indigo-200"
              >
                Mulai Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/60" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-indigo-50/80 border border-indigo-100 text-indigo-700 text-xs font-semibold px-4 py-2 rounded-full mb-8 animate-fade-in">
              <Zap className="w-3.5 h-3.5" />
              Gratis selamanya untuk fitur dasar
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6 animate-fade-in-up">
              Kelola Keuangan{' '}
              <span className="gradient-text">dengan Mudah</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto animate-fade-in-up delay-100">
              Catat pengeluaran, kelola beberapa dompet, dan pahami kebiasaan belanjamu.
              Semua dalam satu aplikasi yang simpel dan indah.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 gradient-primary text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 hover:-translate-y-0.5"
              >
                Mulai Gratis
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#fitur"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                Lihat Fitur
              </a>
            </div>
          </div>

          {/* Hero Visual - Mock Dashboard */}
          <div className="mt-16 max-w-4xl mx-auto animate-fade-in-up delay-300">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-3xl blur-2xl transform scale-105" />

              <div className="relative bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {/* Balance card */}
                  <div className="gradient-emerald rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-emerald-100 text-xs font-medium">Total Saldo</p>
                      <Wallet className="w-5 h-5 text-emerald-200" />
                    </div>
                    <p className="text-2xl font-bold">Rp 12.450.000</p>
                    <p className="text-emerald-200 text-xs mt-1">+12% dari bulan lalu</p>
                  </div>

                  {/* Income card */}
                  <div className="gradient-blue rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-blue-100 text-xs font-medium">Pemasukan</p>
                      <TrendingUp className="w-5 h-5 text-blue-200" />
                    </div>
                    <p className="text-2xl font-bold">Rp 8.500.000</p>
                    <p className="text-blue-200 text-xs mt-1">Bulan ini</p>
                  </div>

                  {/* Expense card */}
                  <div className="gradient-rose rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-rose-100 text-xs font-medium">Pengeluaran</p>
                      <CreditCard className="w-5 h-5 text-rose-200" />
                    </div>
                    <p className="text-2xl font-bold">Rp 3.200.000</p>
                    <p className="text-rose-200 text-xs mt-1">-8% dari bulan lalu</p>
                  </div>
                </div>

                {/* Transactions list mock */}
                <div className="space-y-2">
                  {[
                    { name: 'Grab Food', amount: '-Rp 85.000', cat: 'Makanan', color: '#f59e0b' },
                    { name: 'Gopay Top Up', amount: '-Rp 200.000', cat: 'Transfer', color: '#3b82f6' },
                    { name: 'Gaji Bulanan', amount: '+Rp 8.500.000', cat: 'Pendapatan', color: '#10b981' },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{t.name}</p>
                          <p className="text-xs text-gray-400">{t.cat}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold ${t.amount.startsWith('+') ? 'text-emerald-600' : 'text-gray-700'}`}>
                        {t.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold gradient-text">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="fitur" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            Fitur Unggulan
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Yang Kamu Butuhkan,{' '}
            <span className="gradient-text">Semua Ada</span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-lg">
            Alat lengkap untuk mengelola keuangan pribadi, dari pencatatan harian hingga analisis mendalam.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="group bg-white border border-gray-100 rounded-2xl p-7 card-hover"
            >
              <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <f.icon className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why section */}
      <section className="bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Kenapa <span className="gradient-text">CashflowKu?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: Smartphone, title: 'Mobile-First', desc: 'Dirancang untuk layar kecil. Catat transaksi kapan saja, di mana saja.', gradient: 'from-blue-500 to-cyan-500' },
              { icon: Shield, title: 'Aman & Privat', desc: 'Data terenkripsi dan tersimpan aman. Kami tidak menjual data kamu.', gradient: 'from-emerald-500 to-teal-500' },
              { icon: Zap, title: 'Cepat & Ringan', desc: 'Tanpa iklan, tanpa bloat. Aplikasi yang langsung responsif.', gradient: 'from-amber-500 to-orange-500' },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimoni" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <Star className="w-3.5 h-3.5" />
            Testimoni
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Dipercaya <span className="gradient-text">Ribuan Pengguna</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 card-hover">
              <div className="flex items-center gap-0.5 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-5">&ldquo;{t.content}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-semibold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="harga" className="bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Harga <span className="gradient-text">Transparan</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto text-lg">
              Mulai gratis. Upgrade ke Pro kapan saja untuk fitur lebih lengkap.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <div className="bg-white border border-gray-200 rounded-2xl p-7 card-hover">
              <p className="text-sm font-semibold text-gray-500 mb-2">Free</p>
              <p className="text-4xl font-extrabold text-gray-900 mb-1">Gratis</p>
              <p className="text-sm text-gray-400 mb-7">Selamanya</p>
              <ul className="space-y-3 mb-8">
                {freeFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full text-center bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 text-sm"
              >
                Daftar Sekarang
              </Link>
            </div>

            {/* Pro */}
            <div className="relative bg-white border-2 border-indigo-500 rounded-2xl p-7 shadow-xl shadow-indigo-100 card-hover">
              <div className="absolute -top-3.5 right-6 gradient-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-indigo-200">
                Populer
              </div>
              <p className="text-sm font-semibold gradient-text mb-2">Pro</p>
              <div className="flex items-baseline gap-1 mb-1">
                <p className="text-4xl font-extrabold text-gray-900">Rp 39K</p>
                <span className="text-sm font-medium text-gray-400">/bulan</span>
              </div>
              <p className="text-sm text-gray-400 mb-7">Bayar bulanan, batalkan kapan saja</p>
              <ul className="space-y-3 mb-8">
                {proFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full text-center gradient-primary text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all duration-200 text-sm shadow-lg shadow-indigo-200"
              >
                Mulai Pro Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary animate-gradient" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Mulai Kelola Keuanganmu Hari Ini
          </h2>
          <p className="text-indigo-200 mb-8 max-w-lg mx-auto text-lg">
            Gratis, tanpa kartu kredit. Butuh waktu kurang dari 1 menit untuk mulai.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition-all duration-200 shadow-xl"
          >
            Buat Akun Gratis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">CashflowKu</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-gray-500">
              <a href="#fitur" className="hover:text-gray-900 transition-colors">Fitur</a>
              <a href="#harga" className="hover:text-gray-900 transition-colors">Harga</a>
              <a href="#testimoni" className="hover:text-gray-900 transition-colors">Testimoni</a>
              <Link href="/login" className="hover:text-gray-900 transition-colors">Login</Link>
            </div>
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} CashflowKu. Semua hak dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
