/**
 * ============================================
 * Komponen PortfolioCard
 * ============================================
 * 
 * Card component untuk menampilkan setiap item portfolio
 * di halaman galeri. Fitur:
 * - Thumbnail media (foto/video) — menggunakan foto pertama dari array
 * - Badge kategori (Photo/Video)
 * - Badge jumlah foto jika lebih dari 1
 * - Judul & deskripsi
 * - Hover effect dengan animasi scale & overlay
 * - Link ke halaman detail
 */

'use client'

import Image from 'next/image'
import Link from 'next/link'

// Interface untuk tipe data portfolio (sesuai skema database baru)
interface PortfolioCardProps {
  id: string
  title: string
  description?: string | null
  category: string
  mediaUrls: string[]
  thumbnailUrls: string[]
  tags: string[]
}

export default function PortfolioCard({
  id,
  title,
  description,
  category,
  mediaUrls,
  thumbnailUrls,
}: PortfolioCardProps) {
  // Tentukan URL gambar yang ditampilkan (ambil media pertama dari array)
  const displayImage = thumbnailUrls?.[0] || mediaUrls?.[0] || ''

  // Hitung jumlah total media untuk ditampilkan sebagai badge
  const mediaCount = mediaUrls?.length || 0

  return (
    <Link href={`/gallery/${id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-[#5D0E41]/30 border border-white/5 hover:border-[#FF204E]/30 transition-all duration-500">
        {/* Container gambar dengan rasio 3:4 */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {/* Gambar/Thumbnail pertama */}
          {displayImage && (
            <Image
              src={displayImage}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          )}

          {/* Overlay gradient saat hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#00224D] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badge kategori (pojok kanan atas) */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {/* Badge jumlah media jika lebih dari 1 */}
            {mediaCount > 1 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#00224D]/80 text-white backdrop-blur-md flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {mediaCount}
              </span>
            )}
            <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
              category === 'video'
                ? 'bg-[#FF204E]/80 text-white'
                : 'bg-white/20 text-white'
            }`}>
              {category === 'video' ? (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Video
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                  Foto
                </span>
              )}
            </span>
          </div>

          {/* Info yang muncul saat hover (bawah) */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1">
              {title}
            </h3>
            {description && (
              <p className="text-gray-300 text-sm line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
