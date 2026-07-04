/**
 * ============================================
 * Halaman Galeri Publik
 * ============================================
 * 
 * Halaman ini menampilkan semua data portfolio (foto & video).
 * Fitur:
 * 1. Filter Kategori: Tombol filter "Semua", "Foto", dan "Video".
 * 2. Pencarian: Input teks untuk mencari judul portfolio secara real-time.
 * 3. Responsive Grid: Grid layout modern dengan animasi halus ketika dihover.
 * 4. Integrasi Lightbox: Klik gambar/video akan memicu pop-up fullscreen detail media.
 * 
 * Merupakan Client Component karena memerlukan state interaktif (filter & search).
 */

'use client'

import { useState, useEffect } from 'react'
import PortfolioCard from '@/components/PortfolioCard'

// Representasi struktur data portfolio
interface PortfolioItem {
  id: string
  title: string
  description?: string | null
  category: string
  mediaUrls: string[]
  thumbnailUrls: string[]
  tags: string[]
}

export default function Gallery() {
  // State untuk menyimpan daftar portfolio dari API
  const [items, setItems] = useState<PortfolioItem[]>([])
  
  // State untuk melacak kategori filter yang aktif ("all", "photo", "video")
  const [activeCategory, setActiveCategory] = useState('all')
  
  // State untuk input pencarian
  const [searchQuery, setSearchQuery] = useState('')
  
  // State indikator loading data
  const [isLoading, setIsLoading] = useState(true)

  // Ambil data portfolio dari API saat halaman pertama kali dibuka
  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const response = await fetch('/api/portfolio')
        if (response.ok) {
          const data = await response.json()
          setItems(data)
        }
      } catch (error) {
        console.error('Gagal memuat portfolio:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPortfolio()
  }, [])

  // Memfilter item berdasarkan kategori aktif dan query pencarian
  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#00224D] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Galeri */}
        <div className="text-center space-y-4">
          <span className="text-[#FF204E] text-sm font-semibold uppercase tracking-wider">Koleksi Karya</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Galeri Karya</h1>
          <p className="max-w-2xl mx-auto text-gray-400 font-light">
            Menampilkan jepretan momen tak terlupakan serta rekaman video sinematik terbaik kami. Gunakan filter di bawah untuk memilah karya.
          </p>
        </div>

        {/* Filter dan Pencarian Panel */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-4 rounded-2xl bg-[#5D0E41]/10 border border-white/5 backdrop-blur-md">
          {/* Filter Kategori */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'Semua Karya' },
              { id: 'photo', label: 'Foto' },
              { id: 'video', label: 'Video' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeCategory === tab.id
                    ? 'bg-gradient-to-r from-[#FF204E] to-[#A0153E] text-white shadow-lg shadow-[#FF204E]/20'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Input Pencarian */}
          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder="Cari judul atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 pl-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF204E] focus:ring-1 focus:ring-[#FF204E] transition-all"
            />
            {/* Ikon Kaca Pembesar */}
            <svg className="w-5 h-5 text-gray-500 absolute left-4 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Tampilan Grid Galeri */}
        {isLoading ? (
          // Spinner Loading
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-[#FF204E]/20 border-t-[#FF204E] animate-spin" />
            <p className="text-gray-400 text-sm animate-pulse">Memuat galeri karya...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          // Galeri Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <PortfolioCard
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                category={item.category}
                mediaUrls={item.mediaUrls}
                thumbnailUrls={item.thumbnailUrls}
                tags={item.tags}
              />
            ))}
          </div>
        ) : (
          // Jika Tidak Ada Hasil
          <div className="text-center py-32 bg-[#5D0E41]/10 rounded-2xl border border-white/5">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">Karya Tidak Ditemukan</h3>
            <p className="text-gray-400 max-w-sm mx-auto text-sm">
              Tidak ada portfolio yang cocok dengan filter atau pencarian Anda. Silakan coba kata kunci lain.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
