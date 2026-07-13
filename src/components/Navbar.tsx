/**
 * ============================================
 * Komponen Navbar (Navigation Bar)
 * ============================================
 *
 * Navbar responsif dengan efek glassmorphism.
 * Menampilkan navigasi utama website:
 * - Logo/Brand
 * - Link ke halaman publik (Home, Gallery)
 * - Link ke Admin Dashboard (jika login)
 * - Tombol Login/Logout
 *
 * Menggunakan efek backdrop-blur untuk tampilan glass modern.
 * Navbar berubah menjadi hamburger menu di mobile.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  // State untuk toggle menu mobile (hamburger)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Ambil pathname saat ini untuk highlight link aktif
  const pathname = usePathname();

  // Ambil data session untuk cek status login admin
  const { data: session } = useSession();

  // Fungsi untuk menentukan apakah link sedang aktif
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            {/* Ikon kamera dengan animasi hover */}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#A855F7] to-[#7C3AED] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Lens<span className="text-[#A855F7]">Folio</span>
            </span>
          </Link>

          {/* Navigasi Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {/* Link Home */}
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive("/")
                  ? "bg-[#A855F7]/20 text-[#A855F7]"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              Beranda
            </Link>

            {/* Link Gallery */}
            <Link
              href="/gallery"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive("/gallery")
                  ? "bg-[#A855F7]/20 text-[#A855F7]"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              Galeri
            </Link>

            {/* Tampilkan link Dashboard jika admin sudah login */}
            {session && (
              <Link
                href="/admin/dashboard"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  pathname.startsWith("/admin")
                    ? "bg-[#A855F7]/20 text-[#A855F7]"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                Dashboard
              </Link>
            )}

            {/* Tombol Logout jika admin sudah login */}
            {session && (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="ml-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#A855F7]/20 text-[#A855F7] hover:bg-[#A855F7] hover:text-white transition-all duration-300"
              >
                Logout
              </button>
            )}
          </div>

          {/* Tombol Hamburger Menu (Mobile) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                // Ikon X (tutup menu)
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                // Ikon hamburger (buka menu)
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Menu Mobile (dropdown) */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-1 animate-in slide-in-from-top duration-300">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive("/")
                  ? "bg-[#A855F7]/20 text-[#A855F7]"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/gallery"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive("/gallery")
                  ? "bg-[#A855F7]/20 text-[#A855F7]"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              Galeri
            </Link>
            {session && (
              <>
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    pathname.startsWith("/admin")
                      ? "bg-[#A855F7]/20 text-[#A855F7]"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-[#A855F7] hover:bg-[#A855F7]/20 transition-all"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
