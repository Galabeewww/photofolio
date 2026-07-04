/**
 * ============================================
 * Halaman Login Admin
 * ============================================
 * 
 * Halaman login khusus untuk admin.
 * Fitur:
 * 1. Form Email & Password dengan visual premium.
 * 2. Integrasi NextAuth.js client-side (`signIn`).
 * 3. Feedback visual: loading spinner saat memproses dan alertbox jika login gagal.
 * 4. Redirect otomatis ke dashboard admin jika berhasil.
 */

'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLogin() {
  const router = useRouter()
  
  // State menyimpan isian form
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // State status loading proses login
  const [isLoading, setIsLoading] = useState(false)
  
  // State menyimpan pesan kesalahan (jika ada)
  const [error, setError] = useState<string | null>(null)

  /**
   * Handler untuk submit login form.
   * Mengirim kredensial ke NextAuth credentials provider.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Panggil provider credentials NextAuth
      const result = await signIn('credentials', {
        redirect: false, // Jangan redirect otomatis agar bisa ditangani manual
        email,
        password,
      })

      if (result?.error) {
        // Tampilkan pesan error jika login ditolak
        setError(result.error)
      } else {
        // Arahkan ke dashboard jika login berhasil
        router.push('/admin/dashboard')
        router.refresh() // Paksa refresh router agar session terbaru terbaca
      }
    } catch (err) {
      console.error('Error saat login:', err)
      setError('Terjadi kesalahan sistem. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#00224D] flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Dekorasi Cahaya Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(93,14,65,0.3)_0%,rgba(0,34,77,1)_70%)] z-0" />
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#FF204E]/10 blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#A0153E]/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md bg-[#5D0E41]/10 border border-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl space-y-6">
        
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center justify-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF204E] to-[#A0153E] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Lens<span className="text-[#FF204E]">Folio</span>
            </span>
          </Link>
          <h2 className="text-lg font-medium text-gray-300">Masuk sebagai Administrator</h2>
        </div>

        {/* Notifikasi Error */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-2 items-start animate-in fade-in slide-in-from-top-2 duration-300">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Alamat Email</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@photography.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 pl-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF204E] focus:ring-1 focus:ring-[#FF204E] transition-all"
              />
              <svg className="w-5 h-5 text-gray-500 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
              </svg>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pl-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF204E] focus:ring-1 focus:ring-[#FF204E] transition-all"
              />
              <svg className="w-5 h-5 text-gray-500 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-[#FF204E] to-[#A0153E] text-white hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                Memproses masuk...
              </>
            ) : (
              'Masuk Panel Admin'
            )}
          </button>
        </form>

        {/* Link Kembali Ke Web Publik */}
        <div className="text-center">
          <Link href="/" className="text-xs text-gray-500 hover:text-white transition-colors">
            ← Kembali ke Website Utama
          </Link>
        </div>
      </div>
    </div>
  )
}
