/**
 * ============================================
 * Dashboard Panel Admin
 * ============================================
 *
 * Halaman utama kontrol panel admin. Fitur:
 * 1. Summary Cards: Total karya, total foto, total video, dan karya unggulan.
 * 2. CRUD Table: Tabel daftar semua portfolio di database dengan aksi EDIT dan DELETE.
 * 3. Delete Confirmation: Dialog konfirmasi sebelum menghapus data secara permanen.
 * 4. Navigasi: Tombol tambah karya baru.
 *
 * Merupakan Client Component karena memerlukan interaksi real-time seperti hapus & refresh.
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Representasi struktur data portfolio
interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  mediaUrls: string[];
  thumbnailUrls: string[];
  featured: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  // State untuk daftar portfolio
  const [items, setItems] = useState<PortfolioItem[]>([]);

  // State loading
  const [isLoading, setIsLoading] = useState(true);

  // State melacak item yang sedang dihapus (untuk loading spinner per baris)
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fungsi untuk memuat daftar portfolio dari database
  const loadPortfolio = async () => {
    try {
      const response = await fetch("/api/portfolio");
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Gagal mengambil data portfolio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  /**
   * Handler untuk menghapus portfolio.
   * Mengirim request DELETE ke API endpoint /api/portfolio/[id].
   */
  const handleDelete = async (id: string, title: string) => {
    // Tampilkan konfirmasi browser sederhana
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus "${title}" secara permanen?`,
    );
    if (!confirmDelete) return;

    setDeletingId(id);

    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Hapus item dari state lokal agar tabel terupdate secara instan
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        alert("Portfolio berhasil dihapus!");
      } else {
        const data = await response.json();
        alert(data.error || "Gagal menghapus portfolio");
      }
    } catch (error) {
      console.error("Error saat menghapus:", error);
      alert("Terjadi kesalahan sistem saat menghapus");
    } finally {
      setDeletingId(null);
    }
  };

  // Hitung statistik untuk dashboard cards
  const totalItems = items.length;
  const totalPhotos = items.filter((item) => item.category === "photo").length;
  const totalVideos = items.filter((item) => item.category === "video").length;
  const totalFeatured = items.filter((item) => item.featured).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Dashboard Admin
          </h1>
          <p className="text-gray-400 text-sm">
            Kelola semua konten foto dan video portofolio Anda.
          </p>
        </div>
        <div>
          <Link
            href="/admin/portfolio/create"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#A855F7] to-[#7C3AED] text-white shadow-lg shadow-[#A855F7]/25 hover:opacity-90 hover:scale-105 active:scale-95 transition-all cursor-pointer"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah Karya Baru
          </Link>
        </div>
      </div>

      {/* Grid Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Karya */}
        <div className="p-6 rounded-2xl bg-[#1E1B4B]/10 border border-white/5 space-y-2">
          <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
            Total Karya
          </p>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#A855F7]">
            {totalItems}
          </p>
        </div>
        {/* Card 2: Total Foto */}
        <div className="p-6 rounded-2xl bg-[#1E1B4B]/10 border border-white/5 space-y-2">
          <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
            Total Foto
          </p>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#A855F7]">
            {totalPhotos}
          </p>
        </div>
        {/* Card 3: Total Video */}
        <div className="p-6 rounded-2xl bg-[#1E1B4B]/10 border border-white/5 space-y-2">
          <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
            Total Video
          </p>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#A855F7]">
            {totalVideos}
          </p>
        </div>
        {/* Card 4: Karya Unggulan */}
        <div className="p-6 rounded-2xl bg-[#1E1B4B]/10 border border-white/5 space-y-2">
          <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
            Karya Unggulan
          </p>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#A855F7]">
            {totalFeatured}
          </p>
        </div>
      </div>

      {/* Tabel CRUD Portfolio */}
      <div className="rounded-2xl border border-white/5 bg-[#1E1B4B]/5 overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center space-y-3">
            <div className="w-10 h-10 rounded-full border-4 border-[#A855F7]/20 border-t-[#A855F7] animate-spin mx-auto" />
            <p className="text-gray-400 text-sm">Memuat daftar portfolio...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#030712] border-b border-white/10 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4 w-20">Media</th>
                  <th className="p-4">Judul</th>
                  <th className="p-4 w-32">Kategori</th>
                  <th className="p-4 w-32">Status</th>
                  <th className="p-4 w-36 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {items.map((item) => {
                  const mediaDisplay =
                    item.thumbnailUrls?.[0] || item.mediaUrls?.[0] || "";
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      {/* Kolom Thumbnail */}
                      <td className="p-4">
                        <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-black border border-white/10">
                          <Image
                            src={mediaDisplay}
                            alt={item.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                      </td>
                      {/* Kolom Judul & ID */}
                      <td className="p-4">
                        <p className="font-semibold text-white line-clamp-1">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">ID: {item.id}</p>
                      </td>
                      {/* Kolom Kategori Badge */}
                      <td className="p-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                            item.category === "video"
                              ? "bg-[#A855F7]/20 text-[#A855F7]"
                              : "bg-white/10 text-white"
                          }`}
                        >
                          {item.category === "video" ? "Video" : "Foto"}
                        </span>
                      </td>
                      {/* Kolom Status (Featured) */}
                      <td className="p-4">
                        {item.featured ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            Unggulan (Featured)
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">Standar</span>
                        )}
                      </td>
                      {/* Kolom Tombol Aksi */}
                      <td className="p-4">
                        <div className="flex gap-2 justify-center">
                          {/* Tombol Edit */}
                          <Link
                            href={`/admin/portfolio/edit/${item.id}`}
                            className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-all"
                          >
                            Edit
                          </Link>
                          {/* Tombol Hapus */}
                          <button
                            onClick={() => handleDelete(item.id, item.title)}
                            disabled={deletingId === item.id}
                            className="px-3.5 py-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 text-xs font-medium transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                          >
                            {deletingId === item.id ? "Menghapus..." : "Hapus"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center space-y-4">
            <svg
              className="w-16 h-16 text-gray-600 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v3m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="text-xl font-bold text-white">
              Belum Ada Portfolio
            </h3>
            <p className="text-gray-400 max-w-sm mx-auto text-sm">
              Tambahkan foto dan video perdana Anda untuk ditampilkan di galeri
              publik.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
