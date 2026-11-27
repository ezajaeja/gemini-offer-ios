# Katalog Lengkap SKU Tersembunyi & Harga Regional Multi-Negara (iOS & Android)

Dokumen ini merangkum seluruh SKU yang ditemukan dari pemindaian [`sku-catalog.json`](../sku-catalog.json), pembaruan repositori hulu (`Dgkncn/g1-acq-plus` `v9.6.0` & `crhywun/g1-acq` `v7.13.0`), `sku-atlas.md`, serta pemindaian langsung daftar *In-App Purchases* resmi Apple App Store di 46 negara.

---

## 1. Mengapa Paket Ultra Turki Hanya Diskon (Tanpa Free Trial)?

- **Pemindaian 3.340 kombinasi SKU Ultra (`scan_wide.py`):** Mencakup seluruh varian `20tb`, `30tb`, `ai.ultra`, `ultra`, `play.20tb`, `play.30tb` (durasi 1–24 bulan, diskon 40–99% & `eft`, akhiran kosong/`.acq`/`.sep`/`.wb`) menghasilkan **0 hit aktif**. Seluruh SKU free trial Ultra (`1month_eft.acq`) dan promo awal `.acq` (`90p`, `80p`, `75p`) telah dinonaktifkan oleh Google baik di Apple App Store maupun Google Play.
- **Pemindaian 46 wilayah Apple App Store:** Hanya **Türkiye (`TR`)** yang masih memiliki SKU katalog regional lama dengan tarif lebih rendah (`g1.ios.20tb.m` = **`₺1.989,99/bulan`** dan `g1.ios.30tb.m` = **`₺2.949,99/bulan`**). Polandia (`PL`) mencantumkan 20 TB di `469,99 zł/bulan` (~Rp 1,85 jt/bln), sedangkan seluruh negara lain mengenakan tarif penuh atau tanpa diskon lokal khusus.

---

## 2. SKU & Harga Regional **Apple App Store (iOS StoreKit)** yang Belum Tercatat di README

### A. SKU Regional & Promo iOS Terverifikasi

| SKU (`Product ID`) | Paket | Detail Promo / Harga | Harga Normal | Platform & Region |
| :--- | :--- | :--- | :--- | :--- |
| **`com.google.gemini.2tb.ai.m.3month_ip_99p`** | Google AI Pro (5 TB) | **Diskon 99% × 3 bulan**:<br>• **India (`IN`)**: **`₹10/bln × 3`** (~Rp 1.900/bln)<br>• **Indonesia (`ID`)**: **`Rp 3.000/bln × 3`**<br>• **US (`US`)**: **`US$0.29/bln × 3`**<br>• **UK (`GB`)**: **`£0.29/bln × 3`**<br>• **Singapura (`SG`)**: **`S$0.48/bln × 3`** | Tarif normal wilayah | **iOS** (Google App / Gemini App) |
| **`g1.ios.2tb.y`** | Google One 2 TB (Tahunan Lama) | **`₺499,99/tahun`** (~Rp 230 rb/thn) | Tarif tahunan reguler | **iOS** — khusus **Türkiye (`TR`)** |
| **`g1.ios.20tb.m`** | Google AI Ultra (20 TB) | **`₺1.989,99/bulan`** (~40% lebih murah) | $99.99/bln | **iOS** — khusus **Türkiye (`TR`)** |
| **`g1.ios.30tb.m`** | Google AI Ultra (30 TB) | **`₺2.949,99/bulan`** (~55% lebih murah) | $199.99/bln | **iOS** — khusus **Türkiye (`TR`)** |

### B. Perbandingan Harga Reguler Termurah di Apple App Store (Hasil Pemindaian 46 Negara)

Jika promo 3 bulan habis dan Anda mencari tarif bulanan reguler termurah tanpa promo intro:

