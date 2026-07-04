/**
 * ============================================
 * Prisma Client Singleton
 * ============================================
 * 
 * File ini membuat instance Prisma Client yang bersifat singleton.
 * Pada development, Next.js melakukan hot reload yang membuat
 * koneksi database baru setiap kali. Singleton pattern mencegah
 * error "Too many connections" dengan menggunakan kembali
 * instance yang sudah ada.
 */

import { PrismaClient } from '@prisma/client'

// Deklarasi global untuk menyimpan instance Prisma
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Gunakan instance yang sudah ada atau buat baru
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// Pada development, simpan instance ke global agar tidak dibuat ulang
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
