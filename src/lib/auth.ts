/**
 * ============================================
 * Konfigurasi NextAuth.js (Authentication)
 * ============================================
 * 
 * File ini mengatur autentikasi admin menggunakan NextAuth.js.
 * Menggunakan Credentials Provider untuk login dengan email & password.
 * Password diverifikasi menggunakan bcrypt untuk keamanan.
 * 
 * Alur autentikasi:
 * 1. Admin memasukkan email & password di form login
 * 2. NextAuth memverifikasi credentials terhadap database
 * 3. Jika valid, session JWT dibuat
 * 4. Session digunakan untuk mengakses halaman admin
 */

import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './db'

export const authOptions: NextAuthOptions = {
  // Menggunakan Credentials Provider (email + password)
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      // Fungsi authorize dipanggil saat admin mencoba login
      async authorize(credentials) {
        // Validasi input - pastikan email dan password tidak kosong
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan password harus diisi')
        }

        // Cari user berdasarkan email di database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        // Jika user tidak ditemukan, tolak login
        if (!user) {
          throw new Error('Email atau password salah')
        }

        // Bandingkan password yang diinput dengan hash di database
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        // Jika password tidak cocok, tolak login
        if (!isPasswordValid) {
          throw new Error('Email atau password salah')
        }

        // Kembalikan data user (tanpa password) untuk disimpan di session
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],

  // Konfigurasi session menggunakan JWT (JSON Web Token)
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // Session berlaku 24 jam
  },

  // Callback untuk menambahkan data ke JWT dan session
  callbacks: {
    // Menambahkan user ID ke JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    // Menambahkan user ID ke session object
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string
      }
      return session
    },
  },

  // Halaman custom untuk login (bukan default NextAuth)
  pages: {
    signIn: '/admin/login',
  },

  // Secret untuk enkripsi JWT
  secret: process.env.NEXTAUTH_SECRET,
}
