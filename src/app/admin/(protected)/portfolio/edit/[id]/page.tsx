/**
 * ============================================
 * Halaman Edit Portfolio (Update)
 * ============================================
 * 
 * Halaman form khusus untuk admin untuk mengubah data foto/video yang sudah ada (multiple upload).
 */

'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MediaUpload from '@/components/MediaUpload'

export default function EditPortfolio({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params) as { id: string }
  const id = resolvedParams.id
  
  const router = useRouter()

  // State isian form
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('photo')
  const [mediaUrls, setMediaUrls] = useState<string[]>([])
  const [thumbnailUrls, setThumbnailUrls] = useState<string[]>([])
  const [tagsInput, setTagsInput] = useState('')
  const [featured, setFeatured] = useState(false)
  
  // State tracking pemuatan data awal & penyimpanan
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Memuat data lama dari database berdasarkan ID
  useEffect(() => {
    async function loadPortfolioDetail() {
      try {
        const response = await fetch(`/api/portfolio/${id}`)
        if (response.ok) {
          const data = await response.json()
          setTitle(data.title)
          setDescription(data.description || '')
          setCategory(data.category)
          setMediaUrls(data.mediaUrls || [])
          setThumbnailUrls(data.thumbnailUrls || [])
          setTagsInput(data.tags ? data.tags.join(', ') : '')
          setFeatured(data.featured)
        } else {
          router.push('/admin/dashboard')
        }
      } catch (err) {
        console.error('Gagal memuat detail portfolio:', err)
        router.push('/admin/dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    loadPortfolioDetail()
  }, [id, router])

  /**
   * Callback ketika file diunggah/diperbarui oleh MediaUpload.
   */
  const handleUploadComplete = (data: { urls: string[]; thumbnailUrls: string[] }) => {
    setMediaUrls(data.urls)
    setThumbnailUrls(data.thumbnailUrls)
  }

  /**
   * Handler submit form untuk mengupdate data.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (mediaUrls.length === 0) {
      setError('Anda harus mengupload minimal satu foto atau video!')
      return
    }

    setIsSubmitting(true)

    // Bersihkan spasi dan pisah berdasarkan koma
    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '')

    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'PUT',
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
        alert('Karya portfolio berhasil diperbarui!')
        router.push('/admin/dashboard')
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || 'Gagal memperbarui portfolio')
      }
    } catch (err) {
      console.error('Error saat menyimpan:', err)
      setError('Terjadi kesalahan koneksi saat menyimpan perubahan.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#A855F7]/20 border-t-[#A855F7] animate-spin" />
        <p className="text-gray-400 text-sm">Memuat data portfolio lama...</p>
      </div>
    )
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
          <h1 className="text-3xl font-extrabold tracking-tight">Edit Karya Portfolio</h1>
          <p className="text-gray-400 text-sm">Ubah detail dan file media di bawah.</p>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Upload Media (1/3 Kolom) */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-[#1E1B4B]/10 border border-white/5 space-y-4">
            <h3 className="text-sm font-semibold uppercase text-gray-400 tracking-wider">File Media</h3>
            
            {/* Widget Media Upload dengan mediaUrls saat ini sebagai preview awal */}
            <MediaUpload
              onUploadComplete={handleUploadComplete}
              currentMediaUrls={mediaUrls}
              category={category}
            />
            
            <p className="text-xs text-gray-500 mt-2">
              Unggah file baru jika ingin menambahkan atau mengurangi file media portofolio ini.
            </p>
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
                onChange={(e) => setCategory(e.target.value)}
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
                placeholder="Tuliskan cerita di balik karya atau spesifikasi teknis..."
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
              <p className="text-xs text-gray-500 mt-1">Tags dipisahkan koma untuk memudahkan kategorisasi pencarian.</p>
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
                  'Perbarui Karya'
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  )
}
