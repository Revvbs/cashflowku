import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CashflowKu - Kelola Keuangan Pribadi',
  description: 'Catat pengeluaran, pantau budget, dan kelola keuangan pribadi Anda dengan mudah.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="font-sans">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
