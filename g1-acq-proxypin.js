/* G1 ACQ Plus (v8.2.0-proxypin) - Skrip ProxyPin (iOS / Android / Desktop)
 * Alternatif gratis tanpa Shadowrocket untuk Google One SKU diskon & uji coba tersembunyi.
 *
 * Pembaruan v8.1.0:
 *   - Mencocokkan prefiks baru AI Pro iOS (`g1.ios.ai.2tb.*`) selain `g1.ios.2tb.*`.
 *   - Mendukung namespace `com.google.gemini.*` dan target terverifikasi iOS
 *     `com.google.gemini.2tb.ai.m.3month_ip_99p` (Pro 5TB diskon 99% 3 bulan).
 *   - Mengubah mode bawaan Ultra 20TB/30TB ke `75p` (karena `1month_eft.acq` & `90p`
 *     sudah banyak ditutup Apple/Google) serta menambah pengalih Mode Ultra 1-Klik.
 *
 * Cara Pasang Singkat di ProxyPin:
 *   1. Buka menu Scripts -> pastikan Enable Scripts aktif -> Add (+).
 *   2. Name: G1 ACQ Plus
 *   3. URL (Match Rule): https://one.google.com/*
 *      (PENTING: gunakan /*, JANGAN gunakan /ai?* karena ProxyPin tidak me-escape tanda ?)
 *   4. Pilih Load Remote Script dan tempel URL berikut:
 *      https://raw.githubusercontent.com/ezajaeja/gemini-offer-ios/main/g1-acq-proxypin.js
 *      (Atau tempel isi file ini langsung untuk mengubah DEFAULT_TARGET secara permanen.)
 *   5. Aktifkan HTTPS Proxy dan pasang + percayai sertifikat Root CA ProxyPin di iOS.
 *   6. Buka Safari ke https://one.google.com/g1-sku-report untuk panel kontrol & ganti SKU 1-klik.
 *
 * Atribusi & Kredit:
 *   - Berdasarkan proyek sumber terbuka crhywun/g1-acq (https://github.com/crhywun/g1-acq) oleh @crhywun
 *   - PR #3 (@cehomecambodia-lang) & PR #8 (@duwqijlk) untuk com.google.gemini.2tb.ai.m.3month_ip_99p
 */
"use strict";

// Ubah DEFAULT_TARGET atau DEFAULT_ULTRA_MODE di bawah ini jika ingin mengganti bawaan secara permanen.
// Rekomendasi Terverifikasi iOS StoreKit:
//   - "com.google.gemini.2tb.ai.m.3month_ip_99p" : [Rekomendasi iOS] Pro 5TB - Diskon 99% 3 bulan (~Rp1rb-2rb/bln)
//   - "g1.2tb.ai.12months_ip_90p"                : [Kandidat iOS] Pro 5TB - Diskon 90% 12 bulan ($1.99/bln x 12)
// Daftar Preset Uji Play/iOS (sebagian SKU `eft` berasal dari katalog Play dan dapat ditolak iOS StoreKit):
//   - "g1.2tb.ai.18months_eft"      : Pro 5TB - Uji coba gratis $0 18 bulan
//   - "g1.2tb.ai.15months_eft"      : Pro 5TB - Uji coba gratis $0 15 bulan
//   - "g1.2tb.ai.12months_eft"      : Pro 5TB - Uji coba gratis $0 12 bulan
//   - "g1.2tb.ai.subs_variant"      : Pro 5TB - Varian uji coba gratis $0 12 bulan / 6 bulan
//   - "g1.play.2tb.ai.student"      : Pro 5TB - Jalur Pelajar uji coba gratis $0 12 bulan
//   - "g1.2tb.ai.6months_eft"       : Pro 5TB - Uji coba gratis $0 6 bulan
//   - "g1.2tb.ai.4months_eft"       : Pro 5TB - Uji coba gratis $0 4 bulan
//   - "g1.2tb.ai.3months_eft"       : Pro 5TB - Uji coba gratis $0 3 bulan
//   - "g1.2tb.ai.2months_eft"       : Pro 5TB - Uji coba gratis $0 2 bulan
//   - "g1.2tb.ai.3months_ip_90p.acq": Pro 5TB - Diskon 90% 3 bulan ($1.99/bln x 3)
//   - "g1.2tb.ai.1month_ip_95p.acq" : Pro 5TB - Diskon 95% bulan pertama ($0.99/bln pertama)
//   - "g1.2tb.1year_eft"            : AI Plus 2TB - Uji coba gratis $0 12 bulan
//   - "g1.2tb.6months_eft"          : AI Plus 2TB - Uji coba gratis $0 6 bulan
//   - "g1.2tb.subs_variant"         : AI Plus 2TB - Varian uji coba gratis $0 6 bulan / 3 bulan
//   - "g1.play.helium"              : AI Plus 400GB - Uji coba gratis $0 12 bulan
//   - "g1.play.helium.student"      : AI Plus 400GB - Pelajar uji coba gratis $0 12 bulan
//   - "g1.helium.12months_ip_90p"   : AI Plus 400GB - Diskon 90% 12 bulan ($0.49/bln x 12)
//   - "g1.100gb.1year_eft"          : Penyimpanan 100GB - Uji coba gratis $0 12 bulan
//   - "g1.100gb.9months_eft"        : Penyimpanan 100GB - Uji coba gratis $0 9 bulan
//   - "g1.200gb.1year_eft"          : Penyimpanan 200GB - Uji coba gratis $0 12 bulan
//
// Pilihan DEFAULT_ULTRA_MODE: "75p" (bawaan), "gemini99p", "trial", "90p", "tr", "off"
var DEFAULT_TARGET = "com.google.gemini.2tb.ai.m.3month_ip_99p";
var DEFAULT_ULTRA_MODE = "75p";

