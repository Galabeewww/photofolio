/**
 * ============================================
 * Komponen MediaUpload (Single Type Upload)
 * ============================================
 *
 * Widget upload file untuk mengunggah beberapa foto ATAU video sekaligus.
 * ATURAN: Hanya satu jenis file yang boleh diupload per sesi.
 * - Jika kategori "photo": hanya menerima file gambar
 * - Jika kategori "video": hanya menerima file video
 * - Tidak boleh campuran foto dan video
 *
 * Fitur:
 * - Drag & drop beberapa file sekaligus
 * - Klik untuk memilih beberapa file
 * - Validasi jenis file berdasarkan kategori yang dipilih
 * - Preview gallery file yang dipilih dengan tombol hapus
 * - Progress bar upload kumulatif
 * - Upload ke server via API /api/upload
 */

"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { checkIsVideo } from "@/lib/utils";

interface MediaUploadProps {
  onUploadComplete: (data: { urls: string[]; thumbnailUrls: string[] }) => void;
  currentMediaUrls?: string[];
  category?: string; // "photo" atau "video" — menentukan jenis file yang diterima
}

export default function MediaUpload({
  onUploadComplete,
  currentMediaUrls = [],
  category,
}: MediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>(currentMediaUrls);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  // Tentukan tipe file yang diizinkan berdasarkan kategori
  const allowedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  const allowedVideoTypes = [
    "video/mp4",
    "video/webm",
    "video/mov",
    "video/quicktime",
  ];

  // Tentukan accept attribute untuk input file berdasarkan kategori
  const acceptAttribute = category === "video" ? "video/*" : "image/*";

  // Label jenis file yang diharapkan (untuk pesan error)
  const expectedTypeLabel = category === "video" ? "video" : "foto/gambar";

  /**
   * Fungsi untuk mengupload beberapa file ke server secara sekuensial.
   * Validasi jenis file dilakukan berdasarkan kategori yang dipilih.
   */
  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      setIsUploading(true);
      setError(null);
      setProgress(0);

      const uploadedUrls: string[] = [];
      const uploadedThumbnails: string[] = [];
      const objectUrls: string[] = [];

      try {
        // Tentukan tipe yang diizinkan berdasarkan kategori
        const allowedTypes =
          category === "video" ? allowedVideoTypes : allowedImageTypes;

        // 1. Validasi tipe & ukuran semua file terlebih dahulu
        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          // Cek apakah file sesuai dengan kategori yang dipilih
          if (!allowedTypes.includes(file.type)) {
            // Berikan pesan error yang jelas tentang ketidakcocokan jenis file
            const fileIsVideo = file.type.startsWith("video/");
            const fileIsImage = file.type.startsWith("image/");

            if (category === "video" && fileIsImage) {
              throw new Error(
                `File "${file.name}" adalah gambar. Kategori yang dipilih adalah Video, jadi hanya file video yang diizinkan.`,
              );
            } else if (category === "photo" && fileIsVideo) {
              throw new Error(
                `File "${file.name}" adalah video. Kategori yang dipilih adalah Foto, jadi hanya file gambar yang diizinkan.`,
              );
            } else {
              throw new Error(
                `Tipe file "${file.name}" (${file.type}) tidak didukung. Hanya file ${expectedTypeLabel} yang diizinkan.`,
              );
            }
          }

          if (file.size > 100 * 1024 * 1024) {
            throw new Error(
              `Ukuran file "${file.name}" terlalu besar (Maks. 100MB).`,
            );
          }
          objectUrls.push(URL.createObjectURL(file));
        }

        // Tambahkan file baru ke preview lokal
        setPreviews((prev) => [...prev, ...objectUrls]);

        // 2. Upload file satu per satu
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || `Gagal mengupload "${file.name}"`);
          }

          const data = await response.json();
          uploadedUrls.push(data.url);
          uploadedThumbnails.push(data.thumbnailUrl || data.url);

          // Update progress
          setProgress(Math.round(((i + 1) / files.length) * 100));
        }

        // Gabungkan dengan media lama dan jalankan callback
        const finalUrls = [...currentMediaUrls, ...uploadedUrls];
        const finalThumbnails = [...currentMediaUrls, ...uploadedThumbnails];

        onUploadComplete({
          urls: finalUrls,
          thumbnailUrls: finalThumbnails,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Terjadi kesalahan saat upload",
        );
        // Reset preview ke daftar media yang sudah ada
        setPreviews(currentMediaUrls);
      } finally {
        setIsUploading(false);
        setProgress(0);
      }
    },
    [
      onUploadComplete,
      currentMediaUrls,
      category,
      allowedImageTypes,
      allowedVideoTypes,
      expectedTypeLabel,
    ],
  );

  /**
   * Handler saat file di-drop ke area upload
   */
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files && files.length > 0) uploadFiles(files);
    },
    [uploadFiles],
  );

  /**
   * Handler saat file dipilih melalui dialog file
   */
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) uploadFiles(files);
    },
    [uploadFiles],
  );

  /**
   * Menghapus salah satu media dari daftar upload
   */
  const handleRemoveMedia = (indexToRemove: number) => {
    const updatedUrls = previews.filter((_, idx) => idx !== indexToRemove);
    setPreviews(updatedUrls);
    onUploadComplete({
      urls: updatedUrls,
      thumbnailUrls: updatedUrls,
    });
  };

  return (
    <div className="space-y-4">
      {/* Indikator jenis file yang diterima */}
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
          category === "video"
            ? "bg-violet-500/10 border border-violet-500/20 text-violet-300"
            : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
        }`}
      >
        {category === "video" ? (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Mode Video — Hanya file video yang diterima (.mp4, .webm, .mov)
          </>
        ) : (
          <>
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
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
            </svg>
            Mode Foto — Hanya file gambar yang diterima (.jpg, .png, .webp,
            .gif)
          </>
        )}
      </div>

      {/* Area drag & drop / klik untuk upload */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
          isDragging
            ? "border-[#A855F7] bg-[#A855F7]/10"
            : "border-white/20 hover:border-[#A855F7]/50 hover:bg-white/5"
        }`}
      >
        <input
          type="file"
          accept={acceptAttribute}
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {/* Tampilan saat sedang upload */}
        {isUploading ? (
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full border-4 border-[#A855F7]/30 border-t-[#A855F7] animate-spin" />
            <p className="text-gray-400 text-sm">
              Mengunggah file ({progress}%)...
            </p>
            <div className="w-full bg-white/10 rounded-full h-1.5 max-w-xs mx-auto overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#A855F7] to-[#7C3AED] h-1.5 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#A855F7]/10 flex items-center justify-center">
              {category === "video" ? (
                <svg
                  className="w-6 h-6 text-[#A855F7]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-[#A855F7]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              )}
            </div>
            <div>
              <p className="text-white text-sm font-medium">
                Drag & drop beberapa {category === "video" ? "video" : "foto"}{" "}
                atau <span className="text-[#A855F7]">klik untuk browse</span>
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {category === "video"
                  ? "Hanya file Video yang diterima (.mp4, .webm, .mov — Maks. 100MB per file)"
                  : "Hanya file Gambar yang diterima (.jpg, .png, .webp, .gif — Maks. 100MB per file)"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tampilan error */}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Preview media yang dipilih/diupload (Grid Preview) */}
      {previews.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-400 font-medium">
            Media Terunggah ({previews.length})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previews.map((url, idx) => {
              // 1. Deteksi video: cek ekstensi URL, ATAU jika itu blob URL gunakan prop `category`
              const isVideo = url.startsWith("blob:")
                ? category === "video"
                : checkIsVideo(url);

              return (
                <div
                  key={idx}
                  className="relative group rounded-lg overflow-hidden aspect-video bg-[#1E1B4B]/30 border border-white/10"
                >
                  {isVideo ? (
                    <video
                      // 2. Tambahkan #t=0.1 agar browser langsung memuat dan menampilkan frame pertama
                      src={`${url}#t=0.1`}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => e.currentTarget.pause()}
                    />
                  ) : (
                    <Image
                      src={url}
                      alt={`Preview ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  )}

                  {/* --- TAMBAH INI: Ikon Play untuk Video --- */}
                  {isVideo && (
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

                  {/* Overlay & Tombol Hapus */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(idx)}
                      className="p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                      title="Hapus media ini"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        // <div className="space-y-2">
        //   <p className="text-xs text-gray-400 font-medium">
        //     Media Terunggah ({previews.length})
        //   </p>
        //   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        //     {previews.map((url, idx) => {
        //       const isVideo = checkIsVideo(url);

        //       return (
        //         <div
        //           key={idx}
        //           className="relative group rounded-lg overflow-hidden aspect-video bg-[#1E1B4B]/30 border border-white/10"
        //         >
        //           {isVideo ? (
        //             <video
        //               src={url}
        //               className="w-full h-full object-cover"
        //               muted
        //               loop
        //               playsInline
        //               preload="metadata"
        //               onMouseEnter={(e) => e.currentTarget.play()}
        //               onMouseLeave={(e) => e.currentTarget.pause()}
        //             />
        //           ) : (
        //             <Image
        //               src={url}
        //               alt={`Preview ${idx + 1}`}
        //               fill
        //               sizes="(max-width: 768px) 50vw, 25vw"
        //               className="object-cover"
        //             />
        //           )}
        //           {/* Overlay & Tombol Hapus */}
        //           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        //             <button
        //               type="button"
        //               onClick={() => handleRemoveMedia(idx)}
        //               className="p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
        //               title="Hapus media ini"
        //             >
        //               <svg
        //                 className="w-4 h-4"
        //                 fill="none"
        //                 viewBox="0 0 24 24"
        //                 stroke="currentColor"
        //               >
        //                 <path
        //                   strokeLinecap="round"
        //                   strokeLinejoin="round"
        //                   strokeWidth={2}
        //                   d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        //                 />
        //               </svg>
        //             </button>
        //           </div>
        //         </div>
        //       );
        //     })}
        //   </div>
        // </div>
      )}
    </div>
  );
}
