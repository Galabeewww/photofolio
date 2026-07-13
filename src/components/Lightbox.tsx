/**
 * ============================================
 * Komponen Lightbox (Slideshow Support)
 * ============================================
 * 
 * Modal fullscreen untuk menampilkan media (foto/video)
 * dalam ukuran besar dengan fitur slideshow. Fitur:
 * - Overlay gelap semi-transparan
 * - Tombol close (X)
 * - Klik di luar konten untuk menutup
 * - Animasi fade-in
 * - Support untuk foto dan video player
 * - Slideshow navigasi prev/next jika lebih dari 1 media
 * - Keyboard navigation (Arrow Left/Right, Escape)
 * - Indikator posisi slide saat ini
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { checkIsVideo, getOptimizedVideoUrl } from '@/lib/utils'

interface LightboxProps {
  isOpen: boolean          // Status buka/tutup lightbox
  onClose: () => void      // Fungsi untuk menutup lightbox
  mediaUrls: string[]      // Array URL media yang ditampilkan
  category: string         // Tipe media: "photo" atau "video"
  title: string            // Judul media
  startIndex?: number      // Indeks awal slide yang ditampilkan
}

export default function Lightbox({ isOpen, onClose, mediaUrls, category, title, startIndex = 0 }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex)

  // Reset indeks saat lightbox dibuka dengan startIndex baru
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(startIndex)
    }
  }, [isOpen, startIndex])

  // Navigasi ke slide sebelumnya
  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : mediaUrls.length - 1))
  }, [mediaUrls.length])

  // Navigasi ke slide berikutnya
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < mediaUrls.length - 1 ? prev + 1 : 0))
  }, [mediaUrls.length])

  // Keyboard navigation: Escape, Arrow Left, Arrow Right
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goToPrev()
      if (e.key === 'ArrowRight') goToNext()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, goToPrev, goToNext])

  // Jangan render apapun jika lightbox ditutup
  if (!isOpen || mediaUrls.length === 0) return null

  const currentUrl = mediaUrls[currentIndex]
  const isVideo = checkIsVideo(currentUrl)
  const totalSlides = mediaUrls.length

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Tombol Close (X) di pojok kanan atas */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Tombol Previous (Kiri) — hanya tampil jika lebih dari 1 media */}
      {totalSlides > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goToPrev() }}
          className="absolute left-4 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Tombol Next (Kanan) — hanya tampil jika lebih dari 1 media */}
      {totalSlides > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goToNext() }}
          className="absolute right-4 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Container media */}
      <div
        className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo ? (
          // Video Player
          <video
            key={currentUrl}
            src={getOptimizedVideoUrl(currentUrl)}
            controls
            autoPlay
            className="max-w-full max-h-[80vh] rounded-lg"
          >
            Browser Anda tidak mendukung pemutaran video.
          </video>
        ) : (
          // Gambar
          <div className="relative">
            <Image
              key={currentUrl}
              src={currentUrl}
              alt={`${title} - ${currentIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              priority
            />
          </div>
        )}

        {/* Judul dan counter di bawah */}
        <div className="text-center mt-4 space-y-2">
          <p className="text-white text-sm opacity-70">
            {title}
          </p>
          {/* Indikator posisi slide */}
          {totalSlides > 1 && (
            <div className="flex items-center justify-center gap-2">
              {/* Dot indicators */}
              <div className="flex gap-1.5">
                {mediaUrls.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? 'bg-[#A855F7] w-6'
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
              <span className="text-white/50 text-xs ml-2">
                {currentIndex + 1} / {totalSlides}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
