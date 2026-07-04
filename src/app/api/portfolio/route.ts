/**
 * ============================================
 * API Route: Portfolio (Collection)
 * Endpoint: /api/portfolio
 * ============================================
 * 
 * Menangani operasi pada koleksi portfolio:
 * - GET  /api/portfolio -> Ambil semua portfolio (publik)
 * - POST /api/portfolio -> Tambah portfolio baru (admin only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * GET - Mengambil semua data portfolio
 * Endpoint ini bersifat PUBLIK - siapa saja bisa mengakses
 * Mendukung filter berdasarkan kategori dan pencarian
 */
export async function GET(request: NextRequest) {
  try {
    // Ambil parameter query dari URL untuk filter
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')  // Filter: "photo" atau "video"
    const search = searchParams.get('search')      // Pencarian berdasarkan judul
    const featured = searchParams.get('featured')  // Filter karya unggulan

    // Bangun kondisi filter secara dinamis
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}
    
    // Filter berdasarkan kategori (photo/video) jika disediakan
    if (category && category !== 'all') {
      where.category = category
    }
    
    // Filter berdasarkan pencarian judul (case-insensitive)
    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      }
    }
    
    // Filter hanya karya unggulan jika diminta
    if (featured === 'true') {
      where.featured = true
    }

    // Query database dengan filter dan urutkan dari terbaru
    const portfolios = await prisma.portfolio.findMany({
      where,
      orderBy: { createdAt: 'desc' }, // Tampilkan yang terbaru di atas
    })

    // Kembalikan data portfolio dalam format JSON
    return NextResponse.json(portfolios)
  } catch (error) {
    console.error('Error mengambil portfolio:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data portfolio' },
      { status: 500 }
    )
  }
}

/**
 * POST - Menambahkan portfolio baru
 * Endpoint ini DILINDUNGI - hanya admin yang sudah login
 * yang bisa menambah data
 */
export async function POST(request: NextRequest) {
  try {
    // Cek apakah user sudah login (ada session aktif)
    const session = await getServerSession(authOptions)
    
    // Jika belum login, tolak dengan status 401 (Unauthorized)
    if (!session) {
      return NextResponse.json(
        { error: 'Anda harus login terlebih dahulu' },
        { status: 401 }
      )
    }

    // Parse body request untuk mendapatkan data portfolio
    const body = await request.json()
    const { title, description, category, mediaUrls, thumbnailUrls, tags, featured } = body

    // Validasi field yang wajib diisi
    if (!title || !category || !mediaUrls || mediaUrls.length === 0) {
      return NextResponse.json(
        { error: 'Title, category, dan minimal satu media URL harus diisi' },
        { status: 400 }
      )
    }

    // Simpan data portfolio baru ke database
    const portfolio = await prisma.portfolio.create({
      data: {
        title,
        description: description || null,
        category,
        mediaUrls: mediaUrls || [],
        thumbnailUrls: thumbnailUrls || [],
        tags: tags || [],
        featured: featured || false,
      },
    })

    // Kembalikan data yang baru dibuat dengan status 201 (Created)
    return NextResponse.json(portfolio, { status: 201 })
  } catch (error) {
    console.error('Error membuat portfolio:', error)
    return NextResponse.json(
      { error: 'Gagal membuat portfolio baru' },
      { status: 500 }
    )
  }
}
