/**
 * ============================================
 * API Route Handler untuk NextAuth.js
 * ============================================
 * 
 * File ini adalah catch-all route untuk menangani semua
 * endpoint autentikasi NextAuth.js:
 * - POST /api/auth/signin  -> Proses login
 * - POST /api/auth/signout -> Proses logout  
 * - GET  /api/auth/session -> Cek session aktif
 * - GET  /api/auth/csrf    -> CSRF token
 */

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Buat handler NextAuth dengan konfigurasi dari auth.ts
const handler = NextAuth(authOptions)

// Ekspor handler untuk method GET dan POST
export { handler as GET, handler as POST }
