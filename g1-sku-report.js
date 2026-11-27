/* Laporan lokal & pengalih SKU interaktif yang disajikan oleh skrip http-request Shadowrocket.
 *
 * Atribusi & Kredit:
 *   - Dikembangkan dari `crhywun/g1-acq` (https://github.com/crhywun/g1-acq) oleh @crhywun
 *   - Diperluas pada v8.0.0 dengan pengalihan target SKU 1-ketuk interaktif di Safari & SKU uji coba gratis 18M/15M/12M/6M/1Y yang baru ditemukan.
 */
"use strict";

(function () {
  var ROOT = "https://one.google.com/g1-sku-report";
  var VERSION = "v8.1.1";
  var COLLECTOR_VERSION = "g1-acq-v8.1.1";
  var DEFAULT_TARGET = "com.google.gemini.2tb.ai.m.3month_ip_99p";
  var TARGET_OVERRIDE_KEY = "g1.target.override.v1";
  var LEGACY_TARGET = "g1.2tb.ai.annual";
  var SCAN_KEY = "g1.sku.scan.v1";
  var TEST_KEY = "g1.pro.annual.test.v1";

  function isProSource(id) {
    return typeof id === "string" &&
      ((id.indexOf("g1.ios.2tb.") === 0 && id.length > 11) ||
       (id.indexOf("g1.ios.ai.2tb.") === 0 && id.length > 14));
  }

  var PRESET_SKUS = [
    { sku: "com.google.gemini.2tb.ai.m.3month_ip_99p", label: "[Rekomendasi iOS] Pro 5TB · Diskon 99% 3 bulan (com.google.gemini...99p)", tag: "iOS 99% OFF" },
    { sku: "g1.2tb.ai.12months_ip_90p", label: "[Kandidat iOS] Pro 5TB · Promo diskon 90% 12 bulan ($1.99/bln × 12 = $23.88)", tag: "iOS $1.99×12M" },
    { sku: "g1.2tb.ai.18months_eft", label: "★ Pro 5TB · Uji coba gratis $0 18 bulan (eft-18months)", tag: "FREE 18M" },
    { sku: "g1.2tb.ai.15months_eft", label: "★ Pro 5TB · Uji coba gratis $0 15 bulan (eft-15months)", tag: "FREE 15M" },
    { sku: "g1.2tb.ai.12months_eft", label: "★ Pro 5TB · Uji coba gratis $0 12 bulan (eft-12months)", tag: "FREE 12M" },
    { sku: "g1.2tb.ai.subs_variant", label: "Pro 5TB · Varian uji coba gratis $0 12 bulan/6 bulan (subs_variant)", tag: "FREE 12M/6M" },
    { sku: "g1.play.2tb.ai.student", label: "★ Pro 5TB · Jalur Pelajar Uji coba gratis $0 12 bulan (eft-12mo)", tag: "FREE 12M" },
    { sku: "g1.2tb.ai.6months_eft", label: "Pro 5TB · Uji coba gratis $0 6 bulan (eft-6months)", tag: "FREE 6M" },
    { sku: "g1.2tb.ai.4months_eft", label: "Pro 5TB · Uji coba gratis $0 4 bulan (eft-4months)", tag: "FREE 4M" },
    { sku: "g1.2tb.ai.3months_eft", label: "Pro 5TB · Uji coba gratis $0 3 bulan (eft-3months)", tag: "FREE 3M" },
    { sku: "g1.2tb.ai.2months_eft", label: "Pro 5TB · Uji coba gratis $0 2 bulan (eft-2months)", tag: "FREE 2M" },
    { sku: "g1.2tb.ai.12months_ip_90p", label: "Pro 5TB · Promo diskon 90% 12 bulan ($1.99/bln × 12 = $23.88)", tag: "$1.99×12M" },
    { sku: "g1.2tb.ai.3months_ip_90p.acq", label: "Pro 5TB · Promo diskon 90% 3 bulan ($1.99/bln × 3)", tag: "$1.99×3M" },
    { sku: "g1.2tb.ai.1month_ip_95p.acq", label: "Pro 5TB · Promo diskon 95% 1 bulan ($0.99/bulan pertama)", tag: "$0.99×1M" },
    { sku: "g1.2tb.1year_eft", label: "★ AI Plus 2TB · Uji coba gratis $0 12 bulan (1year_eft)", tag: "FREE 12M" },
    { sku: "g1.2tb.6months_eft", label: "AI Plus 2TB · Uji coba gratis $0 6 bulan (6months_eft)", tag: "FREE 6M" },
    { sku: "g1.2tb.subs_variant", label: "AI Plus 2TB · Varian uji coba gratis $0 6 bulan/3 bulan", tag: "FREE 6M/3M" },
    { sku: "g1.play.helium", label: "★ AI Plus 400GB · Uji coba gratis $0 12 bulan (eft-12mo)", tag: "FREE 12M" },
    { sku: "g1.play.helium.student", label: "AI Plus 400GB · Pelajar Uji coba gratis $0 12 bulan", tag: "FREE 12M" },
    { sku: "g1.helium.12months_ip_90p", label: "AI Plus 400GB · Diskon 90% 12 bulan ($0.49/bln × 12 = $5.88/thn)", tag: "$0.49×12M" },
    { sku: "g1.100gb.1year_eft", label: "★ Penyimpanan 100GB · Uji coba gratis $0 12 bulan (1year_eft)", tag: "FREE 12M" },
    { sku: "g1.100gb.9months_eft", label: "★ Penyimpanan 100GB · Uji coba gratis $0 9 bulan (9months_eft)", tag: "FREE 9M" },
    { sku: "g1.200gb.1year_eft", label: "★ Penyimpanan 200GB · Uji coba gratis $0 12 bulan (1year_eft)", tag: "FREE 12M" }
  ];

  var url = typeof $request === "object" && $request ? $request.url : "";
  if (typeof url !== "string" || !/^https:\/\/one\.google\.com\/g1-sku-report\/?(?:\?|$)/.test(url)) {
    $done({});
    return;
  }

  var storageAvailable = typeof $persistentStore !== "undefined" &&
    typeof $persistentStore.read === "function";
  var clearMessage = "";

  // Tangani pengalihan target interaktif melalui ?set_target=<sku>
  var targetMatch = /(?:\?|&)set_target=([A-Za-z0-9._-]+)(?:&|$)/.exec(url);
  if (targetMatch && storageAvailable) {
    var newTarget = decodeURIComponent(targetMatch[1]);
    if (/^(?:g1\.|com\.google\.(?:one|gemini)\.)[A-Za-z0-9._-]{2,160}$/.test(newTarget)) {
      try {
        var okWrite = $persistentStore.write(newTarget, TARGET_OVERRIDE_KEY);
        clearMessage = okWrite ? ("✅ Target penulisan ulang bawaan 2TB/AI Pro diubah ke: " + newTarget + " (kembali ke Google App dan buka ulang halaman paket untuk memicu penulisan ulang)") : "Gagal menyimpan pergantian target.";
      } catch (e) {
        clearMessage = "Antarmuka penyimpanan lokal belum siap.";
      }
    }
  }

  if (/(?:\?|&)clear=1(?:&|$)/.test(url)) {
    try {
      var scanCleared = $persistentStore.write("{}", SCAN_KEY);
      var testCleared = $persistentStore.write("{}", TEST_KEY);
      clearMessage = scanCleared && testCleared ? "Dua catatan lokal alat ini telah dikosongkan." : "Pengosongan catatan lokal belum selesai.";
    } catch (error) {
      clearMessage = "Antarmuka penyimpanan lokal belum siap.";
    }
  }

  var CONFIGURED_TARGET = DEFAULT_TARGET;
  if (storageAvailable) {
    try {
      var custom = ($persistentStore.read(TARGET_OVERRIDE_KEY) || "").trim();
      if (/^(?:g1\.|com\.google\.(?:one|gemini)\.)[A-Za-z0-9._-]{2,160}$/.test(custom)) {
        CONFIGURED_TARGET = custom;
      }
    } catch (e) {}
  }

  function load(key) {
    if (!storageAvailable) return {};
    try {
      var value = JSON.parse($persistentStore.read(key) || "{}");
      return value && value.schemaVersion === 1 ? value : {};
    } catch (error) {
      return {};
    }
  }
  function text(value, length) {
    return typeof value === "string" ? value.slice(0, length || 180) : "";
  }
  function count(value) {
    var number = Number(value);
    return isFinite(number) && number > 0 ? Math.floor(number) : 0;
  }
  function sku(value) {
    return typeof value === "string" && /^(?:g1\.|com\.google\.(?:one|gemini)\.)[A-Za-z0-9._-]{1,160}$/.test(value) ? value : "";
  }
  function rows(value, withTime, defaultTarget) {
    if (!Array.isArray(value)) return [];
    return value.slice(0, 300).filter(function (row) {
      return row && typeof row.id === "string" &&
        /^(?:g1\.|com\.google\.(?:one|gemini)\.)[A-Za-z0-9._-]{1,160}$/.test(row.id);
    }).map(function (row) {
      var out = { id: row.id, count: count(row.count) };
      if (withTime) {
        out.lastSeen = text(row.lastSeen, 32);
      } else {
        out.to = sku(row.to) || (isProSource(row.id) ? defaultTarget || "" : "");
        out.fallback = row.fallback === true;
      }
      return out;
    }).sort(function (a, b) { return a.id < b.id ? -1 : a.id > b.id ? 1 : 0; });
  }

  var scanStatuses = {
    "new-skus": "Ditemukan dan dicatat ID baru",
    "known-skus": "Respons diterima, ID sama dengan catatan yang sudah ada",
    "no-skus": "Respons teks diterima, tidak ada ID produk kali ini",
    "limit-reached": "ID baru diterima, batas kapasitas pengumpulan tercapai",
    "non-text": "Respons diterima, body bukan teks yang dapat dipindai"
  };
  var scanPaths = ["/", "/ai", "/plans", "/_/…/data/batchexecute", "[Jalur one.google.com lainnya]"];
  function recent(value) {
    if (!Array.isArray(value)) return [];
    return value.slice(-10).filter(function (event) {
      return event && typeof event.at === "string" &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(event.at) &&
        (event.bodyType === "text" || event.bodyType === "non-text") &&
        Object.prototype.hasOwnProperty.call(scanStatuses, event.status);
    }).map(function (event) {
      return {
        at: event.at,
        path: scanPaths.indexOf(event.path) !== -1 ? event.path : "[Jalur one.google.com lainnya]",
        bodyType: event.bodyType,
        status: event.status,
        candidateCount: count(event.candidateCount),
        addedCount: count(event.addedCount),
        omittedCount: count(event.omittedCount)
      };
    });
  }

  var scanRaw = load(SCAN_KEY);
  var testRaw = load(TEST_KEY);
  var recordedTarget = sku(testRaw.target);
  if (!recordedTarget && /^(?:pro-annual-test-v[12]|g1-acq-v7(?:\.0|\.1)?)$/.test(testRaw.version || "")) {
    recordedTarget = LEGACY_TARGET;
  }
  var matchedFrom = rows(testRaw.matchedFrom, false, recordedTarget);
  if (!recordedTarget) {
    matchedFrom.some(function (row) {
      if (isProSource(row.id) && row.to) {
        recordedTarget = row.to;
        return true;
      }
      return false;
    });
  }
  var annualHitCount = typeof testRaw.annualHitCount === "number" ? count(testRaw.annualHitCount) :
    matchedFrom.reduce(function (total, row) {
      return total + (isProSource(row.id) ? row.count : 0);
    }, 0);
  var storedOrigin = text(testRaw.targetOrigin, 32);
  var targetOrigin = recordedTarget && /^(?:user-specified|pattern-derived|legacy)$/.test(storedOrigin) ?
    storedOrigin : recordedTarget === CONFIGURED_TARGET ? "user-specified" :
      recordedTarget === LEGACY_TARGET ? "legacy" : "";
  var report = {
    schemaVersion: 1,
    reportVersion: VERSION,
    configuredTarget: CONFIGURED_TARGET,
    storageAvailable: storageAvailable,
    scan: {
      version: text(scanRaw.version, 32),
      updatedAt: text(scanRaw.updatedAt, 32),
      scannedResponses: count(scanRaw.scannedResponses),
      matchedResponses: count(scanRaw.matchedResponses),
      nonTextResponses: count(scanRaw.nonTextResponses),
      recentResponses: recent(scanRaw.recentResponses),
      truncated: scanRaw.truncated === true,
      limit: 300,
      skus: rows(scanRaw.skus, true)
    },
    test: {
      version: text(testRaw.version, 32),
      updatedAt: text(testRaw.updatedAt, 32),
      sourcePrefix: "g1.ios.2tb. | g1.ios.ai.2tb.",
      target: recordedTarget,
      targetOrigin: targetOrigin,
      status: text(testRaw.status, 32),
      hitCount: count(testRaw.hitCount),
      annualHitCount: annualHitCount,
      matchedFrom: matchedFrom
    }
  };

  var headers = {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
    "X-G1-Report-Version": VERSION,
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'"
  };
  var exportJSON = /(?:\?|&)format=json(?:&|$)/.test(url);
  if (exportJSON) {
    headers["Content-Type"] = "application/json; charset=utf-8";
    headers["Content-Disposition"] = 'attachment; filename="g1-sku-report.json"';
    $done({ response: { status: 200, headers: headers, body: JSON.stringify(report, null, 2) } });
    return;
  }

  function escape(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }
  function fallbackName(row) {
    if (!row.fallback) return "Tidak";
    var discount = /_ip_(\d+p)\.acq$/.exec(row.to || "");
    return discount ? discount[1] : "Ya";
  }
  function table(items, withTime) {
    if (!items.length) return "<p>Belum ada catatan.</p>";
    return "<div class=scroll><table><thead><tr><th>ID Produk Lengkap</th><th>Jumlah</th>" +
      (withTime ? "<th>Terakhir Ditemukan (UTC)</th>" : "<th>SKU Target Aktual</th><th>Cadangan</th>") + "</tr></thead><tbody>" +
      items.map(function (row) {
        return "<tr><td><code>" + escape(row.id) + "</code></td><td>" + row.count + "</td>" +
          (withTime ? "<td>" + escape(row.lastSeen) + "</td>" :
            "<td><code>" + escape(row.to || "Tidak tercatat") + "</code></td><td>" + fallbackName(row) + "</td>") + "</tr>";
      }).join("") + "</tbody></table></div>";
  }
  function recentTable(events) {
    if (!events.length) return "<p>Belum ada catatan respons per kejadian; data pengumpulan versi lama tidak memiliki diagnostik ini.</p>";
    return "<div class=scroll><table><thead><tr><th>Waktu (UTC)</th><th>Kategori Jalur</th><th>Hasil Kali Ini</th><th>ID Dikenali</th><th>Baru Dicatat</th><th>Di Luar Kapasitas</th></tr></thead><tbody>" +
      events.slice().reverse().map(function (event) {
        return "<tr><td>" + escape(event.at) + "</td><td>" + escape(event.path) +
          "</td><td>" + scanStatuses[event.status] + "</td><td>" + event.candidateCount +
          "</td><td>" + event.addedCount + "</td><td>" + event.omittedCount + "</td></tr>";
      }).join("") + "</tbody></table></div>";
  }
  function presetTable() {
    return "<div class=scroll><table><thead><tr><th>Label</th><th>SKU Tersembunyi (Product ID)</th><th>Keterangan</th><th>Aksi</th></tr></thead><tbody>" +
      PRESET_SKUS.map(function (item) {
        var active = item.sku === CONFIGURED_TARGET;
        return "<tr" + (active ? " style=\"background:#eef8f2\"" : "") + "><td><strong>" + escape(item.tag) + "</strong></td><td><code>" + escape(item.sku) + "</code></td><td>" + escape(item.label) + "</td><td>" +
          (active ? "<span class=badge>Sedang Aktif</span>" : "<a href=\"" + ROOT + "?set_target=" + encodeURIComponent(item.sku) + "\">Ganti 1-Klik</a>") + "</td></tr>";
      }).join("") + "</tbody></table></div>";
  }

  var latestScan = report.scan.recentResponses.length ?
    report.scan.recentResponses[report.scan.recentResponses.length - 1] : null;
  var scanVersionStatus = report.scan.version === COLLECTOR_VERSION ?
    "Catatan berasal dari skrip pengumpul versi ini; gunakan waktu respons dan hitungan untuk memastikan apakah catatan baru terbentuk." :
    report.scan.version ? "Catatan pengumpulan lama; belum ada catatan respons pengumpulan versi ini yang tersimpan." : "Belum ada catatan respons pengumpulan versi ini yang tersimpan.";
  var statuses = {
    "rewritten": "Penggantian string telah dijalankan",
    "no-match": "Respons kali ini tidak cocok dengan produk sumber pada pemetaan 3 paket",
    "non-text": "Respons kali ini tidak memiliki body teks yang dapat diproses"
  };
  var status = Object.prototype.hasOwnProperty.call(statuses, report.test.status) ?
    statuses[report.test.status] : "Belum ada catatan eksekusi pengujian";
  var html = [
    "<!doctype html><html lang=id><meta charset=utf-8>",
    "<meta name=viewport content=\"width=device-width,initial-scale=1\"><title>Panel Kontrol & Laporan Lokal SKU Google One</title>",
    "<style>body{font:16px/1.6 -apple-system,BlinkMacSystemFont,sans-serif;max-width:960px;margin:24px auto;padding:0 18px;color:#1c2737;background:#f5f7fa}section{background:white;border:1px solid #dde3ec;border-radius:12px;padding:18px;margin:18px 0}h1{font-size:24px;margin-bottom:10px}h2{font-size:20px}code{overflow-wrap:anywhere}a{color:#1259be}table{border-collapse:collapse;width:100%;font-size:14px}td,th{padding:9px;border-bottom:1px solid #ddd;text-align:left;vertical-align:top}.scroll{overflow:auto}.note{color:#46556b}.badge{display:inline-block;background:#e0f4e8;color:#176238;padding:4px 10px;border-radius:8px}.actions{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin:20px 0}.actions form{margin:0}button,.actions a{font:inherit;padding:10px 16px;border:0;border-radius:8px;cursor:pointer;text-decoration:none}.actions a{background:#e4eaf3}.actions button{background:#1259be;color:white}button{background:#e4eaf3;color:#1c2737}</style>",
    "<h1>Panel Kontrol & Laporan Lokal SKU Tersembunyi Google One iOS</h1>",
    "<p class=badge>Skrip Lokal Aktif · " + VERSION + "</p>",
    "<nav class=actions aria-label=\"Aksi laporan\"><form method=get action=\"" + ROOT + "\"><button type=submit name=format value=json>Ekspor JSON</button></form><a href=\"" + ROOT + "\">Segarkan Laporan</a></nav>",
    clearMessage ? "<p style=\"background:#fff8db;padding:12px;border-radius:8px;border:1px solid #e6d087\">" + escape(clearMessage) + "</p>" : "",
    "<section><h2>Ganti Target SKU Tersembunyi 2TB / Pro 5TB 1-Klik</h2>",
    "<p>Target penulisan ulang <code>g1.ios.2tb.*</code> &amp; <code>g1.ios.ai.2tb.*</code> yang aktif saat ini: <code><strong>" + escape(CONFIGURED_TARGET) + "</strong></code></p>",
    "<p class=note>Ketuk「Ganti 1-Klik」pada baris mana pun di bawah untuk mengganti target SKU secara lokal di ponsel tanpa mengubah skrip; setelah mengganti, buka ulang Google App → Kelola Google One untuk memicu penulisan ulang SKU baru. Ultra 20TB / 30TB saat ini memakai mode diskon 75% 3 bulan (<code>g1.20tb.3months_ip_75p.acq</code> / <code>g1.ai.ultra.3months_ip_75p.acq</code>).</p>",
    presetTable(), "</section>",
    "<section><h2>Pemetaan 3 Paket Terakhir</h2>",
    "<p>Versi: " + escape(report.test.version || "Belum ada") + "<br>Status: " + escape(status) + "; Total penggantian: " + report.test.hitCount + "; Di antaranya 2TB/AI Pro: " + report.test.annualHitCount + "</p>",
    "<p>Prefiks sumber 2TB / AI Pro: <code>g1.ios.2tb. | g1.ios.ai.2tb.</code><br>Target 2TB pada catatan ini: <code>" + escape(report.test.target || "Belum tercatat") + "</code><br>Waktu eksekusi (UTC): " + escape(report.test.updatedAt || "Belum ada") + "</p>",
    table(report.test.matchedFrom, false), "</section>",
    "<section><h2>Catatan Eksekusi Pengumpulan</h2>",
    "<p>Skrip pengumpul aktual: <code>" + escape(report.scan.version || "Belum tercatat") + "</code><br>" + scanVersionStatus + "</p>",
    "<p>Respons teks dipindai: " + report.scan.scannedResponses + "; Respons non-teks tercatat: " + report.scan.nonTextResponses +
      "; Respons berisi ID produk: " + report.scan.matchedResponses + "; Total ID terkumpul: " + report.scan.skus.length + "</p>",
    "<h3>10 Respons Terakhir</h3>", recentTable(report.scan.recentResponses), "</section>",
    "<section><h2>Kandidat SKU yang Terkumpul Saat Menjelajahi Halaman</h2>",
    table(report.scan.skus, true), "</section>",
    "<form method=get action=\"" + ROOT + "\"><button name=clear value=1>Kosongkan Catatan Pengumpulan & Pengujian Alat Ini</button></form>",
    "<p class=note>Atribusi sumber terbuka: Proyek ini dikembangkan dari <a href=\"https://github.com/crhywun/g1-acq\">crhywun/g1-acq</a> dan PR #3 (@cehomecambodia-lang).</p></html>"
  ].join("");
  $done({ response: { status: 200, headers: headers, body: html } });
})();
