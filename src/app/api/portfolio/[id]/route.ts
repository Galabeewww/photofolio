/**
 * ============================================
 * API Route: Portfolio (Individual)
 * Endpoint: /api/portfolio/[id]
 * ============================================
 * 
 * Menangani operasi pada portfolio individual:
 * - GET    /api/portfolio/[id] -> Ambil satu portfolio (publik)
 * - PUT    /api/portfolio/[id] -> Update portfolio (admin only)
 * - DELETE /api/portfolio/[id] -> Hapus portfolio (admin only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * GET - Mengambil satu portfolio berdasarkan ID
 * Endpoint ini bersifat PUBLIK
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Cari portfolio berdasarkan ID di database
    const portfolio = await prisma.portfolio.findUnique({
      where: { id },
    })

    // Jika tidak ditemukan, kembalikan 404
    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('Error mengambil portfolio:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data portfolio' },
      { status: 500 }
    )
  }
}

/**
 * PUT - Mengupdate data portfolio
 * Endpoint ini DILINDUNGI - hanya admin yang sudah login
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Cek session admin
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Anda harus login terlebih dahulu' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { title, description, category, mediaUrls, thumbnailUrls, tags, featured } = body

    // Cek apakah portfolio yang ingin diupdate ada di database
    const existing = await prisma.portfolio.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Portfolio tidak ditemukan' },
        { status: 404 }
      )
    }

    // Update data portfolio di database
    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        description: description !== undefined ? description : existing.description,
        category: category ?? existing.category,
        mediaUrls: mediaUrls ?? existing.mediaUrls,
        thumbnailUrls: thumbnailUrls ?? existing.thumbnailUrls,
        tags: tags ?? existing.tags,
        featured: featured !== undefined ? featured : existing.featured,
      },
    })

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('Error mengupdate portfolio:', error)
    return NextResponse.json(
      { error: 'Gagal mengupdate portfolio' },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Menghapus portfolio
 * Endpoint ini DILINDUNGI - hanya admin yang sudah login
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Cek session admin
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Anda harus login terlebih dahulu' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Cek apakah portfolio yang ingin dihapus ada
    const existing = await prisma.portfolio.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Portfolio tidak ditemukan' },
        { status: 404 }
      )
    }

    // Hapus portfolio dari database
    await prisma.portfolio.delete({
      where: { id },
    })

    // Kembalikan pesan sukses
    return NextResponse.json({ message: 'Portfolio berhasil dihapus' })
  } catch (error) {
    console.error('Error menghapus portfolio:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus portfolio' },
      { status: 500 }
    )
  }
}