var G1AcqProxyPin = (function () {
  var VERSION = "g1-acq-v8.2.0-proxypin";
  var REPORT_VERSION = "v8.2.0-proxypin";
  var ROOT = "https://one.google.com/g1-sku-report";
  var PRO_PREFIXES = ["g1.ios.2tb.", "g1.ios.ai.2tb."];
  var SOURCE_PREFIX_LABEL = "g1.ios.2tb. | g1.ios.ai.2tb.";
  var LEGACY_TARGET = "g1.2tb.ai.annual";
  var SESSION_OVERRIDE_KEY = "g1_target_override";
  var SESSION_ULTRA_KEY = "g1_ultra_mode";
  var SESSION_ULTRA_SKU_KEY = "g1_ultra_custom_sku";
  var SESSION_SCAN_KEY = "g1_scan_state";
  var SESSION_TEST_KEY = "g1_test_record";
  var SCAN_LIMIT = 300;
  var RECENT_LIMIT = 10;
  var MAX_EVENT_COUNT = 9007199254740991;
  var OTHER_PATH_LABEL = "[Jalur one.google.com lainnya]";
  var BATCH_PATH_LABEL = "/_/.../data/batchexecute";

  var FALLBACK = {
    "g1.20tb.1month_eft.acq": "g1.20tb.3months_ip_90p.acq",
    "g1.ai.ultra.1month_eft.acq": "g1.ai.ultra.3months_ip_90p.acq"
  };

  var ULTRA_MODES = [
    {
      mode: "75p",
      tag: "iOS 75p",
      label: "[Bawaan] Ultra 20TB / 30TB Diskon 75% 3 bulan (g1.20tb.3months_ip_75p.acq & g1.ai.ultra.3months_ip_75p.acq)",
      map: {
        "g1.ios.20tb.m.v2": "g1.20tb.3months_ip_75p.acq",
        "g1.ios.30tb.ai.pro.m": "g1.ai.ultra.3months_ip_75p.acq"
      }
    },
    {
      mode: "gemini99p",
      tag: "PRO 99% OFF",
      label: "[PR #8 iOS] Ketuk Ultra 20TB untuk membuka kasir Pro 5TB Diskon 99% 3 bulan (com.google.gemini.2tb.ai.m.3month_ip_99p); 30TB dilewati",
      map: {
        "g1.ios.20tb.m.v2": "com.google.gemini.2tb.ai.m.3month_ip_99p"
      }
    },
    {
      mode: "trial",
      tag: "TRIAL 1M",
      label: "[Banyak Ditutup di iOS] Ultra 20TB / 30TB Uji coba gratis 1 bulan (1month_eft.acq, fallback 90p)",
      map: {
        "g1.ios.20tb.m.v2": "g1.20tb.1month_eft.acq",
        "g1.ios.30tb.ai.pro.m": "g1.ai.ultra.1month_eft.acq"
      }
    },
    {
      mode: "90p",
      tag: "90p 3M",
      label: "[Banyak Ditutup di iOS] Ultra 20TB / 30TB Diskon 90% 3 bulan (3months_ip_90p.acq)",
      map: {
        "g1.ios.20tb.m.v2": "g1.20tb.3months_ip_90p.acq",
        "g1.ios.30tb.ai.pro.m": "g1.ai.ultra.3months_ip_90p.acq"
      }
    },
    {
      mode: "tr",
      tag: "TR / LEGACY",
      label: "Ultra 20TB / 30TB SKU iOS Turki / Lama (g1.ios.20tb.m & g1.ios.30tb.m)",
      map: {
        "g1.ios.20tb.m.v2": "g1.ios.20tb.m",
        "g1.ios.30tb.ai.pro.m": "g1.ios.30tb.m"
      }
    },
    {
      mode: "off",
      tag: "OFF",
      label: "Nonaktif - Biarkan SKU Ultra 20TB / 30TB asli tanpa penulisan ulang",
      map: {}
    }
  ];

  var PRESET_SKUS = [
    { sku: "com.google.gemini.2tb.ai.m.3month_ip_99p", label: "[Rekomendasi iOS] Pro 5TB - Diskon 99% 3 bulan (com.google.gemini...99p)", tag: "iOS 99% OFF" },
    { sku: "g1.ios.2tb.y", label: "[Khusus Turki iOS] Penyimpanan 2TB Tahunan Lama (TRY 499.99/tahun)", tag: "TR 2TB/THN" },
    { sku: "g1.2tb.ai.12months_ip_90p", label: "[Kandidat iOS] Pro 5TB - Diskon 90% 12 bulan ($1.99/bln x 12 = $23.88)", tag: "iOS $1.99x12M" },
    { sku: "g1.2tb.ai.18months_eft", label: "[Uji Play/iOS] Pro 5TB - Uji coba gratis $0 18 bulan (eft-18months)", tag: "FREE 18M" },
    { sku: "g1.2tb.ai.15months_eft", label: "[Uji Play/iOS] Pro 5TB - Uji coba gratis $0 15 bulan (eft-15months)", tag: "FREE 15M" },
    { sku: "g1.2tb.ai.12months_eft", label: "[Uji Play/iOS] Pro 5TB - Uji coba gratis $0 12 bulan (eft-12months)", tag: "FREE 12M" },
    { sku: "g1.2tb.ai.subs_variant", label: "[Uji Play/iOS] Pro 5TB - Varian uji coba gratis $0 12 bulan/6 bulan (subs_variant)", tag: "FREE 12M/6M" },
    { sku: "g1.play.2tb.ai.student", label: "[Uji Play/iOS] Pro 5TB - Jalur Pelajar Uji coba gratis $0 12 bulan (eft-12mo)", tag: "FREE 12M" },
    { sku: "g1.2tb.ai.6months_eft", label: "[Uji Play/iOS] Pro 5TB - Uji coba gratis $0 6 bulan (eft-6months)", tag: "FREE 6M" },
    { sku: "g1.2tb.ai.4months_eft", label: "[Uji Play/iOS] Pro 5TB - Uji coba gratis $0 4 bulan (eft-4months)", tag: "FREE 4M" },
    { sku: "g1.2tb.ai.3months_eft", label: "[Uji Play/iOS] Pro 5TB - Uji coba gratis $0 3 bulan (eft-3months)", tag: "FREE 3M" },
    { sku: "g1.2tb.ai.2months_eft", label: "[Uji Play/iOS] Pro 5TB - Uji coba gratis $0 2 bulan (eft-2months)", tag: "FREE 2M" },
    { sku: "g1.2tb.ai.3months_ip_90p.acq", label: "[Uji Play/iOS] Pro 5TB - Promo diskon 90% 3 bulan ($1.99/bln x 3)", tag: "$1.99x3M" },
    { sku: "g1.2tb.ai.1month_ip_95p.acq", label: "[Uji Play/iOS] Pro 5TB - Promo diskon 95% 1 bulan ($0.99/bulan pertama)", tag: "$0.99x1M" },
    { sku: "g1.2tb.1year_eft", label: "[Uji Play/iOS] AI Plus 2TB - Uji coba gratis $0 12 bulan (1year_eft)", tag: "FREE 12M" },
    { sku: "g1.2tb.6months_eft", label: "[Uji Play/iOS] AI Plus 2TB - Uji coba gratis $0 6 bulan (6months_eft)", tag: "FREE 6M" },
    { sku: "g1.2tb.subs_variant", label: "[Uji Play/iOS] AI Plus 2TB - Varian uji coba gratis $0 6 bulan/3 bulan", tag: "FREE 6M/3M" },
    { sku: "g1.play.helium", label: "[Uji Play/iOS] AI Plus 400GB - Uji coba gratis $0 12 bulan (eft-12mo)", tag: "FREE 12M" },
    { sku: "g1.play.helium.student", label: "[Uji Play/iOS] AI Plus 400GB - Pelajar Uji coba gratis $0 12 bulan", tag: "FREE 12M" },
    { sku: "g1.helium.12months_ip_90p", label: "[Uji Play/iOS] AI Plus 400GB - Diskon 90% 12 bulan ($0.49/bln x 12 = $5.88/thn)", tag: "$0.49x12M" },
    { sku: "g1.100gb.1year_eft", label: "[Uji Play/iOS] Penyimpanan 100GB - Uji coba gratis $0 12 bulan (1year_eft)", tag: "FREE 12M" },
    { sku: "g1.100gb.9months_eft", label: "[Uji Play/iOS] Penyimpanan 100GB - Uji coba gratis $0 9 bulan (9months_eft)", tag: "FREE 9M" },
    { sku: "g1.200gb.1year_eft", label: "[Uji Play/iOS] Penyimpanan 200GB - Uji coba gratis $0 12 bulan (1year_eft)", tag: "FREE 12M" },
    { sku: "g1.youtube_premium_individual_add_on", label: "[Play Add-on] YouTube Premium Individual - Gratis $0 1 bulan (eft-1mo)", tag: "YT FREE 1M" }
  ];

  var memState = {};

  function isValidSku(value) {
    return typeof value === "string" &&
      /^(?:g1\.|com\.google\.(?:one|gemini)\.)[A-Za-z0-9._-]{2,160}$/.test(value);
  }

  function isProSource(id) {
    if (typeof id !== "string") return false;
    for (var i = 0; i < PRO_PREFIXES.length; i++) {
      var prefix = PRO_PREFIXES[i];
      if (id.indexOf(prefix) === 0 && id.length > prefix.length) return true;
    }
    return false;
  }

  function findUltraMode(mode) {
    for (var i = 0; i < ULTRA_MODES.length; i++) {
      if (ULTRA_MODES[i].mode === mode) return ULTRA_MODES[i];
    }
    return null;
  }

  function ensureContext(context, response) {
    var ctx = (response && response.scriptContext && typeof response.scriptContext === "object")
      ? response.scriptContext
      : (context && typeof context === "object" ? context : {});
    if (!ctx.session || typeof ctx.session !== "object" || Array.isArray(ctx.session)) {
      ctx.session = {};
    }
    if (response && typeof response === "object") {
      response.scriptContext = ctx;
    }
    return ctx;
  }

  function readState(ctx, key) {
    var raw = null;
    if (ctx && ctx.session && Object.prototype.hasOwnProperty.call(ctx.session, key)) {
      raw = ctx.session[key];
    } else if (Object.prototype.hasOwnProperty.call(memState, key)) {
      raw = memState[key];
    }
    if (!raw) return null;
    if (typeof raw === "string") {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    }
    return typeof raw === "object" ? raw : null;
  }

  function writeState(ctx, key, value) {
    var serialized = JSON.stringify(value);
    memState[key] = serialized;
    if (ctx && ctx.session && typeof ctx.session === "object") {
      ctx.session[key] = serialized;
    }
  }

  function readOverride(ctx) {
    if (ctx && ctx.session && typeof ctx.session[SESSION_OVERRIDE_KEY] === "string") {
      var sVal = ctx.session[SESSION_OVERRIDE_KEY].trim();
      if (isValidSku(sVal)) return sVal;
    }
    if (ctx && ctx.env && typeof ctx.env.G1_TARGET_SKU === "string") {
      var eVal = ctx.env.G1_TARGET_SKU.trim();
      if (isValidSku(eVal)) return eVal;
    }
    if (typeof memState[SESSION_OVERRIDE_KEY] === "string" && isValidSku(memState[SESSION_OVERRIDE_KEY])) {
      return memState[SESSION_OVERRIDE_KEY];
    }
    return isValidSku(DEFAULT_TARGET) ? DEFAULT_TARGET : "com.google.gemini.2tb.ai.m.3month_ip_99p";
  }

  function writeOverride(ctx, newTarget) {
    memState[SESSION_OVERRIDE_KEY] = newTarget;
    if (ctx && ctx.session && typeof ctx.session === "object") {
      ctx.session[SESSION_OVERRIDE_KEY] = newTarget;
    }
    if (ctx && ctx.env && typeof ctx.env === "object" && Object.prototype.hasOwnProperty.call(ctx.env, "G1_TARGET_SKU")) {
      ctx.env.G1_TARGET_SKU = newTarget;
    }
  }

  function readUltraCustomSku(ctx) {
    if (ctx && ctx.session && typeof ctx.session[SESSION_ULTRA_SKU_KEY] === "string") {
      var sVal = ctx.session[SESSION_ULTRA_SKU_KEY].trim();
      if (isValidSku(sVal)) return sVal;
    }
    if (typeof memState[SESSION_ULTRA_SKU_KEY] === "string" && isValidSku(memState[SESSION_ULTRA_SKU_KEY])) {
      return memState[SESSION_ULTRA_SKU_KEY];
    }
    return "";
  }

  function writeUltraCustomSku(ctx, customSku) {
    memState[SESSION_ULTRA_SKU_KEY] = customSku;
    if (ctx && ctx.session && typeof ctx.session === "object") {
      ctx.session[SESSION_ULTRA_SKU_KEY] = customSku;
    }
  }

  function readUltraMode(ctx) {
    if (ctx && ctx.session && typeof ctx.session[SESSION_ULTRA_KEY] === "string") {
      var sMode = ctx.session[SESSION_ULTRA_KEY].trim();
      if (sMode === "custom" && readUltraCustomSku(ctx)) return "custom";
      if (findUltraMode(sMode)) return sMode;
    }
    if (ctx && ctx.env && typeof ctx.env.G1_ULTRA_MODE === "string") {
      var eMode = ctx.env.G1_ULTRA_MODE.trim();
      if (eMode === "custom" && readUltraCustomSku(ctx)) return "custom";
      if (findUltraMode(eMode)) return eMode;
    }
    if (typeof memState[SESSION_ULTRA_KEY] === "string") {
      if (memState[SESSION_ULTRA_KEY] === "custom" && readUltraCustomSku(ctx)) return "custom";
      if (findUltraMode(memState[SESSION_ULTRA_KEY])) return memState[SESSION_ULTRA_KEY];
    }
    return findUltraMode(DEFAULT_ULTRA_MODE) ? DEFAULT_ULTRA_MODE : "75p";
  }

  function writeUltraMode(ctx, mode) {
    memState[SESSION_ULTRA_KEY] = mode;
    if (ctx && ctx.session && typeof ctx.session === "object") {
      ctx.session[SESSION_ULTRA_KEY] = mode;
    }
    if (ctx && ctx.env && typeof ctx.env === "object" && Object.prototype.hasOwnProperty.call(ctx.env, "G1_ULTRA_MODE")) {
      ctx.env.G1_ULTRA_MODE = mode;
    }
  }

  function buildQueryString(queries) {
    if (!queries || typeof queries !== "object") return "";
    var parts = [];
    Object.keys(queries).forEach(function (k) {
      var val = queries[k];
      if (val === undefined || val === null) return;
      parts.push(encodeURIComponent(k) + "=" + encodeURIComponent(String(val)));
    });
    return parts.join("&");
  }

  function parseQuery(queryString, queriesObj) {
    var map = Object.create(null);
    if (typeof queryString === "string" && queryString.length > 0) {
      queryString.split("&").forEach(function (pair) {
        if (!pair) return;
        var idx = pair.indexOf("=");
        var k = idx === -1 ? pair : pair.slice(0, idx);
        var v = idx === -1 ? "" : pair.slice(idx + 1);
        try {
          k = decodeURIComponent(k.replace(/\+/g, " "));
          v = decodeURIComponent(v.replace(/\+/g, " "));
        } catch (e) {}
        map[k] = v;
      });
    }
    if (queriesObj && typeof queriesObj === "object") {
      Object.keys(queriesObj).forEach(function (k) {
        if (!Object.prototype.hasOwnProperty.call(map, k) && queriesObj[k] !== undefined && queriesObj[k] !== null) {
          map[k] = String(queriesObj[k]);
        }
      });
    }
    return map;
  }

  function parseRequestUrl(req) {
    var rawUrl = req && typeof req.url === "string" ? req.url : "";
    var host = req && typeof req.host === "string" ? req.host : "";
    var path = req && typeof req.path === "string" ? req.path : "";
    var queryString = "";
    var scheme = "https";

    if (rawUrl) {
      var m = /^(https?):\/\/([^/?#]+)(\/[^?#]*)?(?:\?([^#]*))?/i.exec(rawUrl);
      if (m) {
        scheme = m[1].toLowerCase();
        host = host || m[2];
        path = path || m[3] || "/";
        queryString = m[4] || "";
      } else {
        var qIdx = rawUrl.indexOf("?");
        if (qIdx !== -1) {
          queryString = rawUrl.slice(qIdx + 1).split("#")[0];
          if (!path) path = rawUrl.slice(0, qIdx);
        } else if (!path && rawUrl.charAt(0) === "/") {
          path = rawUrl;
        }
      }
    }

    if (!queryString && req && req.queries && typeof req.queries === "object") {
      queryString = buildQueryString(req.queries);
    }

    host = String(host || "").replace(/:\d+$/, "").toLowerCase();
    path = path || "/";
    var fullUrl = rawUrl || (host ? (scheme + "://" + host + path + (queryString ? "?" + queryString : "")) : "");
    var query = parseQuery(queryString, req && req.queries);
    var hasQuery = queryString.length > 0 || Object.keys(query).length > 0;

    return {
      url: fullUrl,
      host: host,
      path: path,
      queryString: queryString,
      query: query,
      hasQuery: hasQuery
    };
  }

  function normalizeCharset(headers) {
    if (!headers || typeof headers !== "object") return;
    Object.keys(headers).forEach(function (key) {
      if (key.toLowerCase() === "content-type") {
        var val = headers[key];
        if (typeof val === "string") {
          headers[key] = val.replace(/charset\s*=\s*utf-?8/gi, "charset=utf-8");
        } else if (Array.isArray(val)) {
          headers[key] = val.map(function (item) {
            return typeof item === "string" ? item.replace(/charset\s*=\s*utf-?8/gi, "charset=utf-8") : item;
          });
        }
      }
    });
  }

  function text(value, length) {
    return typeof value === "string" ? value.slice(0, length || 180) : "";
  }

  function count(value) {
    var number = Number(value);
    return isFinite(number) && number > 0 ? Math.floor(number) : 0;
  }

  function sku(value) {
    return typeof value === "string" &&
      /^(?:g1\.|com\.google\.(?:one|gemini)\.)[A-Za-z0-9._-]{1,160}$/.test(value) ? value : "";
  }

  function rows(value, withTime, defaultTarget) {
    if (!Array.isArray(value)) return [];
    return value.slice(0, SCAN_LIMIT).filter(function (row) {
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

  function safeRoute(path) {
    var cleanPath = String(path || "/").replace(/\/+$/, "") || "/";
    cleanPath = cleanPath.replace(/^\/u\/\d+(?=\/|$)/, "") || "/";
    if (cleanPath === "/" || cleanPath === "/ai" || cleanPath === "/plans") return cleanPath;
    if (/^\/_\/[^?#]+\/data\/batchexecute$/.test(cleanPath)) return BATCH_PATH_LABEL;
    return OTHER_PATH_LABEL;
  }

  function responseStatus(bodyType, candidateCount, addedCount, omittedCount) {
    if (bodyType === "non-text") return "non-text";
    if (addedCount > 0) return "new-skus";
    if (omittedCount > 0) return "limit-reached";
    return candidateCount > 0 ? "known-skus" : "no-skus";
  }

  function priorResponse(row) {
    if (!row || typeof row !== "object" || Array.isArray(row)) return null;
    if (typeof row.at !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(row.at) ||
        !isFinite(Date.parse(row.at)) || new Date(row.at).toISOString() !== row.at) return null;
    if (row.path !== "/" && row.path !== "/ai" && row.path !== "/plans" &&
        row.path !== BATCH_PATH_LABEL && row.path !== OTHER_PATH_LABEL) return null;
    if (row.bodyType !== "text" && row.bodyType !== "non-text") return null;

    function counter(value, maximum) {
      if (typeof value !== "number" || !isFinite(value)) return null;
      return Math.max(0, Math.min(maximum, Math.floor(value)));
    }
    var candidateCount = counter(row.candidateCount, MAX_EVENT_COUNT);
    if (candidateCount === null) return null;
    var addedCount = counter(row.addedCount, Math.min(SCAN_LIMIT, candidateCount));
    if (addedCount === null) return null;
    var omittedCount = counter(row.omittedCount, candidateCount - addedCount);
    if (omittedCount === null) return null;
    if (row.bodyType === "non-text" && (candidateCount || addedCount || omittedCount)) return null;
    if (row.status !== responseStatus(row.bodyType, candidateCount, addedCount, omittedCount)) return null;
    return {
      at: row.at,
      path: row.path,
      bodyType: row.bodyType,
      status: row.status,
      candidateCount: candidateCount,
      addedCount: addedCount,
      omittedCount: omittedCount
    };
  }

  function collectOriginalSkus(ctx, path, originalBody) {
    var now = new Date().toISOString();
    var saved = readState(ctx, SESSION_SCAN_KEY);
    if (!saved || saved.schemaVersion !== 1) saved = {};

    var byId = Object.create(null);
    var ids = [];
    var validId = /^(?:g1\.|com\.google\.(?:one|gemini)\.)[A-Za-z0-9._-]{1,160}$/;
    var oldRows = Array.isArray(saved.skus) ? saved.skus : [];
    oldRows.slice(0, SCAN_LIMIT).forEach(function (row) {
      if (!row || typeof row.id !== "string" || !validId.test(row.id) || byId[row.id]) return;
      var c = Number(row.count);
      byId[row.id] = {
        id: row.id,
        count: isFinite(c) && c > 0 ? Math.floor(c) : 0,
        lastSeen: typeof row.lastSeen === "string" ? row.lastSeen.slice(0, 32) : ""
      };
      ids.push(row.id);
    });

    var isText = typeof originalBody === "string";
    var found = Object.create(null);
    var hitCount = 0;
    var addedCount = 0;
    var omittedCount = 0;
    var truncated = saved.truncated === true;

    if (isText) {
      var normalized = originalBody.replace(/\\u002e|\\x2e|&#0*46;|&#x0*2e;|&period;/gi, ".");
      var token = /(^|[^A-Za-z0-9._@%-])((?:g1\.|com\.google\.(?:one|gemini)\.)[A-Za-z0-9._-]+)(?=$|[^A-Za-z0-9._-])/g;
      var match;
      while ((match = token.exec(normalized)) !== null) {
        var id = match[2];
        if (!validId.test(id)) continue;
        found[id] = (found[id] || 0) + 1;
        hitCount += 1;
        if (!byId[id]) {
          if (ids.length >= SCAN_LIMIT) {
            truncated = true;
            if (found[id] === 1) omittedCount += 1;
            continue;
          }
          byId[id] = { id: id, count: 0, lastSeen: now };
          ids.push(id);
          addedCount += 1;
        }
        byId[id].count += 1;
        byId[id].lastSeen = now;
      }
    }

    var candidateCount = Object.keys(found).length;
    var bodyType = isText ? "text" : "non-text";
    var status = responseStatus(bodyType, candidateCount, addedCount, omittedCount);
    var recentResponses = [];
    var oldResponses = Array.isArray(saved.recentResponses) ? saved.recentResponses : [];
    oldResponses.slice(-RECENT_LIMIT).forEach(function (row) {
      var ev = priorResponse(row);
      if (ev) recentResponses.push(ev);
    });
    recentResponses.push({
      at: now,
      path: safeRoute(path),
      bodyType: bodyType,
      status: status,
      candidateCount: candidateCount,
      addedCount: addedCount,
      omittedCount: omittedCount
    });

    function priorCount(value) {
      var n = Number(value);
      return isFinite(n) && n > 0 ? Math.floor(n) : 0;
    }

    var state = {
      schemaVersion: 1,
      version: VERSION,
      updatedAt: now,
      scannedResponses: priorCount(saved.scannedResponses) + (isText ? 1 : 0),
      matchedResponses: priorCount(saved.matchedResponses) + (hitCount > 0 ? 1 : 0),
      nonTextResponses: priorCount(saved.nonTextResponses) + (isText ? 0 : 1),
      recentResponses: recentResponses.slice(-RECENT_LIMIT),
      limit: SCAN_LIMIT,
      truncated: truncated,
      skus: ids.sort().map(function (id) { return byId[id]; })
    };

    writeState(ctx, SESSION_SCAN_KEY, state);
    console.log("[g1-acq-proxypin] " + VERSION + " status=" + status + " addedCount=" + addedCount +
      " candidates=" + candidateCount + " omittedCount=" + omittedCount + " occurrences=" + hitCount);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function serveReport(ctx, res, parsed) {
    var clearMessage = "";
    var clearOk = false;

    if (parsed.query.set_target && isValidSku(parsed.query.set_target.trim())) {
      var newTarget = parsed.query.set_target.trim();
      writeOverride(ctx, newTarget);
      clearOk = true;
      clearMessage = "Target penulisan ulang 2TB / AI Pro diubah ke: " + newTarget +
        " (tutup paksa Google App lalu buka ulang halaman paket untuk memicu penulisan ulang)";
    } else if (parsed.query.set_ultra_sku && isValidSku(parsed.query.set_ultra_sku.trim())) {
      var newUltraSku = parsed.query.set_ultra_sku.trim();
      writeUltraCustomSku(ctx, newUltraSku);
      writeUltraMode(ctx, "custom");
      clearOk = true;
      clearMessage = "SKU Ultra kustom (20TB & 30TB) diubah ke: " + newUltraSku +
        " (tutup paksa Google App lalu buka ulang halaman paket untuk memicu penulisan ulang)";
    } else if (parsed.query.set_ultra && findUltraMode(parsed.query.set_ultra.trim())) {
      var newUltra = parsed.query.set_ultra.trim();
      writeUltraMode(ctx, newUltra);
      clearOk = true;
      clearMessage = "Mode paket Ultra 20TB / 30TB diubah ke: " + newUltra +
        " (tutup paksa Google App lalu buka ulang halaman paket untuk memicu penulisan ulang)";
    } else if (parsed.query.clear === "1") {
      writeState(ctx, SESSION_SCAN_KEY, {});
      writeState(ctx, SESSION_TEST_KEY, {});
      clearMessage = "Dua catatan lokal sesi ProxyPin ini telah dikosongkan (pengaturan target tetap dipertahankan).";
    }

    var configuredTarget = readOverride(ctx);
    var configuredUltraMode = readUltraMode(ctx);
    var configuredUltraCustomSku = readUltraCustomSku(ctx);
    var scanRaw = readState(ctx, SESSION_SCAN_KEY) || {};
    if (scanRaw.schemaVersion !== 1) scanRaw = {};
    var testRaw = readState(ctx, SESSION_TEST_KEY) || {};
    if (testRaw.schemaVersion !== 1) testRaw = {};

    var recordedTarget = sku(testRaw.target);
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
    var targetOrigin = recordedTarget && /^(?:user-specified|pattern-derived|legacy)$/.test(storedOrigin)
      ? storedOrigin
      : recordedTarget === configuredTarget ? "user-specified"
      : recordedTarget === LEGACY_TARGET ? "legacy" : "";

    var scanStatuses = {
      "new-skus": "Ditemukan dan dicatat ID baru",
      "known-skus": "Respons diterima, ID sama dengan catatan yang sudah ada",
      "no-skus": "Respons teks diterima, tidak ada ID produk kali ini",
      "limit-reached": "ID baru diterima, batas kapasitas pengumpulan tercapai",
      "non-text": "Respons diterima, body bukan teks yang dapat dipindai"
    };
    var scanPaths = ["/", "/ai", "/plans", BATCH_PATH_LABEL, OTHER_PATH_LABEL];

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
          path: scanPaths.indexOf(event.path) !== -1 ? event.path : OTHER_PATH_LABEL,
          bodyType: event.bodyType,
          status: event.status,
          candidateCount: count(event.candidateCount),
          addedCount: count(event.addedCount),
          omittedCount: count(event.omittedCount)
        };
      });
    }

    var report = {
      schemaVersion: 1,
      reportVersion: REPORT_VERSION,
      configuredTarget: configuredTarget,
      configuredUltraMode: configuredUltraMode,
      configuredUltraCustomSku: configuredUltraCustomSku,
      storageMode: "proxypin-session",
      scan: {
        version: text(scanRaw.version, 32),
        updatedAt: text(scanRaw.updatedAt, 32),
        scannedResponses: count(scanRaw.scannedResponses),
        matchedResponses: count(scanRaw.matchedResponses),
        nonTextResponses: count(scanRaw.nonTextResponses),
        recentResponses: recent(scanRaw.recentResponses),
        truncated: scanRaw.truncated === true,
        limit: SCAN_LIMIT,
        skus: rows(scanRaw.skus, true)
      },
      test: {
        version: text(testRaw.version, 32),
        updatedAt: text(testRaw.updatedAt, 32),
        sourcePrefix: SOURCE_PREFIX_LABEL,
        target: recordedTarget,
        targetOrigin: targetOrigin,
        ultraMode: text(testRaw.ultraMode, 32),
        status: text(testRaw.status, 32),
        hitCount: count(testRaw.hitCount),
        annualHitCount: annualHitCount,
        matchedFrom: matchedFrom
      }
    };

    var exportJSON = parsed.query.format === "json";
    res.statusCode = 200;
    res.headers = {
      "Content-Type": exportJSON ? "application/json; charset=utf-8" : "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-G1-Report-Version": REPORT_VERSION,
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self' https://one.google.com; base-uri 'none'; frame-ancestors 'none'"
    };

    if (exportJSON) {
      res.body = JSON.stringify(report, null, 2);
      return res;
    }

    function fallbackName(row) {
      if (!row.fallback) return "Tidak";
      var discount = /_ip_(\d+p)\.acq$/.exec(row.to || "");
      return discount ? discount[1] : "Ya";
    }

    function table(items, withTime) {
      if (!items.length) return "<p>Belum ada catatan.</p>";
      return "<div class=scroll><table><thead><tr><th>ID Produk Lengkap</th><th>Jumlah</th>" +
        (withTime ? "<th>Terakhir Ditemukan (UTC)</th>" : "<th>SKU Target Aktual</th><th>Cadangan</th>") +
        "</tr></thead><tbody>" +
        items.map(function (row) {
          return "<tr><td><code>" + escapeHtml(row.id) + "</code></td><td>" + row.count + "</td>" +
            (withTime ? "<td>" + escapeHtml(row.lastSeen) + "</td>" :
              "<td><code>" + escapeHtml(row.to || "Tidak tercatat") + "</code></td><td>" + fallbackName(row) + "</td>") +
            "</tr>";
        }).join("") + "</tbody></table></div>";
    }

    function recentTable(events) {
      if (!events.length) return "<p>Belum ada catatan respons per kejadian pada sesi ProxyPin ini.</p>";
      return "<div class=scroll><table><thead><tr><th>Waktu (UTC)</th><th>Kategori Jalur</th><th>Hasil Kali Ini</th><th>ID Dikenali</th><th>Baru Dicatat</th><th>Di Luar Kapasitas</th></tr></thead><tbody>" +
        events.slice().reverse().map(function (event) {
          return "<tr><td>" + escapeHtml(event.at) + "</td><td>" + escapeHtml(event.path) +
            "</td><td>" + scanStatuses[event.status] + "</td><td>" + event.candidateCount +
            "</td><td>" + event.addedCount + "</td><td>" + event.omittedCount + "</td></tr>";
        }).join("") + "</tbody></table></div>";
    }

    function presetTable() {
      return "<div class=scroll><table><thead><tr><th>Label</th><th>SKU Tersembunyi (Product ID)</th><th>Keterangan</th><th>Aksi</th></tr></thead><tbody>" +
        PRESET_SKUS.map(function (item) {
          var active = item.sku === configuredTarget;
          return "<tr" + (active ? " style=\"background:#eef8f2\"" : "") + "><td><strong>" + escapeHtml(item.tag) +
            "</strong></td><td><code>" + escapeHtml(item.sku) + "</code></td><td>" + escapeHtml(item.label) + "</td><td>" +
            (active ? "<span class=badge>Sedang Aktif</span>" :
              "<a href=\"" + ROOT + "?set_target=" + encodeURIComponent(item.sku) + "\">Ganti 1-Klik</a>") +
            "</td></tr>";
        }).join("") + "</tbody></table></div>";
    }

    function ultraTable() {
      return "<div class=scroll><table><thead><tr><th>Tag</th><th>Mode</th><th>Keterangan</th><th>Aksi</th></tr></thead><tbody>" +
        ULTRA_MODES.map(function (item) {
          var active = item.mode === configuredUltraMode;
          return "<tr" + (active ? " style=\"background:#eef8f2\"" : "") + "><td><strong>" + escapeHtml(item.tag) +
            "</strong></td><td><code>" + escapeHtml(item.mode) + "</code></td><td>" + escapeHtml(item.label) + "</td><td>" +
            (active ? "<span class=badge>Sedang Aktif</span>" :
              "<a href=\"" + ROOT + "?set_ultra=" + encodeURIComponent(item.mode) + "\">Ganti 1-Klik</a>") +
            "</td></tr>";
        }).join("") + "</tbody></table></div>";
    }

    var scanVersionStatus = report.scan.version === VERSION ?
      "Catatan berasal dari skrip ProxyPin sesi aktif; gunakan waktu respons dan hitungan untuk memantau pembaruan." :
      "Belum ada catatan respons pengumpulan pada sesi ProxyPin saat ini.";
    var statuses = {
      "rewritten": "Penggantian string telah dijalankan",
      "no-match": "Respons kali ini tidak cocok dengan produk sumber pada pemetaan",
      "non-text": "Respons kali ini tidak memiliki body teks yang dapat diproses"
    };
    var status = Object.prototype.hasOwnProperty.call(statuses, report.test.status)
      ? statuses[report.test.status]
      : "Belum ada catatan eksekusi pengujian";

    var noticeHtml = clearMessage
      ? "<p style=\"background:#fff8db;padding:12px;border-radius:8px;border:1px solid #e6d087\">" +
        (clearOk ? "&#9989; " : "") + escapeHtml(clearMessage) + "</p>"
      : "";

    res.body = [
      "<!doctype html><html lang=id><meta charset=utf-8>",
      "<meta name=viewport content=\"width=device-width,initial-scale=1\"><title>Panel Kontrol &amp; Laporan Lokal SKU Google One (ProxyPin)</title>",
      "<style>body{font:16px/1.6 -apple-system,BlinkMacSystemFont,sans-serif;max-width:960px;margin:24px auto;padding:0 18px;color:#1c2737;background:#f5f7fa}section{background:white;border:1px solid #dde3ec;border-radius:12px;padding:18px;margin:18px 0}h1{font-size:24px;margin-bottom:10px}h2{font-size:20px}code{overflow-wrap:anywhere}a{color:#1259be}table{border-collapse:collapse;width:100%;font-size:14px}td,th{padding:9px;border-bottom:1px solid #ddd;text-align:left;vertical-align:top}.scroll{overflow:auto}.note{color:#46556b}.badge{display:inline-block;background:#e0f4e8;color:#176238;padding:4px 10px;border-radius:8px}.actions{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin:20px 0}.actions form{margin:0}button,.actions a{font:inherit;padding:10px 16px;border:0;border-radius:8px;cursor:pointer;text-decoration:none}.actions a{background:#e4eaf3}.actions button{background:#1259be;color:white}button{background:#e4eaf3;color:#1c2737}</style>",
      "<h1>Panel Kontrol &amp; Laporan Lokal SKU Tersembunyi Google One iOS</h1>",
      "<p class=badge>Skrip Lokal ProxyPin Aktif &middot; " + REPORT_VERSION + "</p>",
      "<nav class=actions aria-label=\"Aksi laporan\"><form method=get action=\"" + ROOT + "\"><button type=submit name=format value=json>Ekspor JSON</button></form><a href=\"" + ROOT + "\">Segarkan Laporan</a></nav>",
      noticeHtml,
      "<section><h2>Ganti Target SKU Tersembunyi 2TB / Pro 5TB 1-Klik</h2>",
      "<p>Target penulisan ulang <code>g1.ios.2tb.*</code> &amp; <code>g1.ios.ai.2tb.*</code> aktif saat ini: <code><strong>" + escapeHtml(configuredTarget) + "</strong></code></p>",
      "<p class=note>Catatan: jika muncul popup \"Pembelian belum selesai, coba pilih paket lagi\", berarti SKU tersebut tidak aktif di StoreKit iOS untuk akun/wilayah Anda (banyak SKU <code>eft</code> berasal dari Google Play). Coba target bertanda <strong>[Rekomendasi iOS]</strong> (<code>com.google.gemini.2tb.ai.m.3month_ip_99p</code>) atau <strong>[Kandidat iOS]</strong> terlebih dahulu. Untuk mengubah bawaan secara permanen, edit <code>DEFAULT_TARGET</code> di atas file <code>g1-acq-proxypin.js</code>.</p>",
      "<form method=get action=\"" + ROOT + "\" style=\"margin:12px 0;display:flex;gap:8px;flex-wrap:wrap;align-items:center\">",
      "<input type=text name=set_target placeholder=\"Contoh: g1.ios.2tb.y atau com.google.gemini...\" style=\"padding:8px;width:280px;max-width:100%;border:1px solid #ccc;border-radius:6px\">",
      "<button type=submit>Terapkan SKU Pro Kustom</button></form>",
      presetTable(), "</section>",
      "<section><h2>Mode Paket Ultra (20TB / 30TB) 1-Klik</h2>",
      "<p>Mode Ultra aktif saat ini: <code><strong>" + escapeHtml(configuredUltraMode) + "</strong></code>" +
      (configuredUltraMode === "custom" && configuredUltraCustomSku ? " &mdash; SKU Kustom: <code><strong>" + escapeHtml(configuredUltraCustomSku) + "</strong></code>" : "") + "</p>",
      "<p class=note>SKU Ultra <code>1month_eft.acq</code> &amp; <code>90p</code> sudah banyak ditutup di iOS sehingga memunculkan error \"Pembelian belum selesai\". Gunakan mode <code>75p</code>, <code>tr</code> (khusus Apple ID Turki), <code>gemini99p</code> (ketuk Ultra 20TB untuk membuka promo Pro 99% off), <code>off</code>, atau uji SKU kustom di bawah.</p>",
      "<form method=get action=\"" + ROOT + "\" style=\"margin:12px 0;display:flex;gap:8px;flex-wrap:wrap;align-items:center\">",
      "<input type=text name=set_ultra_sku placeholder=\"Contoh: com.google.gemini.20tb.m.3month_ip_99p\" style=\"padding:8px;width:280px;max-width:100%;border:1px solid #ccc;border-radius:6px\">",
      "<button type=submit>Uji SKU Ultra Kustom</button></form>",
      ultraTable(), "</section>",
      "<section><h2>Pemetaan Terakhir</h2>",
      "<p>Versi: " + escapeHtml(report.test.version || "Belum ada") + "<br>Status: " + escapeHtml(status) + "; Mode Ultra: " + escapeHtml(report.test.ultraMode || configuredUltraMode) + "; Total penggantian: " + report.test.hitCount + "; Di antaranya 2TB/AI Pro: " + report.test.annualHitCount + "</p>",
      "<p>Prefiks sumber 2TB / AI Pro: <code>" + escapeHtml(SOURCE_PREFIX_LABEL) + "</code><br>Target 2TB / AI Pro pada catatan ini: <code>" + escapeHtml(report.test.target || "Belum tercatat") + "</code><br>Waktu eksekusi (UTC): " + escapeHtml(report.test.updatedAt || "Belum ada") + "</p>",
      table(report.test.matchedFrom, false), "</section>",
      "<section><h2>Catatan Eksekusi Pengumpulan</h2>",
      "<p>Skrip pengumpul aktual: <code>" + escapeHtml(report.scan.version || "Belum tercatat") + "</code><br>" + scanVersionStatus + "</p>",
      "<p>Respons teks dipindai: " + report.scan.scannedResponses + "; Respons non-teks tercatat: " + report.scan.nonTextResponses +
        "; Respons berisi ID produk: " + report.scan.matchedResponses + "; Total ID terkumpul: " + report.scan.skus.length + "</p>",
      "<h3>10 Respons Terakhir</h3>", recentTable(report.scan.recentResponses), "</section>",
      "<section><h2>Kandidat SKU yang Terkumpul Saat Menjelajahi Halaman</h2>",
      table(report.scan.skus, true), "</section>",
      "<form method=get action=\"" + ROOT + "\"><button name=clear value=1>Kosongkan Catatan Pengumpulan &amp; Pengujian Sesi Ini</button></form>",
      "<p class=note>Atribusi sumber terbuka: Proyek ini dikembangkan dari <a href=\"https://github.com/crhywun/g1-acq\">crhywun/g1-acq</a>, PR #3 (@cehomecambodia-lang), dan PR #8 (@duwqijlk).</p></html>"
    ].join("");
    return res;
  }

  function handleResponse(context, request, response) {
    if (!response || typeof response !== "object") return response;
    var ctx = ensureContext(context, response);
    var parsed = parseRequestUrl(request);

    if (parsed.host !== "one.google.com") {
      return response;
    }

    if (/^\/g1-sku-report\/?$/.test(parsed.path)) {
      return serveReport(ctx, response, parsed);
    }

    var body = response.body;
    if (typeof body === "string") {
      normalizeCharset(response.headers);
    }

    try {
      collectOriginalSkus(ctx, parsed.path, body);
    } catch (error) {
      console.log("[g1-acq-proxypin] SKU collection unavailable");
    }

    var isTargetEndpoint = /^\/(?:u\/\d+\/)?(?:ai|plans|subscribe|upsell|about\/plans)\/?$/i.test(parsed.path);
    if (!isTargetEndpoint) {
      return response;
    }

    var target = readOverride(ctx);
    var ultraMode = readUltraMode(ctx);
    var ultraMap;
    if (ultraMode === "custom") {
      var customUltraSku = readUltraCustomSku(ctx);
      ultraMap = customUltraSku ? {
        "g1.ios.20tb.m.v2": customUltraSku,
        "g1.ios.30tb.ai.pro.m": customUltraSku
      } : {};
    } else {
      var ultraPreset = findUltraMode(ultraMode) || ULTRA_MODES[0];
      ultraMap = ultraPreset.map;
    }

    var mappings = Object.create(null);
    var hits = 0;
    var annualHits = 0;
    var out = body;

    if (typeof body === "string") {
      var observed = body.match(/(?:g1\.|com\.google\.(?:one|gemini)\.)[a-z0-9._]{2,60}(?:acq|eft|90p|95p|99p|75p|subs_variant|student)/g) || [];
      out = body.replace(
        /(^|[^A-Za-z0-9._@%-])((?:g1\.|com\.google\.(?:one|gemini)\.)[A-Za-z0-9._-]+)(?=$|[^A-Za-z0-9._-])/g,
        function (match, before, id) {
          var isAnnual = isProSource(id);
          var to;
          var fallback = false;
          if (isAnnual) {
            to = target;
          } else if (Object.prototype.hasOwnProperty.call(ultraMap, id)) {
            to = ultraMap[id];
            if (ultraMode === "trial" && observed.indexOf(to) === -1 && FALLBACK[to] && observed.indexOf(FALLBACK[to]) !== -1) {
              to = FALLBACK[to];
              fallback = true;
            }
          } else {
            return match;
          }
          if (!mappings[id]) mappings[id] = { id: id, to: to, count: 0, fallback: fallback };
          mappings[id].count += 1;
          hits += 1;
          if (isAnnual) annualHits += 1;
          return before + to;
        }
      );
    }

    var sources = Object.keys(mappings).sort().map(function (id) {
      return mappings[id];
    });
    var record = {
      schemaVersion: 1,
      version: VERSION,
      updatedAt: new Date().toISOString(),
      sourcePrefix: SOURCE_PREFIX_LABEL,
      target: target,
      ultraMode: ultraMode,
      targetOrigin: "user-specified",
      hitCount: hits,
      annualHitCount: annualHits,
      matchedFrom: sources,
      status: typeof body !== "string" ? "non-text" : hits ? "rewritten" : "no-match"
    };
    writeState(ctx, SESSION_TEST_KEY, record);

    console.log("[g1-acq-proxypin] " + VERSION + " target=" + target + " ultra=" + ultraMode + " hits=" + hits + " annualHits=" + annualHits);
    sources.forEach(function (source) {
      console.log("[g1-acq-proxypin] " + source.id + " -> " + source.to + " x" + source.count +
        (source.fallback ? " fallback=" + source.to : ""));
    });

    if (hits > 0 && typeof out === "string") {
      response.body = out;
      if (!response.headers || typeof response.headers !== "object") {
        response.headers = {};
      }
      response.headers["X-G1-ACQ-ProxyPin"] = VERSION + "; target=" + target + "; ultra=" + ultraMode + "; hits=" + hits;
    }

    return response;
  }

  return {
    handleResponse: handleResponse
  };
})();

async function onRequest(context, request) {
  return request;
}

async function onResponse(context, request, response) {
  return G1AcqProxyPin.handleResponse(context, request, response);
}
