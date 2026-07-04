/**
 * ============================================
 * Session Provider Component
 * ============================================
 * 
 * Wrapper component untuk NextAuth SessionProvider.
 * Diperlukan karena SessionProvider menggunakan React Context
 * yang hanya bisa berjalan di Client Component.
 * 
 * Komponen ini membungkus seluruh aplikasi agar:
 * - Hook useSession() bisa digunakan di mana saja
 * - Status login admin bisa dicek dari komponen mana pun
 */

'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}