| Region | Aplikasi | AI Ultra 30 TB | AI Ultra 20 TB | AI Pro 5 TB | AI Plus 2 TB | AI Plus 400 GB |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Türkiye (`TR`)** | Google / Gemini | **`₺2.949,99`** | **`₺1.989,99`** | **`₺539,99`** *(Gemini)* / `₺869,99` | `₺359,99` | `₺199,99` *(Gemini)* |
| **Nigeria (`NG`)** | Google / Gemini | — | — | `₦28,500.00` | `₦15,000.00` | `₦7,700.00` |
| **Mesir (`EG`)** | Google / Gemini | — | — | `EGP 939.99` | `EGP 449.99` | `EGP 249.99` |
| **Indonesia (`ID`)** | Google / Gemini | — | — | `Rp 309ribu` | `Rp 158ribu` | `Rp 75ribu` |
| **Pakistan (`PK`)** | Google / Gemini | — | — | `Rs 5,600.00` | `Rs 2,800.00` | `Rs 1,400.00` |
| **Kazakhstan (`KZ`)** | Google / Gemini | — | — | `9,990.00₸` | `4,990.00₸` | `2,690.00₸` |
| **Polandia (`PL`)** | Google / Gemini | — | `469,99 zł` | `97,99 zł` | `47,99 zł` | `23,99 zł` |
| **India (`IN`)** | Google / Gemini | — | — | `₹1,950` | `₹749` | `₹399` |
| **Amerika Serikat (`US`)** | Google / Gemini | `$199.99` | `$99.99` | `$19.99` | `$9.99` | `$4.99` |

*(Catatan: Untuk wilayah **`TR`**, aplikasi **Gemini** mencantumkan dua tier 5 TB, termasuk opsi **`₺539,99/bulan`** yang lebih rendah dibandingkan `₺869,99` di Google App).*

### C. SKU Akuisisi Bawaan iOS yang Terdeteksi di Perangkat (`sku-atlas`)

| SKU (`Product ID`) | Paket | Detail Promo | Platform & Region |
| :--- | :--- | :--- | :--- |
| `g1.ios.ai.2tb.m.ip_3mo_75p.acq` | AI Pro (5 TB) Bulanan | Diskon 75% × 3 bulan | iOS (Global / akun baru) |
| `g1.ios.ai.2tb.a.ip_1yr_25p.acq` / `ip_1yr_10p.acq` | AI Pro (5 TB) Tahunan | Diskon 25% / 10% tahun pertama | iOS (Global / akun baru) |
| `g1.ios.helium.m.3month_ip_75p.acq` | AI Plus (400 GB) Bulanan | Diskon 75% × 3 bulan | iOS (Global / akun baru) |
| `g1.ios.helium.a.ip_1yr_25p.acq` / `ip_1yr_10p.acq` | AI Plus (400 GB) Tahunan | Diskon 25% / 10% tahun pertama | iOS (Global / akun baru) |
| `g1.ios.2tb.m.3month_ip_75p` / `2month_ip_75p` | 2 TB Bulanan | Diskon 75% × 3 / 2 bulan | iOS (Global) |
| `g1.ios.100gb.m.3month_ip_75p` / `2month_ip_75p` | 100 GB Bulanan | Diskon 75% × 3 / 2 bulan | iOS (Global) |
| `g1.ios.30gb.m.3month_ip_75p` / `2month_ip_75p` | 30 GB Bulanan | Diskon 75% × 3 / 2 bulan | iOS (Global) |

### D. Kandidat Eksperimental `com.google.gemini.*` & `com.google.one.*` (Belum Terkonfirmasi di StoreKit)

Anda dapat menguji langsung ID kandidat berikut menggunakan formulir **SKU Pro Kustom** atau **SKU Ultra Kustom** di `https://one.google.com/g1-sku-report` (`v8.2.0-proxypin`):

- **Kandidat Pro:** `com.google.gemini.2tb.ai.m.1month_ip_99p`, `com.google.gemini.2tb.ai.m.12month_ip_90p`, `com.google.gemini.2tb.ai.m.3month_ip_90p`, `com.google.gemini.2tb.ai.m.3month_ip_75p`, `com.google.gemini.2tb.ai.m.1month_eft`, `com.google.gemini.2tb.ai.m.3month_eft`, `com.google.gemini.2tb.ai.m.12month_eft`, `com.google.one.2tb.ai.m.3month_ip_99p`.
- **Kandidat Ultra:** `com.google.gemini.20tb.m.3month_ip_99p`, `com.google.gemini.30tb.ai.pro.m.3month_ip_99p`, `com.google.gemini.20tb.m.1month_eft`, `com.google.gemini.30tb.ai.pro.m.1month_eft`, `com.google.gemini.ai.ultra.m.1month_eft`.

---

## 3. 76 Kolam Free Trial OEM Baru & Paket Khusus (**Android Google Play `BillingClient`**)

SKU di bawah ini tidak terdaftar di App Store iOS, tetapi **aktif di Google Play Android** (dapat dipanggil melalui emulator MuMu Player + Frida pada akun Google yang memenuhi syarat di wilayah yang didukung Google Play):

