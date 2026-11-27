# G1 ACQ Plus (`v8.0.0`) — Modul SKU Uji Coba Gratis & Diskon Tersembunyi Google One (iOS / Android)

> **Atribusi & Kredit Sumber Terbuka (Attribution & Credits)**
> - Proyek ini dikembangkan sebagai perluasan dari proyek sumber terbuka [**`crhywun/g1-acq`**](https://github.com/crhywun/g1-acq) (penulis: [@crhywun](https://github.com/crhywun)), dengan mempertahankan arsitektur inti penulisan ulang respons Shadowrocket `one.google.com`, pengumpulan SKU pasif, dan laporan diagnostik lokal.
> - Terima kasih kepada [@cehomecambodia-lang](https://github.com/cehomecambodia-lang) atas kontribusinya di upstream [PR #3](https://github.com/crhywun/g1-acq/pull/3) berupa uji coba gratis 1 bulan Ultra 20TB / 30TB (`g1.20tb.1month_eft.acq` / `g1.ai.ultra.1month_eft.acq`) serta skema fallback diskon 90% (90p) selama 3 bulan.
> - **Fitur baru pada cabang ini (`v8.0.0`)**: Melalui pemindaian menyeluruh (*brute-force scan*) terhadap 15.000+ kombinasi penamaan kandidat menggunakan `BillingClient`, berhasil ditemukan dan diintegrasikan untuk pertama kalinya **uji coba gratis \$0 Google AI Pro (5 TB) 18 bulan / 15 bulan / 12 bulan / Pelajar 12 bulan**, **uji coba gratis \$0 Google AI Plus (2 TB / 400 GB) 12 bulan**, **uji coba gratis \$0 100 GB / 200 GB 12 bulan / 9 bulan**, serta total 45 paket uji coba gratis dan 80+ paket diskon tersembunyi, lengkap dengan **Panel Kontrol "Ganti Target SKU 1-Klik"** tanpa ubah kode di halaman laporan lokal Safari (`https://one.google.com/g1-sku-report`).

---

## 1. Keunggulan Pembaruan Utama (`v8.0.0` vs versi asli `v7.6.0`)

1. **Penambahan SKU Uji Coba Gratis \$0 Pro 5TB Langsung 18 Bulan / 15 Bulan / 12 Bulan**:
   - Versi asli secara bawaan menulis ulang `g1.ios.2tb.*` menjadi paket berbayar `g1.2tb.ai.12months_ip_90p` (\$1.99/bulan × 12 bulan).
   - `v8.0.0` secara bawaan memprioritaskan penulisan ulang ke SKU baru **`g1.2tb.ai.18months_eft` (Uji coba gratis \$0 Pro 5TB 18 bulan)**, dan dilengkapi 21 preset SKU gratis/promo tersembunyi bawaan.
2. **Panel Kontrol Lokal Safari "Ganti Target SKU 1-Klik"**:
   - Buka `https://one.google.com/g1-sku-report`, lalu cukup klik tombol **「Ganti 1-Klik」** pada tabel di halaman untuk langsung mengganti target penulisan ulang `g1.ios.2tb.*` secara *real-time* di `$persistentStore` lokal ponsel (mendukung gratis 18B, gratis 15B, gratis 12B, `subs_variant`, gratis pelajar 12B, 12B \$1.99, 3B \$1.99, bulan pertama \$0.99, gratis AI Plus 2TB/400GB 12B, dll.), **tanpa perlu mengedit kode JS atau memasang ulang modul**!
3. **Tetap Mendukung Uji Coba Gratis 1 Bulan Ultra 20TB / 30TB + Fallback Cerdas Diskon 90% (90p) 3 Bulan**:
   - `g1.ios.20tb.m.v2` → bawaan `g1.20tb.1month_eft.acq` (gratis 1 bulan), otomatis fallback ke `g1.20tb.3months_ip_90p.acq` (\$9.99/bulan untuk 3 bulan pertama).
   - `g1.ios.30tb.ai.pro.m` → bawaan `g1.ai.ultra.1month_eft.acq` (gratis 1 bulan), otomatis fallback ke `g1.ai.ultra.3months_ip_90p.acq` (\$19.99/bulan untuk 3 bulan pertama).
4. **Dilengkapi Katalog SKU Hasil Pengujian Lengkap ([sku-catalog.json](sku-catalog.json))**:
   - Mencatat 130+ SKU tersembunyi Google One yang valid dari hasil pemindaian penuh beserta rincian fase harga (*Pricing Phases*) secara lengkap.

---

## 2. Alamat Pemasangan Modul Shadowrocket

Di menu **Modules** (Modul) pada Shadowrocket, ketuk ikon tambah di pojok kanan atas dan masukkan alamat berikut:

```text
https://raw.githubusercontent.com/ezajaeja/gemini-offer-ios/main/g1-acq-v8.sgmodule
```
*(Kompatibel dengan alamat nama file lama: `https://raw.githubusercontent.com/ezajaeja/gemini-offer-ios/main/g1-acq-v7.sgmodule`)*

### Langkah Pemasangan dan Penggunaan
1. Tambahkan dan centang untuk mengaktifkan modul di atas pada menu **Modules** Shadowrocket.
2. Masuk ke Shadowrocket **Config → ketuk `(i)` di sebelah kanan konfigurasi aktif → HTTPS Decryption**, aktifkan *HTTPS Decryption* lalu pasang dan percayai sertifikat akar (*root certificate*) Shadowrocket (pastikan `one.google.com` ada di daftar hostname dekripsi).
3. Buka **Safari** dan kunjungi panel kontrol lokal: [https://one.google.com/g1-sku-report](https://one.google.com/g1-sku-report)
   - Jika bagian atas halaman menampilkan **`Skrip Lokal Aktif · v8.0.0`**, berarti modul sudah berjalan.
   - Pada panel **「Ganti Target SKU Tersembunyi 2TB / Pro 5TB 1-Klik」**, pilih target SKU yang ingin Anda uji (bawaan: `g1.2tb.ai.18months_eft`).
4. Buka **Google App iOS (ikon huruf G warna-warni) → ketuk foto profil di pojok kanan atas → Kelola Google One**, masuk ke halaman paket **2TB / Pro** atau **20TB / 30TB Ultra**, lalu buka lembar pembayaran App Store untuk memeriksa harga dan masa uji coba gratis yang ditampilkan.

---

## 3. Daftar SKU Tersembunyi Utama Hasil Pemindaian Penuh

### 1. Google AI Pro (5 TB) — Seri Uji Coba Gratis \$0 & Harga Promo Spesial

| SKU Tersembunyi (Product ID) | Base Plan | Offer ID | Detail Promo | Harga Perpanjangan Normal |
| :--- | :--- | :--- | :--- | :--- |
| **`g1.2tb.ai.18months_eft`** | `monthly` | `eft-18months` | **Uji coba gratis \$0 selama 18 bulan** (`P1Y6M`) | \$19.99/bulan |
| **`g1.2tb.ai.15months_eft`** | `monthly` | `eft-15months` | **Uji coba gratis \$0 selama 15 bulan** (`P1Y3M`) | \$19.99/bulan |
| **`g1.2tb.ai.12months_eft`** | `monthly` | `eft-12months` | **Uji coba gratis \$0 selama 12 bulan** (`P1Y`) | \$19.99/bulan |
| **`g1.2tb.ai.subs_variant`** | `monthly` | `12months-eft` / `6months-eft` / `6months-eft-2` / `6months-eft-ss-2026` | **Uji coba gratis \$0 selama 12 bulan / 6 bulan × 3** | \$19.99/bulan |
| **`g1.play.2tb.ai.student`** | `monthly` | `eft-12mo` | **Jalur Pelajar: Uji coba gratis \$0 selama 12 bulan** (`P1Y`) | \$19.99/bulan |
| **`g1.2tb.ai.6months_eft`** | `monthly` | `eft-6months` | **Uji coba gratis \$0 selama 6 bulan** (`P6M`) | \$19.99/bulan |
| **`g1.2tb.ai.4months_eft`** | `monthly` | `eft-4months` | **Uji coba gratis \$0 selama 4 bulan** (`P4M`) | \$19.99/bulan |
| **`g1.2tb.ai.3months_eft`** | `monthly` | `eft-3months` | **Uji coba gratis \$0 selama 3 bulan** (`P3M`) | \$19.99/bulan |
| **`g1.2tb.ai.2months_eft`** | `monthly` | `eft-2months` | **Uji coba gratis \$0 selama 2 bulan** (`P2M`) | \$19.99/bulan |
| **`g1.play.2tb.ai`** | `monthly` | `eft-3mo` | **Uji coba gratis \$0 selama 3 bulan** (`P3M`) | \$19.99/bulan |
| **`g1.2tb.ai.12months_ip_90p`** | `p1m` | `ip-12mo-90p` | **Diskon 90% 12 bulan pertama: \$1.99/bulan** (total \$23.88/tahun) | \$19.99/bulan |
| **`g1.2tb.ai.12months_ip_75p`** | `p1m` | `introprice` | **Diskon 75% 12 bulan pertama: \$4.99/bulan** | \$19.99/bulan |
| **`g1.2tb.ai.3months_ip_90p.acq`** | `p1m` | `introprice` | **Diskon 90% 3 bulan pertama: \$1.99/bulan** (khusus pengguna baru tanpa langganan) | \$19.99/bulan |
| **`g1.2tb.ai.2months_ip_90p.acq`** | `p1m` | `introprice` | **Diskon 90% 2 bulan pertama: \$1.99/bulan** (khusus pengguna baru tanpa langganan) | \$19.99/bulan |
| **`g1.2tb.ai.1month_ip_95p.acq`** | `p1m` | `introprice` | **Diskon 95% bulan pertama: \$0.99/bulan** (khusus pengguna baru tanpa langganan) | \$19.99/bulan |

### 2. Google AI Ultra (20 TB / 30 TB) — Seri Uji Coba Gratis & Diskon 90% (Khusus Akun Baru Tanpa Langganan)

| SKU Tersembunyi (Product ID) | Paket Terkait | Detail Promo | Harga Perpanjangan Normal |
| :--- | :--- | :--- | :--- |
| **`g1.20tb.1month_eft.acq`** | Ultra 20TB (5x) | **Uji coba gratis \$0 selama 1 bulan** | \$99.99/bulan |
| **`g1.20tb.3months_ip_90p.acq`** | Ultra 20TB (5x) | **Diskon 90% 3 bulan pertama: \$9.99/bulan** | \$99.99/bulan |
| **`g1.20tb.3months_ip_80p`** | Ultra 20TB (5x) | **Diskon 80% 3 bulan pertama: \$19.99/bulan** | \$99.99/bulan |
| **`g1.20tb.3months_ip_75p.acq`** | Ultra 20TB (5x) | **Diskon 75% 3 bulan pertama: \$24.99/bulan** | \$99.99/bulan |
| **`g1.ai.ultra.1month_eft.acq`** | Ultra 30TB (20x) | **Uji coba gratis \$0 selama 1 bulan** | \$199.99/bulan |
| **`g1.ai.ultra.3months_ip_90p.acq`** | Ultra 30TB (20x) | **Diskon 90% 3 bulan pertama: \$19.99/bulan** | \$199.99/bulan |
| **`g1.ai.ultra.3months_ip_75p.acq`** | Ultra 30TB (20x) | **Diskon 75% 3 bulan pertama: \$49.99/bulan** | \$199.99/bulan |

### 3. Google AI Plus (2 TB / 400 GB) & Penyimpanan Dasar (100 GB / 200 GB / 30 GB)

| SKU Tersembunyi (Product ID) | Paket Terkait | Detail Promo | Harga Perpanjangan Normal |
| :--- | :--- | :--- | :--- |
| **`g1.2tb.1year_eft`** | AI Plus (2 TB) | **Uji coba gratis \$0 selama 12 bulan** (`P52W1D`) | \$9.99/bulan |
| **`g1.2tb.6months_eft`** / **`g1.2tb.subs_variant`** | AI Plus (2 TB) | **Uji coba gratis \$0 selama 6 bulan / 3 bulan** | \$9.99/bulan |
| **`g1.2tb.3months_ip_90p.acq`** | AI Plus (2 TB) | **Diskon 90% 3 bulan pertama: \$0.99/bulan** | \$9.99/bulan |
| **`g1.play.helium`** / **`g1.play.helium.student`** | AI Plus (400 GB) | **Uji coba gratis \$0 selama 12 bulan / 6 bulan / 3 bulan** | \$4.99/bulan |
| **`g1.helium.12months_ip_90p`** | AI Plus (400 GB) | **Diskon 90% 12 bulan pertama: \$0.49/bulan** (total \$5.88/tahun) | \$4.99/bulan |
| **`g1.100gb.1year_eft`** / **`g1.100gb.annual.1year_eft`** | 100 GB | **Uji coba gratis \$0 selama 12 bulan** (`P52W1D`) | \$1.99/bulan atau \$19.99/tahun |
| **`g1.100gb.9months_eft`** / **`g1.100gb.180days_eft`** | 100 GB | **Uji coba gratis \$0 selama 9 bulan / 180 hari** | \$1.99/bulan |
| **`g1.200gb.1year_eft`** / **`g1.200gb.180days_eft`** | 200 GB | **Uji coba gratis \$0 selama 12 bulan / 180 hari** | \$2.99/bulan |
| **`g1.30gb.3month_eft`** / **`g1.30gb.1month_eft`** | 30 GB | **Uji coba gratis \$0 selama 3 bulan / 1 bulan** | \$0.89/bulan |

---

## 4. Penafian & Keterangan Sumber

- Penggantian ID produk dalam respons hanya berarti klien mengajukan permintaan kasir App Store / Google Play untuk SKU tertentu; apakah masa uji coba muncul, siklus langganan, dan jumlah tagihan akhir **sepenuhnya mengacu pada tampilan popup kasir asli App Store / Google Play**.
- **Sumber proyek asli**: [https://github.com/crhywun/g1-acq](https://github.com/crhywun/g1-acq) (penulis: [@crhywun](https://github.com/crhywun), kontributor PR #3: [@cehomecambodia-lang](https://github.com/cehomecambodia-lang)).
- Tautan komunitas: Komunitas Sumber Terbuka LinuxDo (https://linux.do/)
Jika ada pertanyaan, hubungi Twitter/X: https://x.com/zixunclub
