/**
 * ============================================
 * API Route: Upload Media ke Cloudinary
 * Endpoint: /api/upload
 * ============================================
 * 
 * Menangani upload file foto dan video ke Cloudinary.
 * File diterima sebagai FormData, lalu dikirim ke Cloudinary
 * menggunakan API mereka. URL hasil upload dikembalikan
 * untuk disimpan di database.
 * 
 * Hanya admin yang sudah login yang bisa mengupload file.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'

// Konfigurasi Cloudinary dengan credentials dari environment variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * POST - Upload file media (foto/video) ke Cloudinary
 * Endpoint ini DILINDUNGI - hanya admin yang sudah login
 */
export async function POST(request: NextRequest) {
  try {
    // Verifikasi bahwa user sudah login
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Anda harus login terlebih dahulu' },
        { status: 401 }
      )
    }

    // Ambil file dari FormData yang dikirim client
    const formData = await request.formData()
    const file = formData.get('file') as File

    // Validasi bahwa file ada
    if (!file) {
      return NextResponse.json(
        { error: 'File tidak ditemukan' },
        { status: 400 }
      )
    }

    // Konversi file menjadi Buffer untuk dikirim ke Cloudinary
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Tentukan tipe resource berdasarkan tipe file
    // Jika video, gunakan resource_type 'video', selain itu 'image'
    const isVideo = file.type.startsWith('video/')
    const resourceType = isVideo ? 'video' : 'image'

    // Upload ke Cloudinary menggunakan upload stream
    const result = await new Promise<{
      secure_url: string
      public_id: string
      resource_type: string
      format: string
      width?: number
      height?: number
      duration?: number
    }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: resourceType,     // Tipe: image atau video
            folder: 'photography-portfolio', // Folder di Cloudinary
            transformation: isVideo
              ? undefined
              : [{ quality: 'auto', fetch_format: 'auto' }], // Optimasi otomatis untuk gambar
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result as typeof result & { secure_url: string; public_id: string; resource_type: string; format: string })
          }
        )
        .end(buffer)
    })

    // Buat URL thumbnail untuk video (frame pertama)
    let thumbnailUrl = result.secure_url
    if (isVideo) {
      // Untuk video, generate thumbnail dari frame pertama
      thumbnailUrl = cloudinary.url(result.public_id, {
        resource_type: 'video',
        transformation: [
          { width: 640, height: 360, crop: 'fill' },
          { fetch_format: 'jpg' },
        ],
      })
    }

    // Kembalikan URL dan metadata file yang diupload
    return NextResponse.json({
      url: result.secure_url,         // URL file yang diupload
      thumbnailUrl,                    // URL thumbnail
      publicId: result.public_id,      // Public ID di Cloudinary
      resourceType: result.resource_type,
      format: result.format,
    })
  } catch (error) {
    console.error('Error mengupload file:', error)
    return NextResponse.json(
      { error: 'Gagal mengupload file' },
      { status: 500 }
    )
  }
}