| SKU (`Product ID`) | Jumlah SKU | Offer ID | Promo / Harga | Perpanjangan |
| :--- | :--- | :--- | :--- | :--- |
| `g1.2tb.ai.12months_eft.1` s/d `.20` | 20 SKU | `eft-12months` | **Gratis \$0 selama 12 bulan (`P1Y`)** | \$19.99/bln |
| `g1.2tb.ai.6months_eft.1` s/d `.26` | 26 SKU | `eft-6months` | **Gratis \$0 selama 6 bulan (`P6M`)** | \$19.99/bln |
| `g1.2tb.ai.3months_eft.1` s/d `.30` | 30 SKU | `eft-3months` | **Gratis \$0 selama 3 bulan (`P3M`)** *(mis. `.22` kolam Xiaomi 15 Global)* | \$19.99/bln |
| `g1.10tb` | 1 SKU | `null` | **\$49.99/bulan** (Google AI Pro 10 TB) | \$49.99/bln |
| `g1.youtube_premium_individual_add_on` | 1 SKU | `eft-1mo` | **Gratis \$0 selama 1 bulan (`P1M`)** *(YouTube Premium Add-on, US / Play tertentu)* | \$11.99/bln |

---

## 4. 90+ SKU Promo & Trial Tersembunyi dari [`sku-catalog.json`](../sku-catalog.json) (Belum Tercatat di README)

Seluruh daftar di bawah berasal dari pemindaian katalog **Android Google Play `BillingClient`** (berlaku secara global di wilayah yang mendukung Google One Play Billing):

### A. Google AI Pro (5 TB) — Harga Promo Intro (`g1.2tb.ai.*`)

| SKU (`Product ID`) | Base Plan | Offer ID | Harga & Durasi Promo | Perpanjangan |
| :--- | :--- | :--- | :--- | :--- |
| `g1.2tb.ai.12months_ip_50p` | `p1m` | `introprice` | \$9.99/bln × 12 bulan | \$19.99/bln |
| `g1.2tb.ai.6months_ip_50p` | `monthly` | `ip-6months-50p` | \$9.99/bln × 6 bulan | \$19.99/bln |
| `g1.2tb.ai.3months_ip_85p.acq` | `p1m` | `introprice` | \$2.99/bln × 3 bulan | \$19.99/bln |
| `g1.2tb.ai.3months_ip_75p.acq` | `p1m` | `introprice` | \$4.99/bln × 3 bulan | \$19.99/bln |
| `g1.2tb.ai.3months_ip_50p` | `monthly` | `ip-3months-50p` | \$9.99/bln × 3 bulan | \$19.99/bln |
| `g1.2tb.ai.2months_ip_75p.acq` | `p1m` | `introprice` | \$4.99/bln × 2 bulan | \$19.99/bln |
| `g1.2tb.ai.2months_ip_50p` / `.acq` | `monthly` / `p1m` | `ip-2months-50p` / `introprice` | \$9.99/bln × 2 bulan | \$19.99/bln |
| `g1.2tb.ai.1month_ip_90p.acq` | `p1m` | `introprice` | \$1.99 × 1 bulan pertama | \$19.99/bln |
| `g1.2tb.ai.1month_ip_85p.acq` | `p1m` | `introprice` | \$2.99 × 1 bulan pertama | \$19.99/bln |
| `g1.2tb.ai.1month_ip_75p.acq` | `p1m` | `introprice` | \$4.99 × 1 bulan pertama | \$19.99/bln |
| `g1.2tb.ai.1month_ip_50p` | `p1m` | `introprice` | \$9.99 × 1 bulan pertama | \$19.99/bln |

### B. Google AI Plus (2 TB) — Trial & Diskon (`g1.2tb.*`)

