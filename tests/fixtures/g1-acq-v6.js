/**
 * g1-acq.js — Pemetaan ID produk halaman langganan Google One (skrip http-response Shadowrocket)
 *
 * Prinsip Desain:
 *   1. Tanggung jawab tunggal — hanya melakukan pemetaan string "ID bulanan asli -> ID paket promo", tanpa diagnostik atau pelaporan;
 *   2. Sadar katalog — mengumpulkan paket promo yang benar-benar ada di respons asli terlebih dahulu (berakhiran acq); jika target utama
 *      tidak ada di katalog sementara paket cadangan ada, otomatis beralih ke paket cadangan agar kasir tidak mengarah ke produk kosong;
 *   3. Data terpisah — seluruh pemetaan terpusat di tabel SKU_MAP / FALLBACK; menambah atau menghapus paket cukup mengubah tabel.
 *
 * Versi: v6
 */
"use strict";

console.log("[g1-acq] v6 loaded");

/* ID pembelian dalam aplikasi iOS asli -> paket promo target */
var SKU_MAP = {
  "g1.ios.20tb.m.v2":     "g1.20tb.3months_ip_90p.acq",
  "g1.ios.30tb.ai.pro.m": "g1.ai.ultra.3months_ip_90p.acq"
};

/* Paket cadangan jika target utama tidak ada di katalog (uji coba komunitas menunjukkan paket 75p muncul di katalog Play/iOS) */
var FALLBACK = {
  "g1.20tb.3months_ip_90p.acq":     "g1.20tb.3months_ip_75p.acq",
  "g1.ai.ultra.3months_ip_90p.acq": "g1.ai.ultra.3months_ip_75p.acq"
};

function occurrences(s, needle) {
  return needle ? s.split(needle).length - 1 : 0;
}

function run() {
  var body = $response && $response.body;
  if (typeof body !== "string" || body === "") {
    $done({});
    return;
  }

  /* Katalog paket promo yang benar-benar ada dalam respons */
  var raw = body.match(/g1\.[a-z0-9._]{2,60}acq/g) || [];
  var seen = {};
  var catalog = [];
  for (var r = 0; r < raw.length; r++) {
    if (!seen[raw[r]]) { seen[raw[r]] = 1; catalog.push(raw[r]); }
  }
  console.log("[g1-acq] Katalog paket promo: " + (catalog.join(", ") || "tidak ada"));

  var out = body, total = 0;
  var froms = Object.keys(SKU_MAP);
  for (var k = 0; k < froms.length; k++) {
    var from = froms[k];
    var n = occurrences(out, from);
    if (n === 0) continue;

    var to = SKU_MAP[from];
    if (catalog.indexOf(to) === -1 && FALLBACK[to] && catalog.indexOf(FALLBACK[to]) !== -1) {
      console.log("[g1-acq] Paket utama tidak ada di katalog, turun ke " + to + " -> " + FALLBACK[to]);
      to = FALLBACK[to];
    }

    out = out.split(from).join(to);
    total += n;
    console.log("[g1-acq] " + from + " -> " + to + " x" + n);
  }

  console.log(total ? "[g1-acq] Total ditulis ulang " + total + " tempat" : "[g1-acq] Tidak cocok");
  $done(total ? { body: out } : {});
}

run();
