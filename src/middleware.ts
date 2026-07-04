/**
 * ============================================
 * Middleware untuk Proteksi Route Admin
 * ============================================
 * 
 * Middleware ini berjalan sebelum setiap request ke route admin.
 * Fungsinya:
 * 1. Mengecek apakah user sudah login (ada session/token)
 * 2. Jika belum login, redirect ke halaman login
 * 3. Route /admin/login tidak diproteksi agar admin bisa akses form login
 * 
 * Ini memastikan hanya admin yang sudah login yang bisa
 * mengakses dashboard dan fitur CRUD.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // Ambil JWT token dari request (null jika belum login)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    // Di Vercel (HTTPS), gunakan secureCookie agar terbaca dengan benar
    secureCookie: process.env.NODE_ENV === 'production' || request.nextUrl.protocol === 'https:',
  })

  const { pathname } = request.nextUrl

  // Jika mengakses halaman login tapi sudah login, redirect ke dashboard
  if (pathname === '/admin/login' && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  // Jika mengakses route admin (selain login) tapi belum login, redirect ke login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Lanjutkan request jika sudah login atau route publik
  return NextResponse.next()
}

// Konfigurasi matcher - middleware hanya berjalan pada route admin
export const config = {
  matcher: ['/admin/:path*'],
}