| SKU (`Product ID`) | Base Plan | Offer ID | Harga & Durasi Promo | Perpanjangan |
| :--- | :--- | :--- | :--- | :--- |
| `g1.2tb.3months_eft` | `p1m` | `freetrial` | **Gratis \$0 selama 3 bulan (`P13W1D`)** | \$9.99/bln |
| `g1.2tb.1month_eft` | `p1m` | `freetrial` | **Gratis \$0 selama 1 bulan (`P4W3D`)** | \$9.99/bln |
| `g1.2tb.annual.3months_eft` | `p1y` | `freetrial` | **Gratis \$0 selama 3 bulan (`P13W1D`)** | \$99.99/thn |
| `g1.2tb.annual.1month_eft` | `p1y` | `freetrial` | **Gratis \$0 selama 1 bulan (`P4W3D`)** | \$99.99/thn |
| `g1.2tb.12months_ip.4.99` | `p1m` | `introprice` | \$4.99/bln × 12 bulan | \$9.99/bln |
| `g1.2tb.6months_ip.4.99` | `p1m` | `introprice` | \$4.99/bln × 6 bulan | \$9.99/bln |
| `g1.2tb.3months_ip_85p.acq` | `p1m` | `introprice` | \$1.49/bln × 3 bulan | \$9.99/bln |
| `g1.2tb.3months_ip_80p` | `p1m` | `introprice` | \$1.99/bln × 3 bulan | \$9.99/bln |
| `g1.2tb.3months_ip.2.49` | `p1m` | `introprice` | \$2.49/bln × 3 bulan | \$9.99/bln |
| `g1.2tb.3months_ip_50p` / `.acq` | `p1m` | `introprice` | \$4.99/bln × 3 bulan | \$9.99/bln |
| `g1.2tb.2months_ip_80p` | `p1m` | `introprice` | \$1.99/bln × 2 bulan | \$9.99/bln |
| `g1.2tb.2months_ip_75p` | `p1m` | `introprice` | \$2.49/bln × 2 bulan | \$9.99/bln |
| `g1.2tb.2months_ip_50p.acq` | `p1m` | `introprice` | \$4.99/bln × 2 bulan | \$9.99/bln |
| `g1.2tb.1month_ip_95p.acq` | `p1m` | `introprice` | \$0.49 × 1 bulan pertama | \$9.99/bln |
| `g1.2tb.1month_ip_90p.acq` | `p1m` | `introprice` | \$0.99 × 1 bulan pertama | \$9.99/bln |
| `g1.2tb.1month_ip_85p.acq` | `p1m` | `introprice` | \$1.49 × 1 bulan pertama | \$9.99/bln |
| `g1.2tb.1month_ip_80p` | `p1m` | `introprice` | \$1.99 × 1 bulan pertama | \$9.99/bln |
| `g1.2tb.1month_ip.2.49` / `1month_ip_50p` | `p1m` | `introprice` | \$2.49 / \$4.99 × 1 bulan pertama | \$9.99/bln |
| `g1.2tb.annual.12months_ip_40p` | `annual` | `ip-12month-40p` | \$59.99 × 1 tahun | \$99.99/thn |
| `g1.2tb.annual.12months_ip_25p.acq` | `p1y` | `introprice` | \$74.99 × 1 tahun | \$99.99/thn |
| `g1.2tb.annual.12months_ip_20p` / `15p` / `10p` | `annual` | `ip-12month-*` | \$79.99 / \$84.99 / \$89.99 × 1 tahun | \$99.99/thn |

### C. Google AI Plus (400 GB — `g1.helium.*`)

| SKU (`Product ID`) | Base Plan | Offer ID | Harga & Durasi Promo | Perpanjangan |
| :--- | :--- | :--- | :--- | :--- |
| `g1.helium.12months_ip_75p` | `p1m` | `ip-12mo-75p` | \$1.29/bln × 12 bulan | \$4.99/bln |
| `g1.helium.12months_ip_50p` | `p1m` | `ip-12mo-50p` | \$2.49/bln × 12 bulan | \$4.99/bln |
| `g1.helium.3months_ip_75p.acq` | `p1m` | `introprice` | \$1.29/bln × 3 bulan | \$4.99/bln |
| `g1.helium.2months_ip_50p` | `monthly` | `introprice` | \$2.49/bln × 2 bulan | \$4.99/bln |
| `g1.helium.1month_ip_95p` | `p1m` | `introprice` | \$0.25 × 1 bulan pertama | \$4.99/bln |
| `g1.helium.1month_ip_90p.acq` | `p1m` | `introprice` | \$0.49 × 1 bulan pertama | \$4.99/bln |
| `g1.helium.1month_ip_75p.acq` | `p1m` | `introprice` | \$1.29 × 1 bulan pertama | \$4.99/bln |
| `g1.helium.annual.12months_ip_25p.acq` / `10p.acq` | `p1y` | `introprice` | \$37.99 / \$44.99 × 1 tahun | \$49.99/thn |

### D. Penyimpanan Dasar 100 GB, 200 GB & 30 GB (`g1.100gb.*` / `g1.200gb.*` / `g1.30gb.*`)

