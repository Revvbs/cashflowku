'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus } from 'lucide-react'
import TransactionForm from './transaction-form'

interface Category {
  id: string
  name: string
  type: string
  icon: string | null
  color: string | null
}

interface Wallet {
  id: string
  name: string
  type: string
  icon: string | null
  color: string | null
}

interface AddTransactionButtonProps {
  categories: Category[]
  wallets: Wallet[]
  initialDate?: string
  showForm: boolean
}

export default function AddTransactionButton({
  categories,
  wallets,
  initialDate,
  showForm,
}: AddTransactionButtonProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(showForm)

  // Sync with URL param
  useEffect(() => {
    setIsOpen(showForm)
  }, [showForm])

  function handleOpen() {
    setIsOpen(true)
    const params = new URLSearchParams(searchParams.toString())
    params.set('action', 'tambah')
    router.push(`/transactions?${params.toString()}`, { scroll: false })
  }

  function handleClose() {
    setIsOpen(false)
    const params = new URLSearchParams(searchParams.toString())
    params.delete('action')
    const qs = params.toString()
    router.push(`/transactions${qs ? `?${qs}` : ''}`, { scroll: false })
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shrink-0"
      >
        <Plus className="w-4 h-4" />
        Tambah Transaksi
      </button>

      {isOpen && (
        <TransactionForm
          categories={categories}
          wallets={wallets}
          initialDate={initialDate}
          onClose={handleClose}
        />
      )}
    </>
  )
}
