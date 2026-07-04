/**
 * ============================================
 * Database Seed Script
 * ============================================
 * 
 * Script ini membuat data awal (seed) di database:
 * - Membuat akun admin default
 * - Password di-hash dengan bcrypt sebelum disimpan
 * 
 * Jalankan dengan: npx prisma db seed
 * 
 * PENTING: Ganti email dan password default sebelum deploy!
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Memulai seeding database...')

  // Hash password admin dengan bcrypt (salt rounds: 12)
  const hashedPassword = await bcrypt.hash('admin', 12)

  // Buat atau update akun admin default
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      password: hashedPassword,
      name: 'Admin',
    },
  })

  console.log('✅ Admin user berhasil dibuat:', admin.email)
  console.log('📧 Email: admin@gmail.com')
  console.log('🔑 Password: admin')
  console.log('')
  console.log('⚠️  PENTING: Ganti password ini sebelum deploy ke production!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error saat seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
