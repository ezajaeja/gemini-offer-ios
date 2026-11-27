# Panduan Lengkap G1 ACQ Plus di ProxyPin (Gratis Tanpa Shadowrocket)

**ProxyPin** (`ProxyPin - Open Source Capture`) adalah aplikasi penangkap dan pemodifikasi trafik HTTP/HTTPS yang **100% gratis dan sumber terbuka (*open-source*)** di iOS App Store, Android, Windows, macOS, dan Linux. Di iPhone, ProxyPin berjalan langsung menggunakan **VPN lokal di perangkat** tanpa memerlukan komputer/PC maupun aplikasi berbayar seperti Shadowrocket.

---

## Ringkasan File & Tautan Skrip

- **Skrip ProxyPin:** [`g1-acq-proxypin.js`](../g1-acq-proxypin.js)
- **URL Remote Script (siap tempel):**
  ```text
  https://raw.githubusercontent.com/ezajaeja/gemini-offer-ios/main/g1-acq-proxypin.js
  ```
- **URL Match Rule (wajib persis seperti ini):**
  ```text
  https://one.google.com/*
  ```
- **Panel Kontrol & Laporan Lokal (buka di Safari saat VPN ProxyPin aktif):**
  ```text
  https://one.google.com/g1-sku-report
  ```

> **Catatan Penting Match Rule:** Di dalam ProxyPin, jangan gunakan pola `/ai?*` karena mesin pola URL ProxyPin tidak me-escape karakter `?`. Selalu gunakan `https://one.google.com/*` agar pencocokan untuk `/ai?...` maupun `/g1-sku-report` berjalan dengan benar.

---

## Langkah 1: Instal ProxyPin & Izinkan VPN Lokal

1. Buka **App Store** di iPhone, cari dan instal **`ProxyPin`** (*ProxyPin - Open Source Capture*).
2. Buka ProxyPin, lalu ketuk tombol **Start / Play** untuk pertama kali.
3. Saat iOS meminta izin menambah konfigurasi VPN lokal (**"ProxyPin" Would Like to Add VPN Configurations**), pilih **Allow** dan konfirmasi dengan Face ID / Touch ID / kode sandi.
4. Anda bisa langsung mengetuk **Stop** terlebih dahulu sebelum menyelesaikan pemasangan sertifikat dan skrip di langkah berikutnya.

---

## Langkah 2: Aktifkan Dekripsi HTTPS (HTTPS Proxy) & Pasang Sertifikat Root CA

Agar ProxyPin dapat membaca dan mengubah respons terenkripsi dari `one.google.com`, sertifikat akar (*Root CA*) ProxyPin harus dipasang dan dipercaya penuh di iOS:

1. Di dalam aplikasi **ProxyPin**, buka pengaturan **HTTPS Proxy** (ikon perisai / gembok atau di tab konfigurasi).
2. Aktifkan sakelar **Enable HTTPS Proxy**.
3. Pilih **Install Certificate** / **Download Certificate**, lalu buka tautannya menggunakan browser **Safari** (penting: harus di Safari agar iOS mengizinkan pengunduhan profil konfigurasi).
4. Ketika Safari menampilkan *"This website is trying to download a configuration profile"*, pilih **Allow**.
5. Buka **Settings iOS → General → VPN & Device Management**, pilih profil **ProxyPin CA** di bagian *Downloaded Profile*, lalu ketuk **Install** hingga selesai.
6. **Wajib:** Buka **Settings iOS → General → About → Certificate Trust Settings**, lalu aktifkan sakelar kepercayaan penuh (*Enable Full Trust for Root Certificates*) untuk **ProxyPin CA** dan pilih **Continue**.

---

## Langkah 3 (Disarankan): Batasi Trafik dengan *Proxy Domain Whitelist*

Secara bawaan, ProxyPin mencegat semua domain yang tidak difilter. Agar aplikasi lain tetap lancar dan tidak ikut melewati dekripsi HTTPS saat pengujian berlangsung:

1. Buka menu **Proxy Filter** (*Filter*) di ProxyPin.
2. Masuk ke **Proxy Domain Whitelist**.
3. Tambahkan domain:
   ```text
   one.google.com
   ```
4. Aktifkan *Proxy Domain Whitelist* tersebut.

---

## Langkah 4: Memasang Skrip atau Aturan Rewrite

Pilih salah satu dari tiga metode di bawah ini:

### Metode A — *Load Remote Script* (Paling Praktis, Direkomendasikan)

