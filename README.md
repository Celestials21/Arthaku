<div align="center">
  <br />
  <h1>💸 ArthaKu</h1>
  <p>
    <strong>Aplikasi Pencatat Keuangan & Manajemen Anggaran Pribadi yang Cerdas</strong>
  </p>
  <br />
</div>

## 🌟 Tentang Aplikasi

**ArthaKu** adalah aplikasi web pencatat keuangan (*financial tracker*) modern yang dibangun untuk membantu Anda mengelola uang dengan lebih cerdas. Dilengkapi dengan fitur analisis pengeluaran visual, manajemen target (*multi-goals*), serta pembatasan anggaran bulanan agar kondisi finansial Anda tetap sehat dan terkontrol.

Aplikasi ini menggunakan sistem *Role-Based Access Control* (User & Admin) yang ditenagai oleh Supabase Authentication.

## ✨ Fitur Utama

- 📊 **Dasbor Cerdas**: Ringkasan saldo secara *real-time* dengan peringatan AI dan *Insight* pengeluaran mingguan.
- 📉 **Analisis Pengeluaran Visual**: Pelacakan pengeluaran berbasis kategori yang divisualisasikan dengan *Pie Chart* interaktif.
- 🎯 **Manajemen Multi-Target**: Buat berbagai target tabungan (misal: Liburan, Laptop) lengkap dengan simulasi waktu pencapaian dan animasi selebrasi (*milestones*).
- 🚧 **Batas Anggaran Kategori**: Tetapkan anggaran bulanan untuk kategori tertentu (seperti Makanan atau Transportasi) untuk mencegah sifat boros.
- 📥 **Ekspor Laporan**: Unduh riwayat laporan transaksi Anda langsung dalam format PDF.
- 🔐 **Autentikasi Aman**: Login dan Register super aman berkat integrasi Supabase Auth (mendukung mode Admin dan Reguler).

## 🚀 Teknologi yang Digunakan

Aplikasi ini dibangun menggunakan arsitektur modern (*Modern Stack*):
- **Framework:** [Next.js](https://nextjs.org/) (App Router) dengan React
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL & Row Level Security)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Visualisasi Data:** [Recharts](https://recharts.org/)
- **Ikon & Komponen:** [Lucide React](https://lucide.dev/)

## 💻 Panduan Instalasi Lokal

Ingin menjalankan **ArthaKu** secara lokal di komputer Anda? Ikuti langkah-langkah di bawah ini:

### 1. Kloning Repositori
```bash
git clone https://github.com/Celestials21/Arthaku.git
cd Arthaku
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment (Variabel Lingkungan)
Buat file bernama `.env.local` di folder *root* dan masukkan kredensial Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Jalankan Aplikasi
```bash
npm run dev
```
Buka browser Anda dan kunjungi `http://localhost:3000`.

---
*Dibuat untuk membantu mencapai kebebasan finansial dengan mencatat satu rupiah pada satu waktu.* 🚀
