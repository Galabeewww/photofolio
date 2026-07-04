/**
 * ============================================
 * Halaman Detail Portfolio (Slideshow)
 * ============================================
 * 
 * Halaman ini menampilkan semua media (foto/video) dari satu portfolio.
 * Fitur:
 * 1. Slideshow: Jika ada lebih dari 1 foto, tampilkan slideshow dengan navigasi prev/next.
 * 2. Thumbnail Strip: Baris thumbnail kecil untuk navigasi cepat antar media.
 * 3. Lightbox: Klik media untuk membuka fullscreen slideshow.
 * 4. Metadata View: Menampilkan judul, deskripsi, tag, dan tanggal upload.
 * 5. Navigasi: Tombol kembali ke galeri.
 */

'use client'

import { useState, useEffect, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Lightbox from '@/components/Lightbox'

interface PortfolioItem {
  id: string
  title: string
  description?: string | null
  category: string
  mediaUrls: string[]
  thumbnailUrls: string[]
  tags: string[]
  createdAt: string
}

export default function GalleryDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params) as { id: string }
  const id = resolvedParams.id

  const router = useRouter()
  
  const [item, setItem] = useState<PortfolioItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0) // Indeks slide aktif

  // Fetch detail data berdasarkan ID
  useEffect(() => {
    async function fetchDetail() {
      try {
        const response = await fetch(`/api/portfolio/${id}`)
        if (response.ok) {
          const data = await response.json()
          setItem(data)
        } else {
          router.push('/gallery')
        }
      } catch (error) {
        console.error('Gagal mengambil detail portfolio:', error)
        router.push('/gallery')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetail()
  }, [id, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#00224D] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#FF204E]/20 border-t-[#FF204E] animate-spin" />
        <p className="text-gray-400 text-sm">Memuat detail media...</p>
      </div>
    )
  }

  if (!item) return null

  const mediaUrls = item.mediaUrls || []
  const totalMedia = mediaUrls.length

  // Format tanggal upload
  const uploadDate = new Date(item.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Navigasi slideshow
  const goToPrev = () => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : totalMedia - 1))
  const goToNext = () => setCurrentSlide((prev) => (prev < totalMedia - 1 ? prev + 1 : 0))

  const currentUrl = mediaUrls[currentSlide] || ''
  const isVideo = item.category === 'video' || currentUrl.includes('/video/upload/')

  return (
    <div className="min-h-screen bg-[#00224D] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Tombol Kembali */}
        <div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Galeri
          </Link>
        </div>

        {/* Layout Detail Utama */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sisi Kiri: Media Display dengan Slideshow (2/3 Kolom) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Media Utama */}
            <div className="relative rounded-2xl overflow-hidden bg-[#5D0E41]/20 border border-white/10 group aspect-video lg:aspect-auto lg:h-[60vh] flex items-center justify-center">
              {isVideo ? (
                <video
                  key={currentUrl}
                  src={currentUrl}
                  controls
                  className="w-full h-full max-h-[60vh] object-contain"
                >
                  Browser Anda tidak mendukung tag video.
                </video>
              ) : (
                <div className="relative w-full h-full min-h-[40vh] lg:min-h-[50vh]">
                  <Image
                    key={currentUrl}
                    src={currentUrl}
                    alt={`${item.title} - ${currentSlide + 1}`}
                    fill
                    priority
                    className="object-contain"
                  />
                </div>
              )}

              {/* Tombol Navigasi Prev/Next — hanya jika lebih dari 1 media */}
              {totalMedia > 1 && (
                <>
                  <button
                    onClick={goToPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#00224D]/70 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#FF204E]"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#00224D]/70 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#FF204E]"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Counter Slide */}
                  <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-[#00224D]/70 backdrop-blur-md text-white text-xs font-medium">
                    {currentSlide + 1} / {totalMedia}
                  </div>
                </>
              )}

              {/* Tombol Layar Penuh */}
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-4 right-4 p-3 rounded-xl bg-[#00224D]/80 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#FF204E]"
                title="Perbesar Gambar"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
              </button>
            </div>

            {/* Thumbnail Strip — hanya jika ada lebih dari 1 media */}
            {totalMedia > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {mediaUrls.map((url, idx) => {
                  const thumbIsVideo = url.includes('/video/upload/')
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        idx === currentSlide
                          ? 'border-[#FF204E] ring-1 ring-[#FF204E]/50'
                          : 'border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'
                      }`}
                    >
                      {thumbIsVideo ? (
                        <div className="w-full h-full bg-[#5D0E41]/40 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      ) : (
                        <Image
                          src={url}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Sisi Kanan: Deskripsi & Metadata (1/3 Kolom) */}
          <div className="p-6 rounded-2xl bg-[#5D0E41]/10 border border-white/5 space-y-6 h-fit">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  item.category === 'video' ? 'bg-[#FF204E]/20 text-[#FF204E]' : 'bg-white/10 text-white'
                }`}>
                  {item.category === 'video' ? 'Video Project' : 'Photography'}
                </span>
                {totalMedia > 1 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#00224D] text-gray-300 border border-white/10">
                    {totalMedia} Media
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{item.title}</h1>
              <p className="text-xs text-gray-500">Diunggah pada {uploadDate}</p>
            </div>

            {item.description && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Deskripsi Karya</h3>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{item.description}</p>
              </div>
            )}

            {/* Bagian Tagging */}
            {item.tags.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Tags / Kategori</h3>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Lightbox fullscreen modal dengan slideshow */}
      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        mediaUrls={mediaUrls}
        category={item.category}
        title={item.title}
        startIndex={currentSlide}
      />
    </div>
  )
}
