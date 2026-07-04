/**
 * ============================================
 * Halaman Utama (Beranda / Landing Page)
 * ============================================
 * 
 * Menampilkan:
 * 1. Hero Section: Headline premium, deskripsi singkat, tombol navigasi.
 * 2. Featured Works: Grid karya pilihan (foto & video) yang diambil secara dinamis dari database.
 * 3. Services / About: Deskripsi jasa photography & videography.
 * 4. CTA / Contact Section: Mengajak calon klien untuk menghubungi admin.
 * 
 * Merupakan Server Component (mengambil data langsung dari database via Prisma).
 */

import Link from 'next/link'
import { prisma } from '@/lib/db'
import PortfolioCard from '@/components/PortfolioCard'

// Force Next.js untuk selalu render halaman secara dinamis (tidak di-cache statis)
export const revalidate = 0

export default async function Home() {
  // Ambil maksimal 6 karya unggulan (featured) dari database
  let featuredItems: any[] = []
  try {
    featuredItems = await prisma.portfolio.findMany({
      where: { featured: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error('Gagal memuat karya unggulan dari database:', error)
  }

  return (
    <div className="min-h-screen bg-[#00224D]">
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4">
        {/* Background gradient radial yang dramatis */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(93,14,65,0.4)_0%,rgba(0,34,77,1)_80%)] z-0" />
        
        {/* Dekorasi lingkaran cahaya berpendar */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#FF204E]/10 blur-[120px] animate-pulse duration-5000" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#A0153E]/10 blur-[120px] animate-pulse duration-3000" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Badge kecil di atas judul */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#FF204E] animate-ping" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Kamera & Lensa Profesional
            </span>
          </div>

          {/* Headline utama */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-none">
            Mengabadikan Kisah <br />
            Lewat Keindahan <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF204E] via-[#A0153E] to-[#5D0E41]">Visual</span>
          </h1>

          {/* Deskripsi */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-300 font-light leading-relaxed">
            Menyajikan portofolio fotografi & videografi kelas dunia dengan sentuhan artistik yang menangkap setiap esensi emosi dan detail berharga Anda.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              href="/gallery"
              className="px-8 py-4 rounded-xl text-base font-semibold bg-gradient-to-r from-[#FF204E] to-[#A0153E] text-white shadow-xl shadow-[#FF204E]/25 hover:shadow-[#FF204E]/40 hover:scale-105 transition-all duration-300 w-full sm:w-auto"
            >
              Jelajahi Galeri
            </Link>
            <Link
              href="#contact"
              className="px-8 py-4 rounded-xl text-base font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 w-full sm:w-auto"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Featured Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[#FF204E] text-sm font-semibold uppercase tracking-wider">Karya Pilihan</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-1">Karya Unggulan</h2>
          </div>
          <Link
            href="/gallery"
            className="group flex items-center gap-2 text-gray-400 hover:text-white mt-4 md:mt-0 font-medium transition-colors"
          >
            Lihat Semua Galeri
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {featuredItems.length > 0 ? (
          // Grid Galeri Karya Pilihan
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
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
          // Jika belum ada data
          <div className="text-center py-20 bg-[#5D0E41]/10 rounded-2xl border border-white/5">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">Belum Ada Portfolio</h3>
            <p className="text-gray-400 max-w-sm mx-auto text-sm">
              Admin belum menambahkan karya unggulan ke database. Silakan masuk ke admin panel untuk menambahkan item.
            </p>
          </div>
        )}
      </section>

      {/* 3. About & Services Section */}
      <section className="bg-[#5D0E41]/10 py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Sisi Kiri: Deskripsi */}
            <div className="space-y-6">
              <span className="text-[#FF204E] text-sm font-semibold uppercase tracking-wider">Layanan Kami</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Membantu Anda Merekam <br />
                Momen Indah Dalam Hidup
              </h2>
              <p className="text-gray-300 leading-relaxed font-light">
                Dari kehangatan pernikahan, profesionalisme foto produk, hingga video profil korporasi yang memukau. Kami membawa keahlian teknis dan visi estetika tinggi di setiap penugasan.
              </p>
              
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="space-y-2 border-l-2 border-[#FF204E] pl-4">
                  <h4 className="text-2xl font-bold text-white">500+</h4>
                  <p className="text-gray-400 text-sm">Klien Puas</p>
                </div>
                <div className="space-y-2 border-l-2 border-[#FF204E] pl-4">
                  <h4 className="text-2xl font-bold text-white">10+</h4>
                  <p className="text-gray-400 text-sm">Tahun Pengalaman</p>
                </div>
              </div>
            </div>

            {/* Sisi Kanan: Kartu Fitur Layanan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Jasa Foto */}
              <div className="p-6 rounded-2xl bg-[#00224D] border border-white/5 hover:border-[#FF204E]/30 transition-all duration-300 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#FF204E]/10 flex items-center justify-center text-[#FF204E]">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Fotografi Profesional</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Pernikahan, potret wajah (portrait), acara, produk komersial, dan landscape dengan resolusi ultra tinggi.
                </p>
              </div>

              {/* Jasa Video */}
              <div className="p-6 rounded-2xl bg-[#00224D] border border-white/5 hover:border-[#FF204E]/30 transition-all duration-300 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#FF204E]/10 flex items-center justify-center text-[#FF204E]">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Videografi Sinematik</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Video klip, cinematic wedding, dokumenter, profil perusahaan, promosi media sosial, dan video iklan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA / Contact Section */}
      <section id="contact" className="max-w-4xl mx-auto px-4 py-24 text-center space-y-8">
        <h2 className="text-3xl sm:text-5xl font-bold text-white">Siap Untuk Bekerjasama?</h2>
        <p className="text-gray-300 max-w-xl mx-auto text-lg font-light leading-relaxed">
          Mari diskusikan kebutuhan visual Anda. Hubungi kami untuk mendapatkan penawaran spesial atau sekadar berkonsultasi mengenai konsep projek Anda.
        </p>
        <div>
          <a
            href="mailto:contact@lensfolio.com"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold bg-gradient-to-r from-[#FF204E] to-[#A0153E] text-white shadow-xl shadow-[#FF204E]/25 hover:shadow-[#FF204E]/40 hover:scale-105 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Hubungi via Email
          </a>
        </div>
      </section>
    </div>
  )
}
