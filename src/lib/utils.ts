/**
 * ============================================
 * Utilitas Pembantu Proyek Portofolio
 * ============================================
 */

/**
 * Mendeteksi secara dinamis apakah sebuah URL menunjuk ke media video.
 * Cek dilakukan berdasarkan ekstensi file video umum atau format URL Cloudinary.
 * 
 * @param url URL media yang akan diperiksa
 * @returns boolean true jika terdeteksi sebagai video
 */
export function checkIsVideo(url: string | null | undefined): boolean {
  if (!url) return false

  // Bersihkan parameter query seperti ?v=...
  const cleanUrl = url.split('?')[0].toLowerCase()

  // Daftar ekstensi file video yang didukung secara umum oleh HTML5
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.quicktime', '.m4v', '.ogv']
  const hasVideoExtension = videoExtensions.some((ext) => cleanUrl.endsWith(ext))

  // Cek jika URL menggunakan path video bawaan Cloudinary
  const isCloudinaryVideo = 
    url.includes('/video/upload/') || 
    url.includes('/video/private/') || 
    url.includes('/video/authenticated/')

  return hasVideoExtension || isCloudinaryVideo
}

/**
 * Mengoptimalkan URL video Cloudinary ke format .mp4 agar didukung 100% secara native 
 * oleh browser di platform Windows/Android/iOS (terutama untuk transcoding file .mov dari iPhone/kamera).
 * 
 * @param url URL media video
 * @returns URL video yang telah ditranskode ke format .mp4
 */
export function getOptimizedVideoUrl(url: string | null | undefined): string {
  if (!url) return ''

  // Cek apakah URL merupakan video
  if (checkIsVideo(url)) {
    // Bersihkan parameter query
    const cleanUrl = url.split('?')[0]
    
    // Temukan ekstensi file asli di URL
    const lastDotIndex = cleanUrl.lastIndexOf('.')
    if (lastDotIndex !== -1) {
      const baseWithoutExtension = cleanUrl.substring(0, lastDotIndex)
      const extension = cleanUrl.substring(lastDotIndex).toLowerCase()

      // Jika format videonya bukan mp4 atau webm, paksa transcode ke .mp4 via URL Cloudinary
      if (extension !== '.mp4' && extension !== '.webm') {
        return `${baseWithoutExtension}.mp4`
      }
    }
  }
  return url
}