1. Buka menu **Toolbox / Settings → Scripts** di ProxyPin.
2. Pastikan sakelar **Enable Scripts** di bagian atas dalam keadaan **aktif**.
3. Ketuk tombol **`+` (Add)** untuk membuat skrip baru:
   - **Name:** `G1 ACQ Plus`
   - **URL:** `https://one.google.com/*`
4. Pilih **Load Remote Script**, lalu masukkan URL berikut:
   ```text
   https://raw.githubusercontent.com/ezajaeja/gemini-offer-ios/main/g1-acq-proxypin.js
   ```
5. Ketuk **Save** untuk menyimpan dan pastikan skrip baru tersebut dalam keadaan aktif (tercentang/menyala).

### Metode B — Tempel Skrip Manual (Jika Ingin Mengubah `DEFAULT_TARGET` Permanen)

Jika Anda ingin mengganti target SKU bawaan secara permanen (agar tidak kembali ke `g1.2tb.ai.18months_eft` saat ProxyPin dimulai ulang):

1. Salin seluruh isi file [`g1-acq-proxypin.js`](../g1-acq-proxypin.js).
2. Buka **Scripts → Add (`+`)** dengan **Name:** `G1 ACQ Plus` dan **URL:** `https://one.google.com/*`.
3. Tempel isi skrip ke editor kode skrip (tanpa memakai *Remote Script*).
4. Ubah baris paling atas sebelum fungsi utama:
   ```javascript
   var DEFAULT_TARGET = "com.google.gemini.2tb.ai.m.3month_ip_99p";
   ```
   menjadi salah satu dari 22 SKU preset yang tercantum di komentar bagian atas file tersebut (misalnya `"g1.2tb.ai.12months_ip_90p"` atau `"g1.2tb.ai.18months_eft"`), lalu ketuk **Save**. Anda juga bisa mengubah `DEFAULT_ULTRA_MODE` (`"75p"`, `"gemini99p"`, `"off"`, dll.).

### Metode C — Tanpa Skrip via *Request Rewrite* (Sederhana, Khusus 1 Target)

Jika Anda hanya ingin menguji satu penggantian SKU sederhana tanpa memakai menu *Scripts*:

1. Buka menu **Request Rewrite** di ProxyPin dan aktifkan **Enable Request Rewrite**.
2. Tambah aturan baru (**Add**):
   - **URL:** `https://one.google.com/ai*`
   - **Action / Type:** **Replace Response Body** (*Modify Response*).
3. Masukkan pola/teks SKU sumber (misalnya regex `g1\.ios\.(?:ai\.)?2tb\.[A-Za-z0-9._-]+` atau string `g1.ios.ai.2tb.m.ip_3mo_75p.acq` yang tampak di akun Anda) dan ganti nilainya menjadi target SKU pilihan (misalnya `com.google.gemini.2tb.ai.m.3month_ip_99p`), lalu **Save**.

---

## Langkah 5: Verifikasi Panel Kontrol & Pilih Target SKU di Safari

1. Kembali ke layar utama **ProxyPin** dan ketuk tombol **Start / Play** hingga VPN ProxyPin aktif.
2. Buka browser **Safari** dan kunjungi:
   ```text
   https://one.google.com/g1-sku-report
   ```
3. Pastikan muncul halaman kontrol lokal bertuliskan **`Skrip Lokal ProxyPin Aktif · v8.1.0-proxypin`**.
   *(Catatan cache 15 menit: ProxyPin menyimpan cache Remote Script selama 15 menit. Jika Anda baru memperbarui skrip di GitHub dan Safari masih menampilkan versi lama `v8.0.0-proxypin`, tutup paksa lalu buka ulang ProxyPin, atau masuk ke **Scripts → G1 ACQ Plus → Save** agar ProxyPin mengambil ulang skrip terbaru).*
4. Pada tabel **Ganti Target SKU Tersembunyi 2TB / Pro 5TB 1-Klik**, Anda bisa mengetuk **`Ganti 1-Klik`** untuk mengganti target `g1.ios.2tb.*` & `g1.ios.ai.2tb.*` selama sesi ProxyPin sedang berjalan:
   - **Bawaan & Rekomendasi iOS (`v8.1.0`):** `com.google.gemini.2tb.ai.m.3month_ip_99p` (Pro 5TB diskon 99% selama 3 bulan) dan kandidat `g1.2tb.ai.12months_ip_90p`.
   - Preset bertanda **`[Uji Play/iOS]`** (seperti `g1.2tb.ai.18months_eft`, dll.) berasal dari katalog Google Play; sebagian besar tidak terdaftar di iOS StoreKit sehingga bisa memunculkan error *"Pembelian belum selesai, coba pilih paket lagi"*.