| SKU (`Product ID`) | Paket | Offer ID | Harga & Durasi Promo | Perpanjangan |
| :--- | :--- | :--- | :--- | :--- |
| `g1.200gb.3months_eft` / `annual.3months_eft` | 200 GB | `freetrial` | **Gratis \$0 selama 3 bulan (`P13W1D`)** | \$2.99/bln / \$29.99/thn |
| `g1.200gb.1month_eft` / `annual.1month_eft` | 200 GB | `freetrial` | **Gratis \$0 selama 1 bulan (`P4W3D`)** | \$2.99/bln / \$29.99/thn |
| `g1.200gb.12months_ip.1.49` / `6months_ip.1.49` | 200 GB | `introprice` | \$1.49/bln × 12 bln / 6 bln | \$2.99/bln |
| `g1.200gb.3months_ip_85p.acq` / `50p` / `50p.acq` | 200 GB | `introprice` | \$0.49/bln (`85p`) / \$1.49/bln (`50p`) × 3 bln | \$2.99/bln |
| `g1.200gb.2months_ip_75p` | 200 GB | `introprice` | \$0.75/bln × 2 bulan | \$2.99/bln |
| `g1.200gb.1month_ip_95p.acq` / `85p.acq` / `50p` | 200 GB | `introprice` | \$0.15 / \$0.49 / \$1.49 × 1 bulan pertama | \$2.99/bln |
| `g1.200gb.annual.12months_ip_40p` / `20p` / `15p` / `10p` | 200 GB | `ip-12month-*` | \$17.99 / \$23.99 / \$24.99 / \$26.99 × 1 thn | \$29.99/thn |
| `g1.100gb.3months_eft` / `annual.3months_eft` | 100 GB | `freetrial` | **Gratis \$0 selama 3 bulan (`P13W1D`)** | \$1.99/bln / \$19.99/thn |
| `g1.100gb.2months_eft` | 100 GB | `freetrial` | **Gratis \$0 selama 2 bulan (`P8W6D`)** | \$1.99/bln |
| `g1.100gb.1month_eft` / `annual.1month_eft` | 100 GB | `freetrial` | **Gratis \$0 selama 1 bulan (`P1M` / `P4W3D`)** | \$1.99/bln / \$19.99/thn |
| `g1.100gb.12months_ip.0.99` / `.0.49` | 100 GB | `introprice` | \$0.99/bln × 12 bulan | \$1.99/bln |
| `g1.100gb.6months_ip.0.99` / `6months_ip_75p` | 100 GB | `introprice` | \$0.99/bln / \$0.49/bln × 6 bulan | \$1.99/bln |
| `g1.100gb.3months_ip_85p.acq` / `50p` / `50p.acq` | 100 GB | `introprice` | \$0.29/bln (`85p`) / \$0.99/bln (`50p`) × 3 bln | \$1.99/bln |
| `g1.100gb.2months_ip_75p` | 100 GB | `introprice` | \$0.49/bln × 2 bulan | \$1.99/bln |
| `g1.100gb.1month_ip_95p.acq` / `85p.acq` / `50p` / `0.49` / `0.99` | 100 GB | `introprice` | \$0.10 / \$0.29 / \$0.99 / \$0.49 × 1 bulan pertama | \$1.99/bln |
| `g1.100gb.annual.12months_ip_40p` / `20p` / `15p` / `10p` | 100 GB | `ip-12month-*` | \$11.99 / \$15.49 / \$16.99 / \$17.99 × 1 thn | \$19.99/thn |
| `g1.30gb.1month_eft` / `annual.1month_eft` | 30 GB | `eft-1month` | **Gratis \$0 selama 1 bulan (`P1M`)** | \$0.89/bln / \$8.99/thn |
| `g1.30gb.12month_ip_50p` / `6month_ip_50p` | 30 GB | `ip-*` | \$0.49/bln × 12 bln / 6 bln | \$0.89/bln |
| `g1.30gb.3month_ip_75p` / `3months_ip_85p.acq` / `50p.acq` | 30 GB | `ip-*` / `introprice` | \$0.29 / \$0.15 / \$0.49/bln × 3 bln | \$0.89/bln |
| `g1.30gb.1month_ip_95p.acq` / `85p.acq` / `75p` | 30 GB | `introprice` / `ip-*` | \$0.05 / \$0.15 / \$0.29 × 1 bulan pertama | \$0.89/bln |
| `g1.30gb.annual.1year_ip_40p` / `20p` / `15p` / `10p` | 30 GB | `ip-1year-*` | \$5.49 / \$6.99 / \$7.49 / \$7.99 × 1 thn | \$8.99/thn |
