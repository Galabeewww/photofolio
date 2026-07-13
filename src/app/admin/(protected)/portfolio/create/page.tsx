/**
 * ============================================
 * Halaman Tambah Portfolio Baru (Create)
 * ============================================
 * 
 * Halaman form khusus untuk admin untuk menambah foto/video baru (multiple upload).
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MediaUpload from '@/components/MediaUpload'

export default function CreatePortfolio() {
  const router = useRouter()

  // State isian form
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('photo') // default "photo"
  const [mediaUrls, setMediaUrls] = useState<string[]>([])
  const [thumbnailUrls, setThumbnailUrls] = useState<string[]>([])
  const [tagsInput, setTagsInput] = useState('') // input teks mentah dipisahkan koma
  const [featured, setFeatured] = useState(false)
  
  // State proses penyimpanan
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Callback yang dijalankan ketika file berhasil diupload oleh MediaUpload.
   */
  const handleUploadComplete = (data: { urls: string[]; thumbnailUrls: string[] }) => {
    setMediaUrls(data.urls)
    setThumbnailUrls(data.thumbnailUrls)
  }

  /**
   * Handler untuk men-submit form.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validasi media
    if (mediaUrls.length === 0) {
      setError('Anda harus mengupload minimal satu foto atau video terlebih dahulu!')
      return
    }

    setIsSubmitting(true)

    // Bersihkan tag dari spasi dan pisah berdasarkan koma
    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '')

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || null,
          category,
          mediaUrls,
          thumbnailUrls,
          tags,
          featured,
        }),
      })

      if (response.ok) {
        alert('Karya portfolio berhasil ditambahkan!')
        router.push('/admin/dashboard')
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || 'Gagal menambahkan portfolio baru')
      }
    } catch (err) {
      console.error('Error saat menyimpan:', err)
      setError('Terjadi kesalahan koneksi saat menyimpan data.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Halaman */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/dashboard"
          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Tambah Karya Baru</h1>
          <p className="text-gray-400 text-sm">Unggah media dan atur informasinya di sini.</p>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Upload Media (1/3 Kolom) */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-[#1E1B4B]/10 border border-white/5 space-y-4">
            <h3 className="text-sm font-semibold uppercase text-gray-400 tracking-wider">File Media</h3>
            
            {/* Widget Media Upload */}
            <MediaUpload
              onUploadComplete={handleUploadComplete}
              currentMediaUrls={mediaUrls}
              category={category}
            />
            
            {mediaUrls.length > 0 && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
                ✅ {mediaUrls.length} file berhasil diunggah!
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Form Data (2/3 Kolom) */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[#1E1B4B]/10 border border-white/5 space-y-6">
            
            {/* Tampilan Error */}
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-2 items-start">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Input Judul */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Judul Karya</label>
              <input
                type="text"
                required
                placeholder="Contoh: Sunset di Pantai Kuta"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] transition-all"
              />
            </div>

            {/* Dropdown Kategori */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Kategori Media</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value)
                  // Reset URL media jika ganti tipe agar terupload ulang
                  setMediaUrls([])
                  setThumbnailUrls([])
                }}
                className="w-full px-4 py-3 rounded-xl bg-[#030712] border border-white/10 text-white focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] transition-all"
              >
                <option value="photo">Foto (Photography)</option>
                <option value="video">Video (Videography)</option>
              </select>
            </div>

            {/* Input Deskripsi */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Deskripsi / Detail Project</label>
              <textarea
                rows={4}
                placeholder="Tuliskan cerita di balik karya atau spesifikasi teknis (opsional)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] transition-all resize-none"
              />
            </div>

            {/* Input Tags */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tags (Pisahkan dengan koma)</label>
              <input
                type="text"
                placeholder="Contoh: wedding, cinematic, portrait, travel"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">Tags digunakan untuk membantu pencarian dan pengelompokan portofolio.</p>
            </div>

            {/* Checkbox Featured */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-5 h-5 rounded border-white/10 text-[#A855F7] focus:ring-[#A855F7] bg-transparent"
              />
              <div>
                <label htmlFor="featured" className="text-sm font-semibold text-white block cursor-pointer">
                  Tampilkan sebagai Karya Unggulan (Featured)
                </label>
                <span className="text-xs text-gray-500">Karya ini akan ditampilkan secara khusus di Halaman Utama (Beranda).</span>
              </div>
            </div>

            {/* Tombol Aksi Form */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
              <Link
                href="/admin/dashboard"
                className="px-5 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-white transition-colors"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#A855F7] to-[#7C3AED] text-white hover:opacity-90 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Karya'
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  )
}
