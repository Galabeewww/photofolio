import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/SessionProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// Memuat font Outfit untuk Heading/Judul agar terlihat premium
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

// Memuat font Inter untuk body text yang bersih dan mudah dibaca
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'LensFolio | Professional Photography & Video Portfolio',
  description: 'Portofolio fotografi dan videografi profesional yang menampilkan karya-karya terbaik secara dinamis dan elegan.',
  keywords: ['photography', 'videography', 'portfolio', 'lensfolio', 'admin crud'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${outfit.variable} ${inter.variable} h-full scroll-smooth`}>
      <body className="font-sans bg-[#030712] text-white min-h-screen flex flex-col antialiased">
        <SessionProvider>
          {/* Navbar selalu berada di bagian atas layar (fixed) */}
          <Navbar />
          
          {/* Main content area dengan padding atas untuk mencegah tertutup navbar */}
          <main className="flex-grow pt-16">
            {children}
          </main>
          
          {/* Footer di bagian paling bawah */}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}
