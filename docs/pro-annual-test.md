# Pengujian Promo 12 Bulan Pro & Pemindaian SKU

**Cukup pasang dan aktifkan satu modul G1 ACQ untuk mendukung uji coba gratis 1 bulan Ultra dan pengujian promo 12 bulan 2TB**, sekaligus mengumpulkan SKU asli secara pasif, menjalankan penulisan ulang 3 paket, dan melihat laporan lokal; `v7.6.0` tetap menyediakan diagnostik 10 respons terakhir, penambahan baru, dan duplikat. Skrip terlebih dahulu mengumpulkan ID produk dari respons teks asli `one.google.com/`, lalu hanya pada respons `/ai?` mengganti **SKU lengkap iOS 2TB asli** berawalan `g1.ios.2tb.` menjadi `g1.2tb.ai.12months_ip_90p`; untuk 20TB / 30TB secara bawaan menggunakan SKU uji coba gratis 1 bulan Ultra `g1.20tb.1month_eft.acq` / `g1.ai.ultra.1month_eft.acq`, dan masing-masing fallback secara independen ke SKU cadangan 90p 3 bulan yang sesuai. 2TB menggunakan kandidat tetap yang ditentukan pengguna tanpa paket cadangan; pemetaan lengkap lihat Bagian 4. Versi skrip respons saat ini adalah `g1-acq-v7.6`.

