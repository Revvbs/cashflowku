'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts'
import { Lock } from 'lucide-react'

const COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6',
  '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#14b8a6',
]

function formatIDR(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/* ─── Pie Chart: Pengeluaran per Kategori ─── */
interface PieItem {
  name: string
  value: number
}

export function ExpensePieChart({ data }: { data: PieItem[] }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-gray-400">
        Tidak ada data pengeluaran.
      </div>
    )
  }

  const colored = data.map((d, i) => ({ ...d, fill: COLORS[i % COLORS.length] }))

  return (
    <div className="w-full" style={{ minHeight: 280 }}>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={colored}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            nameKey="name"
          >
            {colored.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatIDR(Number(value))}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => (
              <span className="text-xs text-gray-600">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ─── Bar Chart: Pemasukan vs Pengeluaran per Bulan ─── */
interface BarItem {
  month: string
  pemasukan: number
  pengeluaran: number
}

export function MonthlyBarChart({ data }: { data: BarItem[] }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-gray-400">
        Tidak ada data transaksi.
      </div>
    )
  }

  return (
    <div className="w-full" style={{ minHeight: 300 }}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickFormatter={(v: number) =>
              v >= 1_000_000
                ? `${(v / 1_000_000).toFixed(0)}jt`
                : v >= 1_000
                  ? `${(v / 1_000).toFixed(0)}rb`
                  : `${v}`
            }
          />
          <Tooltip
            formatter={(value, name) => [
              formatIDR(Number(value)),
              name === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran',
            ]}
          />
          <Legend
            formatter={(value: string) =>
              value === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'
            }
          />
          <Bar dataKey="pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="pengeluaran" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* ─── Line Chart: Trend Pengeluaran Harian (Pro) ─── */
interface TrendItem {
  day: string
  amount: number
}

export function DailyTrendChart({
  data,
  isPro,
}: {
  data: TrendItem[]
  isPro: boolean
}) {
  return (
    <div className="relative">
      {!isPro && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-2">
            <Lock className="w-4 h-4" />
            Fitur Pro
          </div>
          <p className="text-xs text-gray-500 text-center px-4">
            Upgrade ke Pro untuk melihat trend pengeluaran harian.
          </p>
        </div>
      )}

      <div className={!isPro ? 'blur-sm pointer-events-none select-none' : ''}>
        {data.length > 0 ? (
          <div className="w-full" style={{ minHeight: 280 }}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickFormatter={(v: number) =>
                    v >= 1_000_000
                      ? `${(v / 1_000_000).toFixed(0)}jt`
                      : v >= 1_000
                        ? `${(v / 1_000).toFixed(0)}rb`
                        : `${v}`
                  }
                />
                <Tooltip formatter={(value) => formatIDR(Number(value))} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#6366f1' }}
                  activeDot={{ r: 5 }}
                  name="Pengeluaran"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-sm text-gray-400">
            Tidak ada data pengeluaran bulan ini.
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Top 5 Kategori Table ─── */
interface TopCategory {
  name: string
  total: number
  percentage: number
  color: string
}

export function TopCategoriesTable({ data }: { data: TopCategory[] }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-gray-400">
        Tidak ada data kategori.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {data.map((cat, idx) => (
        <div key={cat.name} className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: cat.color }}>
            {idx + 1}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-900 truncate">{cat.name}</span>
              <span className="text-sm font-semibold text-gray-700 ml-2 whitespace-nowrap">
                {formatIDR(cat.total)}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min(cat.percentage, 100)}%`,
                  backgroundColor: cat.color,
                }}
              />
            </div>
          </div>
          <span className="text-xs text-gray-500 w-12 text-right">
            {cat.percentage.toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  )
}
