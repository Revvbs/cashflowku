'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  PiggyBank,
  Repeat,
  Heart,
  ChevronLeft,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transaksi', label: 'Transaksi', icon: ArrowLeftRight },
  { href: '/wallets', label: 'Dompet', icon: Wallet },
  { href: '/budget', label: 'Budget & Target', icon: PiggyBank },
  { href: '/subscriptions', label: 'Langganan', icon: Repeat },
  { href: '/health', label: 'Kesehatan Finansial', icon: Heart },
  { href: '/reports', label: 'Laporan', icon: BarChart3 },
  { href: '/pengaturan', label: 'Pengaturan', icon: Settings },
]

const bottomNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transaksi', label: 'Transaksi', icon: ArrowLeftRight },
  { href: '/wallets', label: 'Dompet', icon: Wallet },
  { href: '/reports', label: 'Laporan', icon: BarChart3 },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [plan, setPlan] = useState<'free' | 'pro'>('free')
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email ?? '')
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', user.id)
          .single()
        if (profile) {
          setPlan(profile.plan === 'pro' ? 'pro' : 'free')
        }
      }
    }
    loadUser()
  }, [supabase])

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 transition-all duration-300 ${
          collapsed ? 'lg:w-20' : 'lg:w-64'
        }`}
      >
        <div className="flex flex-col h-full bg-white border-r border-gray-100 shadow-sm">
          {/* Logo */}
          <div className={`flex items-center h-16 border-b border-gray-100 ${collapsed ? 'justify-center px-4' : 'gap-2.5 px-6'}`}>
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
              <span className="text-white font-bold text-sm">CK</span>
            </div>
            {!collapsed && (
              <span className="text-lg font-bold text-gray-900">CashflowKu</span>
            )}
          </div>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute top-5 -right-3 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'gradient-primary text-white shadow-lg shadow-indigo-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } ${collapsed ? 'justify-center' : ''}`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          {/* User Info + Logout */}
          <div className="border-t border-gray-100 px-3 py-4">
            <div className={`flex items-center gap-3 px-3 mb-3 ${collapsed ? 'justify-center' : ''}`}>
              <div className="w-9 h-9 rounded-full p-0.5 bg-gradient-to-br from-indigo-500 to-purple-500 shrink-0">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold text-sm">
                    {userEmail ? userEmail[0].toUpperCase() : '?'}
                  </span>
                </div>
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{userEmail}</p>
                  <span
                    className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                      plan === 'pro'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {plan === 'pro' ? 'Pro' : 'Free'}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors ${collapsed ? 'justify-center' : ''}`}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {!collapsed && <span>Keluar</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-indigo-200">
                <span className="text-white font-bold text-sm">CK</span>
              </div>
              <span className="text-lg font-bold text-gray-900">CashflowKu</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'gradient-primary text-white shadow-lg shadow-indigo-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-gray-100 px-3 py-4 bg-white">
            <div className="flex items-center gap-3 px-3 mb-3">
              <div className="w-9 h-9 rounded-full p-0.5 bg-gradient-to-br from-indigo-500 to-purple-500">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold text-sm">
                    {userEmail ? userEmail[0].toUpperCase() : '?'}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{userEmail}</p>
                <span
                  className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                    plan === 'pro'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {plan === 'pro' ? 'Pro' : 'Free'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* Mobile Top Bar */}
        <header className="sticky top-0 z-20 flex items-center h-16 px-4 bg-white/80 backdrop-blur-lg border-b border-gray-100 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-xl text-gray-600 hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 ml-3">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">CK</span>
            </div>
            <span className="text-base font-bold text-gray-900">CashflowKu</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="pb-20 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-lg border-t border-gray-100 lg:hidden">
        <div className="flex items-center justify-around h-16">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                  isActive ? 'text-indigo-600' : 'text-gray-400'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