Versi ini mengintegrasikan [GitHub PR #3](https://github.com/crhywun/g1-acq/pull/3), menambahkan dukungan uji coba gratis 1 bulan Ultra untuk paket 20TB / 30TB; apakah uji coba ditampilkan pada akun saat ini, siklus langganan aktual, dan nominal perpanjangan mengikuti catatan kasir App Store, sedangkan hak paket mengikuti status aktual akun Google One.

Kolektor hanya membaca respons cocok yang benar-benar diterima ponsel, dan **tidak secara aktif menanyakan seluruh daftar SKU**. ID lama yang muncul kembali akan menambah jumlah hitungan, bukan menjadi ID baru; melihat daftar lama tidak cukup untuk menyimpulkan skrip ponsel gagal, dan putaran ini belum memiliki kesimpulan kegagalan perangkat nyata yang terverifikasi.

**Kandidat lengkap pengujian promo 12 bulan putaran ini adalah `g1.2tb.ai.12months_ip_90p`, tanpa akhiran `.acq`.** Item pertama tangkapan layar pengguna menampilkan kandidat tersebut beserta label harga `$1.99 × 12 months = $23.88/year`, yang menggambarkan promo bulanan selama 12 bulan berturut-turut; `90p` berarti **diskon 90% (90% off, bayar sekitar 10%)**, bukan membayar 90%. `$23.88/year` adalah label total 12 bulan pada tangkapan layar, bukan bukti penagihan tahunan sekaligus.

Judul tangkapan layar bertuliskan **Pro 5TB**, sedangkan produk sumber putaran ini tetap SKU lengkap iOS 2TB asli berawalan `g1.ios.2tb.`, tanpa penambahan prefiks sumber 5TB baru. Tangkapan layar merupakan sumber kandidat dan label harga, bukan data produk toko iOS yang terverifikasi, dan tidak membuktikan harga iOS aktual, siklus penagihan, atau hak kapasitas 5TB. Lingkungan operasi adalah Shadowrocket dan Google App pada iPhone; nama kandidat, siklus, nominal awal, dan nominal perpanjangan perlu diverifikasi setelah App Store benar-benar mengembalikan produk, sementara hak paket mengacu pada tampilan akun Google One. Pengujian offline memverifikasi pencocokan string dan perilaku laporan.

## 1. Pemasangan atau Pembaruan Modul Utama

**G1 ACQ — Uji coba gratis 1 bulan Ultra, pengujian promo 12 bulan 2TB, pengumpulan pasif, diagnostik 10 respons terakhir, dan ekspor JSON**

```text
https://cdn.jsdelivr.net/gh/crhywun/g1-acq@v7.6.0/g1-acq-v7.sgmodule
```

Untuk pemasangan pertama kali, tambahkan alamat di atas di manajemen modul Shadowrocket lalu aktifkan; untuk pembaruan dari versi lama, ganti alamat **G1 ACQ** lama dengan alamat ini satu kali. Nama modul tetap **G1 ACQ**; titik masuk pemasangan dan seluruh skrip internal dipin tetap ke `@v7.6.0`, tidak perlu menambahkan skrip secara terpisah. Setelah memasang atau memperbarui, sambungkan ulang lalu buka kembali halaman paket di Google App. Merilis versi baru mengharuskan pembaruan konten skrip sekaligus pin versi tetap; menggabungkan PR tidak otomatis memperbarui atau menonaktifkan alamat CDN pin lama, dan alamat lama tetap merujuk ke versinya semula. Pembaruan mempertahankan riwayat catatan; pemasangan ulang berulang tidak memaksa server mengirim SKU baru, jadi saat melakukan diagnostik bandingkan versi, hitungan, dan waktu respons terlebih dahulu.

Pengumpulan dan penulisan ulang dijalankan berurutan di dalam modul utama yang sama, tidak perlu memasang atau mengganti ke **G1 SKU Scan**. Jika hanya satu modul utama yang terpasang, tidak ada langkah penonaktifan tambahan; jika sebelumnya pernah memasang pemindai terpisah, **G1 Pro Annual Test**, atau salinan penulisan ulang lainnya, nonaktifkan salinan lama tersebut agar tidak terjadi penghitungan atau penulisan ulang ganda. Tag historis `v7.0.0` / `v7.1.0` / `v7.2.0` / `v7.3.0` / `v7.4.0` / `v7.5.0` dan `pro-annual-test-v1` / `pro-annual-test-v2` tetap dipertahankan apa adanya.

Diagnostik aktivitas respons versi ini berasal dari skrip utama `g1-acq-v7.6`. Titik masuk kompatibilitas **G1 Pro Annual Test** merujuk ke skrip baru yang sama, namun tetap hanya mencocokkan `/ai?`; titik masuk kompatibilitas terpisah **G1 SKU Scan** hanya memperbarui pin unduhan, sedangkan skrip pemindainya mempertahankan implementasi lama dengan versi catatan pengumpulan tetap `pro-annual-test-v2` dan tanpa kolom aktivitas respons baru. Saat laporan versi baru membaca catatan pemindaian terpisah tersebut, laporan menampilkan versi lama yang sebenarnya dan status **Catatan pengumpulan lama**, dengan `recentResponses` kosong tanpa mengarang aktivitas.

Modul utama mencakup skrip laporan lokal, hanya menambahkan hostname MITM `one.google.com`, dan tetap menggunakan aturan pemblokiran global UDP 443 sebelumnya; aturan tersebut juga dapat memengaruhi HTTP/3, kecepatan, atau konektivitas aplikasi lain.

## 2. Konfigurasi Dekripsi HTTPS

Agar modul dapat memproses respons HTTPS, dekripsi harus diaktifkan dan sertifikat dipercaya pada konfigurasi yang sedang digunakan.

1. Aktifkan **G1 ACQ** yang dipasang dari alamat `v7.6.0` pada Bagian 1; pengguna versi lama cukup memperbarui satu kali sesuai Bagian 1 dan biarkan VPN Shadowrocket tetap terhubung.
2. Masuk ke **Config → ikon `(i)` di sebelah kanan konfigurasi aktif → HTTPS Decryption**, lalu aktifkan sakelar dekripsi.
3. Jika sudah memiliki sertifikat Shadowrocket yang valid dan dipercaya, gunakan langsung; jika belum, buat dan pasang sertifikat di halaman tersebut, lalu buka **Settings iOS → General → VPN & Device Management** untuk menyelesaikan pemasangan profil.
4. Saat pertama kali mengonfigurasi sertifikat, buka **Settings iOS → General → About → Certificate Trust Settings**, lalu aktifkan kepercayaan penuh untuk sertifikat akar Shadowrocket terkait.
5. Periksa `one.google.com` di **daftar hostname HTTPS Decryption** pada konfigurasi aktif. Modul menggunakan `%APPEND%` untuk menambahkan domain ini; ini adalah daftar dekripsi HTTPS, bukan DNS Hosts.
6. Setelah mengubah sakelar modul atau pengaturan dekripsi, sambungkan ulang Shadowrocket lalu buka kembali halaman paket di Google App.

[Bagian pemasangan & konfigurasi di README](../README.md#2-alamat-pemasangan-modul-shadowrocket) menjelaskan pengaturan konfigurasi aktif dan HTTPS Decryption. Hostname MITM mencakup seluruh domain `one.google.com`, sedangkan cakupan pembacaan dan penulisan ulang skrip dibatasi oleh pencocokan URL di bawah ini.

## 3. Menelusuri Paket & Mengumpulkan SKU Asli Secara Pasif

Cukup biarkan satu modul **G1 ACQ** yang sama tetap aktif. Setiap kali memproses respons teks `one.google.com/`, skrip utama terlebih dahulu mengumpulkan isi asli sebelum memeriksa apakah respons tersebut memerlukan penulisan ulang 3 paket, sehingga ID kandidat yang tercatat tidak tergantikan oleh penulisan ulang berikutnya; respons non-teks yang cocok hanya dihitung ke dalam diagnostik non-teks.

1. Pastikan Shadowrocket tetap terhubung, tempelkan lengkap [alamat laporan lokal](https://one.google.com/g1-sku-report) di bilah alamat Safari pada ponsel yang sama, lalu pastikan terlihat **Skrip Lokal Aktif** dan versi laporan **v7.6.0**; catat terlebih dahulu `scan.version`, `scannedResponses`, `matchedResponses`, `nonTextResponses`, dan waktu respons terbaru.
2. Buka **Google App (ikon huruf G warna-warni) → Kelola Google One**, lalu buka kembali paket **2TB / Pro** yang benar-benar ditawarkan di halaman; saat memeriksa pemetaan uji coba gratis 1 bulan Ultra, telusuri juga paket **20TB / 30TB** yang ditawarkan di halaman.
3. Jika halaman menyediakan tombol pindah bulanan/tahunan, buka satu per satu dan tunggu hingga selesai dimuat. Hanya respons cocok yang baru diterima yang menghasilkan aktivitas pengumpulan, tanpa perlu menyelesaikan pembelian; akun, wilayah, dan versi aplikasi menentukan paket serta tombol yang tampil, sementara cache halaman juga memengaruhi apakah permintaan baru dikirim.
4. Kembali ke Safari dan segarkan laporan, bandingkan hitungan serta respons terbaru, lalu lihat jumlah penambahan baru dan statusnya. Hitungan bertambah dengan status `known-skus` berarti data duplikat; tidak adanya penambahan di daftar tidak berarti pengumpulan berhenti. Jika hitungan dan waktu respons terbaru tidak berubah sama sekali, itu hanya memastikan tidak ada catatan pengumpulan baru yang tersimpan pada putaran ini; kegagalan penulisan penyimpanan juga mempertahankan hitungan lama—periksa log `saved=no` / `SKU collection unavailable`, cache, cakupan pencocokan, dan konfigurasi modul sesuai Bagian 7.
5. Lihat bagian "Kandidat SKU yang dikumpulkan saat menjelajahi halaman", lalu catat ID lengkap, jumlah kemunculan, dan waktu ditemukan terakhir. Cari ID lengkap berawalan `g1.ios.2tb.` yang benar-benar muncul; untuk 20TB / 30TB, cocokkan dengan dua ID sumber lengkap di Bagian 4 tanpa melengkapi atau menebak akhiran sendiri.
6. Ketuk tombol **Ekspor JSON** pada area aksi laporan untuk menyimpan hasil, atau buka langsung [alamat ekspor JSON](https://one.google.com/g1-sku-report?format=json).

Pengumpulan pasif mencakup respons teks di bawah `https://one.google.com/`, melewati `/g1-sku-report`, jalur yang sama dengan akhiran `/`, beserta query-nya. Kolektor mengenali string `g1.*` dan `com.google.one.*`, melakukan deduplikasi per ID dan mengakumulasi jumlah kemunculan; kemunculan berulang ID yang sama dalam satu respons atau pada respons berikutnya menambah hitungan—hitungan ini bukan jumlah pembelian.

Maksimal tersimpan **300 ID berbeda**. Setelah mencapai batas, sistem tetap memperbarui hitungan dan waktu untuk ID yang sudah tersimpan; ID baru yang melebihi batas tidak ditambahkan ke daftar, dan `omittedCount` mencatat jumlah ID berbeda yang terbuang karena kapasitas pada putaran ini. Jika `addedCount>0`, status diprioritaskan menjadi `new-skus` meskipun ada ID yang terbuang karena kapasitas; hanya jika `addedCount=0` dan `omittedCount>0`, status ditandai `limit-reached`. Pertahankan daftar lama untuk membandingkan penambahan dan duplikat; bersihkan kedua kunci secara manual melalui Bagian 5 setelah ekspor hanya jika Anda benar-benar ingin mengatur ulang riwayat—diagnostik harian tidak perlu dibersihkan.

Pada salinan teks yang digunakan untuk pengenalan, kolektor memulihkan `\u002e`, `\x2e`, serta entitas titik HTML; langkah pemulihan ini tidak mengubah respons asli. Setelah pengumpulan selesai, hanya respons yang cocok dengan `/ai?` yang masuk ke penulisan ulang 3 paket, sementara respons lainnya dikembalikan apa adanya. Skrip tidak membaca header atau body permintaan, tidak menyimpan isi respons lengkap, tidak menanyakan App Store, dan tidak mengirim data pengumpulan ke luar.

## 4. Menguji Promo 12 Bulan 2TB & Uji Coba Gratis 1 Bulan Ultra

Pengumpulan dan penulisan ulang dijalankan berurutan secara otomatis oleh modul utama; tetap aktifkan **G1 ACQ** yang sama saat memeriksa lembar kasir.

1. Pastikan **G1 ACQ** versi baru aktif dan Shadowrocket terhubung, tanpa perlu mengganti ke modul pengumpul.
2. Periksa sakelar, hostname `one.google.com`, dan kepercayaan sertifikat iOS di **(i) konfigurasi aktif → HTTPS Decryption**, lalu sambungkan ulang Shadowrocket.
3. Tutup halaman paket yang sedang terbuka, lalu masuk kembali ke paket **2TB / Pro** dari **Google App (ikon G warna-warni) → Kelola Google One**. Produk sumber untuk uji promo 12 bulan adalah iOS 2TB asli; saat memeriksa pemetaan uji coba gratis 1 bulan Ultra, buka masing-masing paket 20TB / 30TB yang tersedia di halaman.
4. Lanjutkan ke alur berlangganan dari paket yang ditampilkan di halaman, lalu periksa **nama produk, siklus langganan, mata uang, nominal awal, dan nominal perpanjangan** di kasir App Store. Jika kasir tidak muncul, catat pesan aktual di layar; catat hasil 2TB, 20TB, dan 30TB secara terpisah.
5. Buka [laporan lokal](https://one.google.com/g1-sku-report) di Safari, periksa versi, waktu eksekusi, dan status pada "Pemetaan 3 Paket Terakhir"; "Total penggantian" adalah jumlah ketiga paket, "Di antaranya 2TB" adalah jumlah penulisan ulang promo 2TB / Pro, dan di bawahnya ditampilkan per baris ID sumber lengkap, target aktual, serta status cadangan.
6. Ketuk tombol **Ekspor JSON** pada area aksi laporan, atau buka [alamat ekspor JSON](https://one.google.com/g1-sku-report?format=json), simpan nilai `reportVersion`, `configuredTarget`, `test.version`, `test.matchedFrom`, `test.target`, `test.targetOrigin`, `test.hitCount`, `test.annualHitCount`, `test.status`, dan `test.updatedAt`, lalu catat bersama hasil tampilan App Store kali ini.

Skrip utama terlebih dahulu mengumpulkan SKU dari respons teks asli yang cocok dengan `^https://one\.google\.com/`, lalu hanya pada respons yang cocok dengan `^https://one\.google\.com/ai\?` mengenali ID teks polos lengkap dan menerapkan pemetaan berikut:

| SKU Sumber Lengkap di Body | Target Bawaan | Target Cadangan |
|---|---|---|
| SKU lengkap berawalan `g1.ios.2tb.` | `g1.2tb.ai.12months_ip_90p` (kandidat pilihan pengguna) | Tidak ada |
| `g1.ios.20tb.m.v2` | `g1.20tb.1month_eft.acq` (Uji coba gratis 1 bulan Ultra) | `g1.20tb.3months_ip_90p.acq` (Promo 90p tiga bulan) |
| `g1.ios.30tb.ai.pro.m` | `g1.ai.ultra.1month_eft.acq` (Uji coba gratis 1 bulan Ultra) | `g1.ai.ultra.3months_ip_90p.acq` (Promo 90p tiga bulan) |

ID sumber lengkap 2TB yang cocok selalu diganti menjadi kandidat `g1.2tb.ai.12months_ip_90p`, tanpa target cadangan dan tidak mensyaratkan target tersebut muncul terlebih dahulu di dalam body. 20TB / 30TB harus cocok persis dengan ID sumber lengkap pada tabel, dan setiap paket menentukan targetnya secara independen berdasarkan body respons asli:

- Jika target bawaan `1month_eft` untuk paket tersebut muncul di body, target bawaan diprioritaskan; meskipun cadangan 90p yang sesuai juga muncul, tetap gunakan target bawaan dan catat `fallback=false`.
- Jika target bawaan `1month_eft` tidak muncul sementara cadangan 90p yang sesuai muncul, gunakan 90p untuk paket tersebut dan catat `fallback=true`.
- Jika baik target bawaan maupun cadangan 90p tidak muncul, tetap ganti dengan target bawaan `1month_eft` dan catat `fallback=false`.

Penentuan fallback 20TB hanya menggunakan target 20TB, dan penentuan fallback 30TB hanya menggunakan target 30TB. `75p` tidak lagi menjadi target fallback pada versi ini; hanya catatan historis versi lama yang menyimpan `g1.20tb.3months_ip_75p.acq` atau `g1.ai.ultra.3months_ip_75p.acq` sebagai target cadangan aktual. Ini adalah pengecekan string target di body respons, bukan kueri katalog produk ke App Store. ID lain dibiarkan utuh; jika ketiga paket tidak cocok, respons dikembalikan apa adanya. Kedua target bawaan `1month_eft` menyediakan jalur uji coba gratis 1 bulan Ultra; 90p tiga bulan adalah promo cadangan tiap paket—laporan dan catatan perangkat nyata harus membedakan uji coba dan promo cadangan berdasarkan `to` aktual kali ini.

| Kolom Laporan | Arti |
|---|---|
| `reportVersion` | Versi skrip laporan saat ini `v7.6.0`, ditampilkan terpisah dari versi catatan eksekusi tersimpan |
| `configuredTarget` | Kandidat 2TB yang dikonfigurasi saat ini `g1.2tb.ai.12months_ip_90p` |
| `test.version` | Versi skrip yang menghasilkan catatan eksekusi tersebut; skrip utama saat ini adalah `g1-acq-v7.6`, sedangkan catatan lama yang dipertahankan tetap menampilkan versi aslinya |
| `test.matchedFrom` | ID sumber lengkap yang benar-benar cocok pada respons ini, format per baris `{id, to, count, fallback}`; `to` adalah target aktual sumber tersebut kali ini, `count` adalah jumlah penulisan ulangnya; `fallback=true` berarti memakai paket cadangan versi eksekusi terkait (versi ini memakai 90p terkait, catatan historis lama dapat berupa 75p), dan laporan membedakannya berdasarkan `to` aktual |
| `test.target` | Target 2TB yang benar-benar tersimpan saat eksekusi terakhir; catatan baru dan catatan v7.5 lama sama-sama `g1.2tb.ai.12months_ip_90p`, namun `test.version` v7.5 lama tetap `g1-acq-v7.5`; catatan v7.3 / v7.4 lama menyimpan `g1.2tb.ai.annual_ip_90p.acq`, catatan v7.2 lama menyimpan `g1.2tb.ai.annual.3months_ip_90p.acq`, catatan v1 / v7.1 lama tetap `g1.2tb.ai.annual`; target aktual 20TB / 30TB dilihat dari `to` per baris |
| `test.targetOrigin` | Catatan kandidat baru dan catatan v7.3 / v7.4 / v7.5 lama bernilai `user-specified`, catatan v7.2 lama tetap `pattern-derived`, catatan tahunan biasa v1 / v7.1 lama bernilai `legacy`, dan kosong jika belum ada catatan eksekusi |
| `test.hitCount` | Total penulisan ulang ketiga paket pada respons ini; sesuai dengan `hits=N` pada keluaran skrip |
| `test.annualHitCount` | Mempertahankan nama kolom kompatibel, hanya menghitung penulisan ulang promo 2TB / Pro pada respons ini; sesuai dengan `annualHits=N` pada keluaran skrip dan tampil sebagai "Di antaranya 2TB" di laporan; nama kolom dan hitungan tidak membuktikan penagihan tahunan |
| `test.updatedAt` | Waktu eksekusi terakhir, UTC |
| `test.status = rewritten` | Setidaknya satu dari tiga paket telah menjalani penggantian string; status ini juga berlaku jika hanya 20TB / 30TB yang cocok |
| `test.status = no-match` | Tidak ada ID sumber lengkap dari ketiga paket yang cocok pada respons teks ini; respons dikembalikan apa adanya |
| `test.status = non-text` | Respons kali ini tidak memiliki body teks yang dapat diproses; respons dikembalikan apa adanya |

Log saat ini menggunakan prefiks `[g1-acq]` dengan format ringkasan `g1-acq-v7.6 hits=N annualHits=N`, serta mencetak per baris `SKU sumber → target aktual xN`; saat 20TB / 30TB memilih paket cadangan, baris tersebut menyertakan `fallback=ID_target_lengkap_aktual`, pada versi ini masing-masing `fallback=g1.20tb.3months_ip_90p.acq` atau `fallback=g1.ai.ultra.3months_ip_90p.acq`. `fallback=75p` pada log versi lama hanya merupakan format historis. Nilai `to` di laporan sesuai dengan log per baris, HTML menampilkan cadangan 90p atau cadangan historis 75p berdasarkan `to` aktual, sementara `hits` dan `annualHits` di ringkasan utama masing-masing sesuai dengan `hitCount` dan `annualHitCount`.

Yang tersimpan di sini adalah **catatan eksekusi terakhir yang masuk ke pemeriksaan penulisan ulang 3 paket**, bukan riwayat pengujian kumulatif; respons nol-kecocokan berikutnya dalam cakupan tersebut juga akan memperbarui catatan. `configuredTarget` menunjukkan konfigurasi saat ini, sedangkan `test.target` menunjukkan target aktual yang tersimpan pada eksekusi terakhir; target 2TB pada catatan v7.5 lama tetap `g1.2tb.ai.12months_ip_90p` dengan asal `user-specified` dan `test.version` tetap `g1-acq-v7.5`; catatan v7.3 / v7.4 lama tetap menyimpan `g1.2tb.ai.annual_ip_90p.acq` dan `user-specified`, catatan v7.2 lama menyimpan `g1.2tb.ai.annual.3months_ip_90p.acq` dan `pattern-derived`, catatan v1 / v7.1 lama menyimpan `g1.2tb.ai.annual` dan `legacy`. Pembaruan sendiri mempertahankan ID historis, target aktual, versi lama, dan `test.targetOrigin` lama tanpa melabelinya ulang sebagai kandidat saat ini atau `user-specified`. Meskipun targetnya sama, tetap periksa `test.version` dan waktu eksekusi; kesamaan target 2TB saja tidak berarti catatan v7.5 lama sudah diperbarui. Jumlah kecocokan hanya membuktikan penggantian teks, tidak membuktikan App Store menerima produk target atau langganan telah selesai.

`hitCount=0` dan `status=no-match` berarti tidak ada satu pun dari ketiga paket yang cocok pada respons teks kali ini, bukan berarti akun tidak memiliki produk 2TB atau produk target tidak ada. Jika `annualHitCount=0` dan `hitCount>0`, berarti hanya 20TB / 30TB yang cocok dan status tetap `rewritten`; untuk menilai pengujian promo 12 bulan 2TB, lihat `annualHitCount` lalu cocokkan `id` dan `to` pada tiap baris.

Cakupan pengumpulan modul utama yang sama meliputi seluruh `one.google.com/` dan dapat mengenali titik yang di-escape; penulisan ulang 3 paket hanya memproses ID teks polos lengkap di dalam teks asli `/ai?`. Oleh karena itu, munculnya ID kandidat di laporan tidak menjamin respons `/ai?` lain akan cocok. Saat paket target tidak cocok, lanjutkan menelusuri paket yang benar-benar ditampilkan dan periksa ID lengkap hasil pengumpulan pasif sesuai Bagian 3, tanpa perlu mengganti modul ataupun menebak SKU iOS baru.

## 5. Halaman Hasil Lokal, Ekspor, dan Pembersihan

Pastikan Shadowrocket terhubung dan **G1 ACQ** versi baru aktif, lalu tempelkan lengkap [alamat laporan lokal](https://one.google.com/g1-sku-report) di bilah alamat Safari. Bagian atas halaman harus menampilkan **Skrip Lokal Aktif** dan penanda **v7.6.0**, dengan tombol **Ekspor JSON** di area aksi; ketuk tombol tersebut untuk mengekspor, atau gunakan alamat langsung di bawah ini:

| Alamat | Aksi |
|---|---|
| [Laporan Lokal](https://one.google.com/g1-sku-report) | Menampilkan hasil pengumpulan kumulatif dan catatan uji gabungan 3 paket terakhir |
| [Ekspor JSON](https://one.google.com/g1-sku-report?format=json) | Mengembalikan respons unduhan `g1-sku-report.json` |
| [Bersihkan Catatan Alat Ini](https://one.google.com/g1-sku-report?clear=1) | Menghapus catatan pengumpulan dan catatan pengujian terakhir milik alat ini |

**Alamat menggunakan domain Google, tetapi halaman laporan disediakan oleh skrip lokal di ponsel.** Skrip `http-request` Shadowrocket mengambil alih `https://one.google.com/g1-sku-report` (juga mendukung `/` di akhir dan query), membuat HTML atau JSON secara lokal lalu langsung mengembalikannya tanpa meneruskan permintaan ke Google. HTML tidak memuat sumber daya eksternal, dan skrip laporan maupun ekspor tidak melakukan pengiriman data jaringan keluar.

Jika yang muncul adalah halaman Google biasa atau 404, berarti laporan lokal tidak tampil kali ini. Periksa apakah **G1 ACQ** versi baru aktif, Shadowrocket terhubung, **Konfigurasi aktif (i) → HTTPS Decryption**, hostname `one.google.com`, dan sertifikat yang dipercaya di iOS, lalu tempelkan URL laporan lengkap ke bilah alamat Safari.

Data disimpan di `$persistentStore` ponsel dengan waktu pengumpulan, event respons, dan catatan eksekusi menggunakan UTC; kedua nama kunci dan `schemaVersion: 1` tetap tidak berubah:

| Kunci | Isi |
|---|---|
| `g1.sku.scan.v1` | ID kandidat, jumlah kumulatif, waktu ditemukan terakhir, versi pengumpulan aktual, hitungan respons teks/cocok/non-teks, status batas kapasitas, serta hingga 10 event respons yang telah disanitasi |
| `g1.pro.annual.test.v1` | Versi skrip eksekusi terakhir, prefiks sumber 2TB, ID sumber yang cocok pada 3 paket beserta target aktual & status cadangan per baris, target 2TB, total penulisan ulang, penulisan ulang 2TB, waktu, dan status |

HTML menampilkan per baris ID sumber lengkap, target aktual, jumlah, dan status cadangan agar `test.target` tidak salah dibaca sebagai target 20TB / 30TB. Target bawaan versi ini masing-masing adalah `g1.20tb.1month_eft.acq` / `g1.ai.ultra.1month_eft.acq`; target cadangan masing-masing adalah `g1.20tb.3months_ip_90p.acq` / `g1.ai.ultra.3months_ip_90p.acq`. HTML menggabungkan `fallback` dan `to` aktual untuk menampilkan cadangan 90p, cadangan historis 75p, atau "Tidak"; jika ditandai cadangan namun informasi target kurang memadai, hanya tampil "Ya", sementara baris 20TB / 30TB versi lama mempertahankan target dan status cadangan aslinya. Halaman hasil baru kompatibel dengan catatan khusus 2TB v1 lama: baris lama yang tidak memiliki `to` diisi dengan target tahunan biasa semula `g1.2tb.ai.annual`, dan `annualHitCount` yang tidak ada dihitung dari jumlah baris 2TB lama; baris lama ditampilkan sebagai tidak memakai paket cadangan. `test.target` catatan v1 / v7.1 lama mempertahankan target tahunan biasa semula dengan `test.targetOrigin` menampilkan `legacy`; catatan v7.2 lama mempertahankan `g1.2tb.ai.annual.3months_ip_90p.acq` dan `pattern-derived`; catatan v7.3 / v7.4 lama mempertahankan `g1.2tb.ai.annual_ip_90p.acq` dan `user-specified`; catatan v7.5 lama mempertahankan `g1.2tb.ai.12months_ip_90p` yang sama dengan konfigurasi saat ini, `user-specified`, serta versi lama `g1-acq-v7.5`. Pembaruan tidak melabeli ulang ID lama, asal lama, atau versi lama. Untuk mempertahankan catatan lama, tidak perlu menghapus kedua kunci ini terlebih dahulu.

Kolom pengumpulan inti di JSON adalah `scan.skus` dengan tiap item berisi `id`, `count`, dan `lastSeen`; kolom pengujian lihat Bagian 4. Laporan menampilkan **versi laporan `reportVersion=v7.6.0`** dan **versi catatan pengumpulan aktual `scan.version`** secara terpisah; nilai kedua berasal dari catatan tersimpan dan kolektor utama versi ini adalah `g1-acq-v7.6`. Catatan skrip lama menampilkan **Catatan pengumpulan lama; belum ada catatan respons pengumpulan versi ini yang tersimpan.** Jika versi tidak diketahui atau belum ada catatan, ditandai **Belum ada catatan respons pengumpulan versi ini yang tersimpan.** Memperbarui skrip laporan saja tidak berarti kolektor baru sudah menerima respons, dan label tersebut bukan kesimpulan kerusakan ponsel.

| Kolom Pengumpulan | Arti |
|---|---|
| `scan.version` | Versi skrip yang menghasilkan catatan pengumpulan aktual, mempertahankan nilai asli catatan lama |
| `scan.scannedResponses` | Jumlah kumulatif respons teks; arti semula tetap, non-teks tidak dihitung |
| `scan.matchedResponses` | Jumlah kumulatif respons teks yang minimal mengenali satu ID kandidat (ID duplikat tetap dihitung cocok); arti semula tetap |
| `scan.nonTextResponses` | Jumlah kumulatif respons non-teks, dipisah dari respons teks |
| `scan.recentResponses` | Maksimal 10 event; array JSON disimpan berurutan lama → baru (jika lebih dari 10, event tertua dibuang); tabel HTML ditampilkan baru → lama |

Setiap event respons memiliki kolom berikut:

| Kolom Event | Arti |
|---|---|
| `at` | Waktu pemrosesan respons ini, UTC |
| `path` | Kategori jalur tetap, hanya bernilai `/`, `/ai`, `/plans`, `/_/…/data/batchexecute`, atau `[Jalur one.google.com lainnya]` |
| `bodyType` | Tipe body respons, tidak berisi isi body |
| `status` | Status diagnostik pengumpulan respons ini, lihat tabel di bawah |
| `candidateCount` | Jumlah ID kandidat berbeda yang dikenali dalam respons ini; ID yang muncul berkali-kali hanya dihitung 1 kandidat |
| `addedCount` | Jumlah ID berbeda yang baru ditambahkan dan benar-benar disimpan kali ini |
| `omittedCount` | Jumlah ID berbeda yang terbuang karena batas kapasitas 300 ID pada respons ini; ID tidak tersimpan yang muncul berkali-kali hanya dihitung 1 kali buang |

| `status` | Arti |
|---|---|
| `new-skus` | `addedCount>0`, terdapat ID baru yang disimpan kali ini; meskipun `omittedCount>0`, status ini tetap diprioritaskan |
| `known-skus` | Seluruh ID yang dikenali kali ini sudah pernah tersimpan; hanya memperbarui jumlah kumulatif dan waktu ditemukan |
| `no-skus` | Tidak ada ID kandidat yang dikenali pada respons teks kali ini |
| `limit-reached` | Hanya digunakan saat `addedCount=0` dan `omittedCount>0`: tidak ada ID baru yang tersimpan dan terjadi pembuangan kapasitas |
| `non-text` | Respons kali ini bukan teks yang dapat dikumpulkan; menambah `nonTextResponses` |

`candidateCount`, `addedCount`, dan `omittedCount` dihitung per ID berbeda dalam setiap respons; `scan.skus[].count` tetap mengakumulasi jumlah kemunculan string—keduanya memiliki arti berbeda. Jika catatan yang sudah ada tidak memiliki `recentResponses`, laporan tidak mengarang riwayat respons dari waktu lama atau hitungan kumulatif; hanya respons nyata berikutnya yang diproses yang menghasilkan event baru. Hitungan lama dan kandidat asli tetap dipertahankan, dan 10 respons terakhir tidak mewakili seluruh riwayat.

Jalur respons disanitasi tetap: `…` pada `/_/…/data/batchexecute` adalah teks tampilan tetap; jalur lain digolongkan ke `[Jalur one.google.com lainnya]`. Event dan ekspor tidak menyimpan query, URL lengkap, header permintaan, header respons, body permintaan, maupun body respons. Laporan menampilkan waktu respons terakhir dan riwayat respons terbaru untuk dicocokkan dengan waktu pembukaan halaman paket kali ini.

`?clear=1` tetap merupakan operasi manual yang hanya mengosongkan isi kedua kunci di atas, tidak menjalankan "Hapus semua data" Shadowrocket; membaca laporan dan menyegarkan alamat laporan biasa tidak menghapus catatan. Ekspor terlebih dahulu lalu bersihkan hanya jika benar-benar ingin mengatur ulang riwayat; jika daftar tidak bertambah, bandingkan hitungan, versi, dan event terlebih dahulu untuk menjaga bukti diagnostik. Setelah dibersihkan, kembali ke [alamat laporan lokal](https://one.google.com/g1-sku-report) tanpa `clear=1` agar penyegaran ulang tidak kembali menghapus catatan baru.

## 6. Mengumpulkan & Memverifikasi SKU Tersembunyi di Shadowrocket iOS

Proyek saat ini berjalan di **iPhone + Shadowrocket + Google App**. Pengumpulan membaca keseluruhan respons teks asli yang cocok: meskipun paket milik suatu ID tidak ditampilkan di halaman, selama ID tersebut muncul di dalam respons, ID tetap diekstrak. Halaman hanya menampilkan beberapa paket tidak berarti respons hanya berisi beberapa ID.

1. Pertahankan **G1 ACQ** yang sama tetap aktif, lalu buka satu per satu paket 2TB / Pro, bulanan, tahunan, dan menu promo yang tersedia di dalam Google App; tunggu tiap halaman selesai dimuat agar modul mengumpulkan respons asli dari berbagai pintu masuk.
2. Buka [laporan lokal](https://one.google.com/g1-sku-report) di Safari dan periksa "Kandidat SKU yang dikumpulkan saat menjelajahi halaman"; bagian ini menyimpan ID lengkap sebelum penulisan ulang, maksimal 300 item.
3. Untuk kandidat pilihan putaran ini `g1.2tb.ai.12months_ip_90p`, masuk kembali ke paket 2TB / Pro asli agar modul mengganti ID sumber pada pintu masuk tersebut; periksa `test.version=g1-acq-v7.6`, `test.target`, dan `to` pada baris terkait di laporan.
4. Masuk ke alur langganan asli dari paket tersebut, periksa produk, siklus, nominal awal, dan nominal perpanjangan yang benar-benar ditampilkan App Store; simpan hasil tampilan aktual, lalu ekspor JSON untuk dicocokkan dengan catatan eksekusi skrip.

Daftar pengumpulan asli dan kandidat pengganti yang dikonfigurasi disimpan terpisah. Target baru yang ditulis sendiri oleh modul tidak otomatis menjadi "SKU tersembunyi yang terkumpul"; ID yang tidak dikirim oleh server juga tidak ada dalam hasil pengumpulan ini. Skrip Shadowrocket saat ini memproses respons jaringan dan tidak memanggil langsung antarmuka StoreKit di dalam Google App, sehingga "berhasil diganti" di laporan hanya menggambarkan penulisan ulang teks.

Kueri produk iOS asli menggunakan StoreKit `Product.products(for:)` atau `SKProductsRequest`, di mana konteks aplikasi terkait mengirimkan ID yang sudah diketahui; kueri semacam ini mengembalikan detail produk, bukan antarmuka katalog yang mencantumkan seluruh produk. Alur kerja di ponsel pada proyek ini adalah mengumpulkan ID asli, mengganti kandidat tertentu, melihat respons langganan asli, lalu menyimpan laporan.

## 7. Penentuan Hasil yang Umum Dijumpai

| Hasil Pengamatan | Langkah Berikutnya |
|---|---|
| Halaman laporan menampilkan "Belum ada catatan." atau "Belum ada catatan respons pengumpulan versi ini yang tersimpan." | Simpan `scan.version` dan hitungan aktual terlebih dahulu, lalu buka kembali halaman 2TB / Pro yang tersedia di Google App dan segarkan laporan; versi tidak dikenal atau tanpa catatan tidak langsung berarti kerusakan ponsel |
| Laporan bertuliskan `v7.6.0`, bagian pengumpulan bertuliskan "Catatan pengumpulan lama" | Laporan sudah diperbarui, namun catatan pengumpulan tersimpan masih berasal dari skrip lama; bandingkan `scan.version` aktual, hitungan, dan waktu respons terbaru, lalu buka ulang paket untuk diperiksa |
| Catatan lama tidak memiliki `recentResponses` | Pertahankan kandidat asli dan hitungan kumulatif, tunggu respons nyata baru mengisi riwayat; laporan tidak memalsukan hitungan lama menjadi aktivitas terbaru |
| Safari menampilkan halaman Google biasa atau 404 | Laporan lokal saat ini tidak ditampilkan; periksa G1 ACQ versi baru, koneksi, HTTPS Decryption konfigurasi aktif, `one.google.com`, dan sertifikat tepercaya sesuai Bagian 5, lalu tempelkan URL laporan lengkap ke bilah alamat Safari |
| Halaman tidak memiliki penanda "Skrip Lokal Aktif", `v7.6.0`, atau tombol "Ekspor JSON" | Pastikan sudah diperbarui ke modul utama versi baru sesuai Bagian 1, lalu buka ulang laporan lokal Bagian 5; alamat ekspor JSON langsung juga tercantum di Bagian 5 |
| Halaman laporan menampilkan antarmuka penyimpanan lokal belum siap | Skrip halaman tidak memperoleh antarmuka baca `$persistentStore`, sehingga halaman saat ini bukan bukti keberhasilan pengumpulan; catat tampilan dan versi Shadowrocket |
| Daftar masih berisi ID lama, tetapi hitungan respons teks bertambah dan status `known-skus` | Data duplikat diterima kali ini sehingga hitungan kumulatif dan waktu ditemukan diperbarui; pertahankan catatan yang ada dan bandingkan jumlah kandidat serta penambahan per respons |
| `scannedResponses`, `matchedResponses`, `nonTextResponses`, dan waktu respons terbaru tidak berubah | Hanya memastikan tidak ada catatan pengumpulan baru tersimpan pada putaran ini; kegagalan penulisan penyimpanan juga mempertahankan hitungan lama. Cek log skrip `saved=no` / `SKU collection unavailable`, lalu periksa berurutan cache, cakupan `one.google.com/`, sakelar modul, VPN, HTTPS Decryption konfigurasi aktif, kepercayaan sertifikat, dan hostname, lalu buka ulang paket aktual dan segarkan laporan |
| Hitungan respons teks bertambah dengan status terbaru `no-skus` | Tidak ada string yang cocok pada body yang diproses kali ini; lanjutkan memeriksa halaman 2TB / Pro serta bulanan dan tahunan yang tersedia tanpa mengarang ID |
| Hanya `nonTextResponses` yang bertambah dengan status terbaru `non-text` | Respons non-teks diterima dan arti hitungan teks tetap tidak berubah; catat tipe serta jalur tersanitasi kali ini, lalu periksa halaman paket lain yang tersedia |
| Status terbaru `new-skus` | `addedCount>0`, ID baru benar-benar tersimpan kali ini; meskipun `omittedCount>0` bersamaan, status tetap `new-skus`; `count` pada daftar kandidat tetap jumlah kemunculan kumulatif |
| ID 2TB sudah terkumpul, tetapi `annualHitCount` bernilai 0 | Cocokkan waktu eksekusi, ID sumber lengkap, prefiks `g1.ios.2tb.`, dan cakupan pencocokan `/ai?`; kumpulkan ulang sesuai Bagian 3 |
| `status=rewritten` dan `hitCount>0`, tetapi `annualHitCount=0` | Kali ini hanya menulis ulang 20TB / 30TB; periksa `id`, `to`, dan `fallback` tiap baris—status ini tidak berarti penulisan ulang promo 2TB cocok |
| `status=no-match` dan `hitCount=0` | Tidak ada satu pun dari ketiga paket yang cocok pada respons teks kali ini; cocokkan ID sumber lengkap dan cakupan URL di Bagian 4, lalu kumpulkan ulang sesuai Bagian 3 |
| `fallback=false` untuk 20TB / 30TB versi ini | `to` aktual adalah SKU uji coba bawaan `1month_eft` paket tersebut; dipilih jika target bawaan muncul atau jika baik bawaan maupun cadangan 90p tidak muncul—cocokkan ID lengkap di Bagian 4 |
| `fallback=true` untuk 20TB / 30TB versi ini | Target bawaan `1month_eft` tidak ditemukan di body asli sehingga memilih cadangan 90p tiga bulan di body; `to` aktual adalah `g1.20tb.3months_ip_90p.acq` atau `g1.ai.ultra.3months_ip_90p.acq`, dan baris ini bukan target uji coba gratis 1 bulan |
| Baris historis 20TB / 30TB menampilkan cadangan 75p | Ini adalah `to` dan `fallback` aktual yang tersimpan oleh versi lama; pertahankan nilai lama, cocokkan dengan `test.version`, waktu eksekusi, dan hasil kasir lama—75p tidak ikut dalam fallback versi ini |
| `test.target` 2TB sama dengan konfigurasi saat ini, tetapi `test.version=g1-acq-v7.5` | Masih catatan eksekusi v7.5 lama; target sama-sama `g1.2tb.ai.12months_ip_90p`, namun kesamaan target tidak berarti `g1-acq-v7.6` sudah berjalan |
| `hitCount` lebih dari 0, tetapi kasir error atau tidak muncul | Catat pesan aktual dan target aktual `to` pada paket tersebut; keberhasilan penggantian teks dan penerimaan produk target oleh toko dicatat terpisah |
| Produk, siklus, atau nominal App Store berbeda dari perkiraan | Catat sesuai produk yang dikembalikan App Store dan tampilan kasir kali ini; periksa dahulu apakah `to` berupa uji coba `1month_eft`, cadangan 90p tiga bulan, atau target 2TB—`1month_eft`, `12months`, `90p` pada SKU serta label harga tangkapan layar tidak menggantikan hasil aktual kali ini |
| `addedCount=0` dan `omittedCount>0`, status `limit-reached` | Tidak ada ID baru yang tersimpan kali ini dan terjadi pembuangan kapasitas; ID tersimpan tetap diperbarui. Hanya jika memang ingin mengosongkan kapasitas untuk pengumpulan putaran baru, ekspor dulu lalu bersihkan dua kunci secara manual dengan `?clear=1` |

Menjalankan satu kali diagnostik "catat dulu → buka ulang paket aktual → segarkan dan bandingkan" sesuai Bagian 3 sudah cukup untuk menjaga bukti sebelum dan sesudah; ID baru ditentukan oleh isi respons aktual, sehingga pemasangan ulang atau penghapusan catatan berulang tidak memaksa server mengirim SKU baru.

## 8. Templat Catatan Perangkat Nyata

```text
Waktu pengumpulan / pengujian (termasuk zona waktu): [isi]
Versi iOS / Google App / Shadowrocket: [isi]
Nama modul utama: G1 ACQ
Alamat modul utama: https://cdn.jsdelivr.net/gh/crhywun/g1-acq@v7.6.0/g1-acq-v7.sgmodule
Versi rilis modul utama: v7.6.0
Versi skrip modul utama: g1-acq-v7.6
Cara jalan: Satu modul mengumpulkan SKU asli & 10 respons terakhir secara pasif, lalu menjalankan penulisan ulang 3 paket (uji coba gratis 1 bulan Ultra / cadangan 90p 3 bulan, kandidat promo 12 bulan 2TB)
Modul utama yang aktif saat ini: G1 ACQ
Penanda lokal & versi di bagian atas laporan: [isi sesuai tampilan aktual]
Versi skrip laporan reportVersion: [isi sesuai tampilan aktual; saat ini v7.6.0]
Versi skrip pengumpulan aktual scan.version: [isi nilai tersimpan aktual; kolektor utama versi ini g1-acq-v7.6]
Pesan versi pengumpulan: [isi sesuai tampilan aktual; Catatan pengumpulan lama / Belum ada catatan respons pengumpulan versi ini yang tersimpan / Status versi ini]
Hitungan teks sebelum buka paket scan.scannedResponses: [isi]
Hitungan teks setelah buka paket scan.scannedResponses: [isi]
Hitungan cocok sebelum buka paket scan.matchedResponses: [isi]
Hitungan cocok setelah buka paket scan.matchedResponses: [isi]
Hitungan non-teks sebelum buka paket scan.nonTextResponses: [isi; jika catatan lama tidak ada, tulis "Tidak tercatat"]
Hitungan non-teks setelah buka paket scan.nonTextResponses: [isi]
Waktu respons terakhir sebelum buka paket: [isi; jika catatan lama tidak ada riwayat, tulis "Tidak tercatat"]
Waktu respons terakhir setelah buka paket: [isi]
Respons terbaru scan.recentResponses: [isi hingga 10 item urutan JSON lama→baru; tabel HTML baru→lama; jika tidak ada riwayat, tulis "Tidak tercatat"]
Respons terbaru at / path / bodyType: [isi nilai tersimpan aktual; at dalam UTC, path hanya kategori tersanitasi]
Respons terbaru status: [isi new-skus / known-skus / no-skus / limit-reached / non-text]
Respons terbaru candidateCount / addedCount / omittedCount: [isi jumlah kandidat berbeda / jumlah baru tersimpan / jumlah terbuang kapasitas]
Target terkonfigurasi saat ini configuredTarget: g1.2tb.ai.12months_ip_90p
Asal kandidat: Ditentukan tangkapan layar pengguna (user-specified), nilai literal g1.2tb.ai.12months_ip_90p, tanpa akhiran .acq
Label harga tangkapan layar: $1.99 × 12 months = $23.88/year; label promo bulanan 12 bulan berturut-turut, bukan harga atau siklus tagihan iOS yang terverifikasi
Arti diskon tangkapan layar: 90p = 90% off (diskon 90%, sekitar bayar 10%), bukan bayar 90%
Judul tangkapan layar: Pro 5TB; produk sumber putaran ini tetap iOS 2TB asli, tangkapan layar tidak membuktikan hak 5TB
Status verifikasi kandidat 2TB: Menunggu produk aktual yang dikembalikan App Store; isi sesuai nama produk, siklus, nominal awal, dan perpanjangan putaran ini
Uji coba gratis 1 bulan Ultra: Didukung versi ini; apakah tampil di akun saat ini: [isi sesuai kasir kali ini]
SKU sumber 20TB: g1.ios.20tb.m.v2
SKU uji coba bawaan 20TB: g1.20tb.1month_eft.acq
SKU cadangan 90p 3 bulan 20TB: g1.20tb.3months_ip_90p.acq
SKU sumber 30TB: g1.ios.30tb.ai.pro.m
SKU uji coba bawaan 30TB: g1.ai.ultra.1month_eft.acq
SKU cadangan 90p 3 bulan 30TB: g1.ai.ultra.3months_ip_90p.acq
Aturan pemilihan independen versi ini: Tiap paket memprioritaskan bawaan jika muncul; jika bawaan tidak ada dan cadangan 90p muncul maka fallback ke 90p; jika keduanya tidak ada tetap pilih bawaan 1month_eft; 75p tidak ikut fallback versi ini
Apakah bawaan / cadangan 90p muncul di body asli 20TB: [isi bukti respons asli kali ini; jika belum dicek tulis "Belum diperiksa"]
Apakah bawaan / cadangan 90p muncul di body asli 30TB: [isi bukti respons asli kali ini; jika belum dicek tulis "Belum diperiksa"]
Apakah tombol "Ekspor JSON" terlihat dan diklik: [isi]
Nama paket aktual yang dibuka di Google App: [isi nama aktual 2TB / Pro, 20TB, atau 30TB]
SKU lengkap iOS 2TB asli yang terkumpul: [isi teks asli; jika tidak muncul tulis "Tidak terkumpul"]
SKU lengkap iOS 20TB / 30TB asli yang terkumpul: [isi teks asli; jika tidak muncul tulis "Tidak terkumpul"]
Versi skrip eksekusi test.version: [isi nilai tersimpan aktual; versi ini g1-acq-v7.6, v7.5 lama tetap g1-acq-v7.5]
Waktu pengujian terakhir test.updatedAt (UTC): [isi]
ID sumber, target aktual, jumlah, status cadangan per baris test.matchedFrom: [isi {id, to, count, fallback}]
Target aktual 20TB to / fallback: [isi nilai tersimpan aktual; bawaan versi ini g1.20tb.1month_eft.acq / false, cadangan g1.20tb.3months_ip_90p.acq / true]
Target aktual 30TB to / fallback: [isi nilai tersimpan aktual; bawaan versi ini g1.ai.ultra.1month_eft.acq / false, cadangan g1.ai.ultra.3months_ip_90p.acq / true]
Cadangan historis 75p: [hanya isi to dan fallback asli untuk catatan versi lama; mempertahankan g1.20tb.3months_ip_75p.acq atau g1.ai.ultra.3months_ip_75p.acq]
Log fallback: [isi ID target lengkap kali ini; jika tidak memakai cadangan tulis "Tidak ada"]
Target 2TB eksekusi terakhir test.target: [isi nilai tersimpan aktual; catatan lama mempertahankan ID target aslinya; v7.5 lama sama-sama g1.2tb.ai.12months_ip_90p, namun versi tetap mempertahankan nilai lama]
Asal target eksekusi terakhir test.targetOrigin: [isi user-specified / pattern-derived / legacy / kosong; pertahankan asal lama]
Total penulisan ulang 3 paket test.hitCount: [isi]
Penulisan ulang promo 2TB / Pro saja test.annualHitCount: [isi; nama kolom kompatibel, tidak membuktikan penagihan tahunan]
Status eksekusi test.status: [isi]
Apakah kasir App Store muncul: [isi]
Nama produk App Store: [isi sesuai tampilan aktual]
Siklus langganan: [isi sesuai tampilan aktual]
Mata uang / nominal awal / nominal perpanjangan: [isi sesuai tampilan aktual]
Pesan error aktual: [isi teks asli; jika tidak ada tulis "Tidak ada"]
Apakah pembelian benar-benar diselesaikan: [isi]
Hak yang tampil di akun Google One setelah pembelian: [isi hanya jika benar-benar melakukan pembelian]
File ekspor JSON putaran ini: [isi]
```
