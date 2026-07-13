/**
 * ============================================
 * Layout Khusus Area Admin (Protected)
 * ============================================
 * 
 * Layout ini memproteksi semua sub-route di bawah group (protected),
 * seperti dashboard dan halaman CRUD.
 * 
 * Halaman login (/admin/login) berada di luar group ini sehingga tidak
 * terpengaruh oleh pengecekan status login di sini.
 */

'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AdminSidebar from '@/components/AdminSidebar'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { status } = useSession()
  const router = useRouter()

  // Proteksi client-side cadangan
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  // Tampilkan layar loading saat memeriksa status autentikasi
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#A855F7]/20 border-t-[#A855F7] animate-spin" />
        <p className="text-gray-400 text-sm">Memuat halaman admin...</p>
      </div>
    )
  }

  // Jika tidak memiliki izin masuk, kembalikan null karena redirect sedang berjalan
  if (status === 'unauthenticated') return null

  return (
    <div className="min-h-screen bg-[#030712] text-white flex">
      {/* Sidebar Admin */}
      <AdminSidebar />
      
      {/* Container Konten Utama */}
      <main className="flex-grow lg:pl-64 min-h-screen">
        <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  )
}
