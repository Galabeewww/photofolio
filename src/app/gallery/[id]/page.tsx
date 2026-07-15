"use client";

import { useState, useEffect, use, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Lightbox from "@/components/Lightbox";
import { checkIsVideo, getOptimizedVideoUrl } from "@/lib/utils";

interface PortfolioItem {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  mediaUrls: string[];
  thumbnailUrls: string[];
  tags: string[];
  createdAt: string;
}

export default function GalleryDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params) as { id: string };
  const id = resolvedParams.id;

  const router = useRouter();

  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0); // Indeks slide aktif

  // Ref untuk mengontrol scroll baris thumbnail
  const thumbnailStripRef = useRef<HTMLDivElement>(null);

  // Fetch detail data berdasarkan ID
  useEffect(() => {
    async function fetchDetail() {
      try {
        const response = await fetch(`/api/portfolio/${id}`);
        if (response.ok) {
          const data = await response.json();
          setItem(data);
        } else {
          router.push("/gallery");
        }
      } catch (error) {
        console.error("Gagal mengambil detail portfolio:", error);
        router.push("/gallery");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDetail();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center space-y-4">
        {/* <div className="w-12 h-12 rounded-full border-4 border-[#A855F7]/20 border-t-[#A855F7] animate-spin" /> */}
        <p className="text-gray-400 text-sm">Memuat detail media...</p>
      </div>
    );
  }

  if (!item) return null;

  const mediaUrls = item.mediaUrls || [];
  const totalMedia = mediaUrls.length;

  // Format tanggal upload
  const uploadDate = new Date(item.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Navigasi slideshow utama
  const goToPrev = () =>
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : totalMedia - 1));
  const goToNext = () =>
    setCurrentSlide((prev) => (prev < totalMedia - 1 ? prev + 1 : 0));

  // Fungsi untuk scroll thumbnail menggunakan tombol panah
  const scrollThumbnails = (direction: "left" | "right") => {
    if (thumbnailStripRef.current) {
      const scrollAmount = 200; // Jumlah pergeseran pixel tiap klik
      thumbnailStripRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const currentUrl = mediaUrls[currentSlide] || "";
  const isVideo = item.category === "video";

  return (
    <div className="min-h-screen bg-[#030712] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Tombol Kembali */}
        <div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Kembali ke Galeri
          </Link>
        </div>

        {/* Layout Detail Utama */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sisi Kiri: Media Display dengan Slideshow (2/3 Kolom) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Media Utama */}
            <div className="relative rounded-2xl overflow-hidden bg-[#1E1B4B]/20 border border-white/10 group aspect-video lg:aspect-auto lg:h-[60vh] flex items-center justify-center">
              {isVideo ? (
                <video
                  key={currentUrl}
                  // Tambahkan #t=0.1 agar browser menampilkan frame pertama, bukan layar hitam
                  src={`${getOptimizedVideoUrl(currentUrl)}#t=0.1`}
                  controls
                  className="w-full h-full max-h-[60vh] object-contain"
                >
                  Browser Anda tidak mendukung tag video.
                </video>
              ) : (
                <div className="relative w-full h-full min-h-[40vh] lg:min-h-[50vh]">
                  <Image
                    key={currentUrl}
                    src={currentUrl}
                    alt={`${item.title} - ${currentSlide + 1}`}
                    fill
                    priority
                    className="object-contain"
                  />
                </div>
              )}

              {/* Tombol Navigasi Prev/Next Slideshow Utama — hanya jika lebih dari 1 media */}
              {totalMedia > 1 && (
                <>
                  <button
                    onClick={goToPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#030712]/70 backdrop-blur-md border border-white/10 text-white opacity-70 hover:opacity-100 transition-all duration-300 hover:bg-[#A855F7] z-10"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#030712]/70 backdrop-blur-md border border-white/10 text-white opacity-70 hover:opacity-100 transition-all duration-300 hover:bg-[#A855F7] z-10"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  {/* Counter Slide */}
                  <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-[#030712]/70 backdrop-blur-md text-white text-xs font-medium z-10">
                    {currentSlide + 1} / {totalMedia}
                  </div>
                </>
              )}

              {/* Tombol Layar Penuh */}
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-4 right-4 p-3 rounded-xl bg-[#030712]/80 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#A855F7] z-10"
                title="Perbesar Gambar"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                  />
                </svg>
              </button>
            </div>

            {/* Thumbnail Strip dengan Tombol Panah — hanya jika ada lebih dari 1 media */}
            {totalMedia > 1 && (
              <div className="relative">
                {/* Tombol Panah Kiri Thumbnail - Hanya muncul jika media > 7 */}
                {totalMedia > 7 && (
                  <button
                    onClick={() => scrollThumbnails("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-[#030712]/80 backdrop-blur-md border border-white/10 text-white hover:bg-[#A855F7] transition-colors flex items-center justify-center"
                    aria-label="Scroll thumbnail ke kiri"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}

                {/* Kontainer Thumbnail (Scrollbar Disembunyikan) */}
                <div
                  ref={thumbnailStripRef}
                  className={`flex gap-2 overflow-x-auto scroll-smooth py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
                    totalMedia > 7 ? "px-6" : "px-1"
                  }`}
                >
                  {mediaUrls.map((url, idx) => {
                    const thumbIsVideo = item.category === "video";
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                          idx === currentSlide
                            ? "border-[#A855F7] ring-1 ring-[#A855F7]/50"
                            : "border-white/10 hover:border-white/30 opacity-60 hover:opacity-100"
                        }`}
                      >
                        {thumbIsVideo ? (
                          <video
                            src={`${url}#t=0.1`}
                            className="w-full h-full object-cover"
                            muted
                            preload="metadata"
                          />
                        ) : (
                          <Image
                            src={url}
                            alt={`Thumbnail ${idx + 1}`}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        )}

                        {/* Ikon Play untuk Video Thumbnail */}
                        {thumbIsVideo && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                            <svg
                              className="w-6 h-6 text-white/90"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Tombol Panah Kanan Thumbnail - Hanya muncul jika media > 7 */}
                {totalMedia > 7 && (
                  <button
                    onClick={() => scrollThumbnails("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-[#030712]/80 backdrop-blur-md border border-white/10 text-white hover:bg-[#A855F7] transition-colors flex items-center justify-center"
                    aria-label="Scroll thumbnail ke kanan"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sisi Kanan: Deskripsi & Metadata (1/3 Kolom) */}
          <div className="p-6 rounded-2xl bg-[#1E1B4B]/10 border border-white/5 space-y-6 h-fit">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    item.category === "video"
                      ? "bg-[#A855F7]/20 text-[#A855F7]"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {item.category === "video" ? "Video Project" : "Photography"}
                </span>
                {totalMedia > 1 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#030712] text-gray-300 border border-white/10">
                    {totalMedia} Media
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {item.title}
              </h1>
              <p className="text-xs text-gray-500">
                Diunggah pada {uploadDate}
              </p>
            </div>

            {item.description && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Deskripsi Karya
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>
            )}

            {/* Bagian Tagging */}
            {item.tags.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Tags / Kategori
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox fullscreen modal dengan slideshow */}
      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        mediaUrls={mediaUrls}
        category={item.category}
        title={item.title}
        startIndex={currentSlide}
      />
    </div>
  );
}