5. Pada tabel **Mode Paket Ultra (20TB / 30TB) 1-Klik**, Anda dapat memilih mode Ultra:
   - **`75p` (Bawaan `v8.1.0`):** `g1.20tb.3months_ip_75p.acq` / `g1.ai.ultra.3months_ip_75p.acq` (diskon 75% 3 bulan).
   - **`gemini99p`:** Mengarahkan `g1.ios.20tb.m.v2` → `com.google.gemini.2tb.ai.m.3month_ip_99p` (ketuk tombol langganan Ultra 20TB di Google App untuk memunculkan kasir Pro 5TB diskon 99% 3 bulan).
   - **`off`:** Membiarkan SKU Ultra asli tanpa penulisan ulang.
   - *(Mode `trial` `1month_eft.acq` & `90p` tetap tersedia untuk pengujian historis, namun saat ini banyak ditutup di iOS).*

---

## Langkah 6: Buka Google App & Cek Kasir App Store

1. **Tutup paksa (*force close*)** aplikasi **Google App** terlebih dahulu jika sebelumnya sudah terbuka di latar belakang, agar tidak memakai cache jaringan lama.
2. Buka **Google App** (ikon huruf **G** warna-warni) → ketuk **foto profil** di pojok kanan atas → pilih **Kelola Google One**.
3. Masuk ke halaman penawaran paket **2TB / AI Pro** (atau **20TB / 30TB Ultra**), ketuk opsi bulanan/tahunan jika tersedia agar permintaan `/ai?...` dimuat ulang.
4. Lanjutkan ke tombol berlangganan dan periksa **nama paket, durasi uji coba gratis, harga awal, dan harga perpanjangan** yang tampil di lembar kasir **App Store**.
5. *(Opsional)* Buka kembali Safari ke `https://one.google.com/g1-sku-report` lalu ketuk **Segarkan Laporan** untuk melihat jumlah penggantian (`hitCount`) dan daftar SKU asli yang tertangkap.

---

## Langkah 7: Pemecahan Masalah (*Troubleshooting*)

- **Muncul popup *"Pembelian belum selesai, coba pilih paket lagi"* saat memilih paket di Google App:**
  - **Untuk paket Ultra (20TB / 30TB):** SKU uji coba `1month_eft.acq` dan `90p` sudah banyak dinonaktifkan oleh Apple/Google sehingga StoreKit menolak ID tersebut. Pastikan sudah memakai `v8.1.0-proxypin` (bawaan mode `75p`), atau coba ganti ke mode `gemini99p` / `off` di halaman kontrol Safari.
  - **Untuk paket 2TB / AI Pro:** Jika Anda memilih preset `eft` (seperti `g1.2tb.ai.18months_eft`), ID tersebut berasal dari katalog Google Play Android (`BillingClient`) dan sering kali tidak tersedia di App Store iOS. Beralihlah ke **`com.google.gemini.2tb.ai.m.3month_ip_99p`** (`[Rekomendasi iOS]`) atau **`g1.2tb.ai.12months_ip_90p`** (`[Kandidat iOS]`) lewat tombol **Ganti 1-Klik** di Safari.
- **Halaman `https://one.google.com/g1-sku-report` masih menampilkan halaman 404 Google:**
  - Pastikan VPN ProxyPin sedang berjalan (**Start**).
  - Pastikan **Enable HTTPS Proxy** aktif dan sertifikat **ProxyPin CA** sudah dipercaya penuh di **Settings → General → About → Certificate Trust Settings**.
  - Periksa kembali aturan URL di menu **Scripts**: harus tertulis persis `https://one.google.com/*`.
- **Permintaan `one.google.com` tidak muncul di tab *Requests* ProxyPin (kemungkinan HTTP/3 QUIC atau koneksi lama):**
  - Tutup paksa (*force close*) Google App.
  - Matikan lalu nyalakan ulang Wi-Fi atau Mode Pesawat sebentar **dalam keadaan ProxyPin sudah berjalan**, atau periksa opsi **IP Layer Proxy** di pengaturan ProxyPin, lalu buka kembali Google App.
- **Cara memverifikasi penulisan ulang langsung di tab *Requests* ProxyPin:**
  - Buka tab **Requests** di ProxyPin dan cari permintaan menuju `https://one.google.com/ai?...`.
  - Periksa bagian **Response Headers**: jika penulisan ulang berhasil, skrip menambahkan header:
    `X-G1-ACQ-ProxyPin: g1-acq-v8.1-proxypin; target=...; ultra=...; hits=...`
    dengan nilai `hits` lebih dari `0`.
- **Setelah selesai digunakan:**
  - Ketuk **Stop** pada ProxyPin agar trafik harian iPhone tidak terus melewati proxy lokal.
