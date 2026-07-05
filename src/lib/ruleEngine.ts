import type { RuleDefinition } from '@/types';

/**
 * Rule Engine ContractGuard
 * Basis aturan untuk deteksi klausul berisiko dalam kontrak hukum Indonesia.
 * Setiap rule dibuat berdasarkan checklist hukum umum — harus divalidasi praktisi hukum.
 */
export const RISK_RULES: RuleDefinition[] = [
  // ─── INDEMNIFIKASI ──────────────────────────────────────────────────────────
  {
    id: 'IND-001',
    category: 'indemnification',
    riskLevel: 'high',
    keywords: ['ganti rugi', 'indemnifikasi', 'membebaskan', 'menanggung seluruh', 'sepenuhnya bertanggung jawab'],
    patterns: [
      'Pihak\\s+(Pertama|Kedua|Satu|Dua)\\s+.{0,50}(membebaskan|menanggung|melepaskan)\\s+.{0,50}(seluruh|semua|segala)\\s+(kerugian|klaim|tuntutan)',
      '(indemnify|indemnification|hold harmless|defend and indemnify)',
    ],
    title: 'Klausul Indemnifikasi Sepihak',
    description:
      'Klausul ini mengharuskan satu pihak menanggung seluruh kerugian atau tuntutan hukum yang mungkin timbul, tanpa batasan yang jelas atau tanpa kewajiban yang setara dari pihak lain. Ini sangat merugikan pihak yang menanggung.',
    recommendation:
      'Negosiasikan agar indemnifikasi bersifat mutual (timbal balik) atau dibatasi hanya untuk kerugian yang secara langsung disebabkan oleh kelalaian/pelanggaran pihak tersebut. Tambahkan cap/batas jumlah maksimal.',
    alternativeText:
      'Masing-masing Pihak akan mengganti kerugian kepada Pihak lainnya atas kerugian yang timbul secara langsung akibat pelanggaran perjanjian ini oleh Pihak yang bersangkutan, maksimal sebesar nilai kontrak.',
  },
  {
    id: 'IND-002',
    category: 'indemnification',
    riskLevel: 'critical',
    keywords: ['tanpa batas', 'tidak terbatas', 'unlimited liability', 'seluruh kerugian tidak langsung'],
    patterns: [
      '(tanpa\\s+batas|tidak\\s+terbatas|unlimited)\\s+.{0,30}(tanggung\\s+jawab|ganti\\s+rugi|liability)',
    ],
    title: 'Indemnifikasi Tanpa Batas (Unlimited)',
    description:
      'Klausul menetapkan kewajiban ganti rugi yang tidak memiliki batasan nilai (cap). Ini merupakan risiko finansial yang sangat serius dan dapat mengancam kelangsungan bisnis.',
    recommendation:
      'Selalu minta batasan nilai maksimal tanggung jawab (liability cap), misalnya maksimal senilai total pembayaran kontrak atau jumlah tertentu yang disepakati.',
    alternativeText:
      'Total tanggung jawab masing-masing Pihak berdasarkan Perjanjian ini tidak akan melebihi jumlah total yang telah dibayarkan dalam 12 (dua belas) bulan sebelum klaim timbul.',
  },

  // ─── PENALTI & DENDA ────────────────────────────────────────────────────────
  {
    id: 'PEN-001',
    category: 'penalty',
    riskLevel: 'high',
    keywords: ['denda', 'penalti', 'liquidated damages', 'denda keterlambatan', 'penalti per hari'],
    patterns: [
      'denda\\s+.{0,20}(per\\s+hari|per\\s+bulan|setiap\\s+hari|harian)',
      'penalti\\s+.{0,20}(\\d+\\s*%|persen)',
    ],
    title: 'Klausul Denda yang Memberatkan',
    description:
      'Kontrak memuat klausul denda atau penalti yang dapat memberatkan, terutama jika denda berjalan harian tanpa batas maksimal atau persentasenya terlalu besar.',
    recommendation:
      'Negosiasikan batas maksimal akumulasi denda (misalnya maks 10% dari nilai kontrak). Pastikan ada mekanisme pemberitahuan dan grace period sebelum denda berlaku.',
    alternativeText:
      'Denda keterlambatan sebesar 0,1% per hari dari nilai tagihan yang terlambat, dengan total maksimal denda tidak melebihi 5% (lima persen) dari nilai Perjanjian.',
  },
  {
    id: 'PEN-002',
    category: 'penalty',
    riskLevel: 'medium',
    keywords: ['pinalti pembatalan', 'biaya pembatalan', 'cancellation fee', 'terminasi dini'],
    patterns: [
      '(pembatalan|terminasi\\s+dini|early\\s+termination)\\s+.{0,40}(biaya|fee|denda|penalty)',
    ],
    title: 'Biaya Pembatalan Sepihak Tinggi',
    description:
      'Kontrak mencantumkan biaya pembatalan yang tinggi jika salah satu pihak mengakhiri perjanjian lebih awal, yang dapat menjebak pihak yang lebih lemah.',
    recommendation:
      'Klarifikasi kondisi di mana biaya pembatalan dapat diterapkan dan besarannya yang wajar. Pastikan hak pembatalan juga tersedia untuk kedua pihak dengan syarat yang setara.',
  },

  // ─── PENGAKHIRAN SEPIHAK ────────────────────────────────────────────────────
  {
    id: 'TER-001',
    category: 'unilateral_termination',
    riskLevel: 'high',
    keywords: ['mengakhiri sewaktu-waktu', 'mengakhiri kapan saja', 'terminate at will', 'tanpa pemberitahuan'],
    patterns: [
      '(mengakhiri|terminasi|putus)\\s+.{0,50}(sewaktu-waktu|kapan\\s+saja|tanpa\\s+pemberitahuan|without\\s+notice)',
      'Pihak\\s+(Pertama|Kedua)\\s+berhak\\s+mengakhiri\\s+.{0,30}tanpa\\s+alasan',
    ],
    title: 'Klausul Pengakhiran Sepihak Tanpa Syarat',
    description:
      'Satu pihak diberikan hak untuk mengakhiri kontrak kapan saja dan tanpa pemberitahuan atau alasan yang memadai. Ini sangat tidak seimbang dan berisiko bagi pihak lainnya.',
    recommendation:
      'Minta agar pengakhiran kontrak mensyaratkan pemberitahuan tertulis minimal 30-90 hari sebelumnya, dengan kompensasi yang wajar jika pengakhiran dilakukan tanpa alasan.',
    alternativeText:
      'Salah satu Pihak dapat mengakhiri Perjanjian ini dengan memberikan pemberitahuan tertulis minimal 30 (tiga puluh) hari sebelumnya kepada Pihak lainnya.',
  },

  // ─── NON-COMPETE / NON-DISCLOSURE ───────────────────────────────────────────
  {
    id: 'NCC-001',
    category: 'non_compete',
    riskLevel: 'high',
    keywords: ['non-compete', 'larangan bersaing', 'tidak boleh bekerja', 'tidak diperbolehkan bekerja pada'],
    patterns: [
      '(tidak\\s+(diperbolehkan|boleh|dapat)\\s+.{0,20}(bekerja|bergabung|terlibat)\\s+.{0,30}(pesaing|kompetitor|industri\\s+yang\\s+sama))',
      'non.?compete\\s+.{0,20}(\\d+\\s*(tahun|bulan)|periode)',
    ],
    title: 'Klausul Non-Compete yang Berlebihan',
    description:
      'Klausul melarang pihak (biasanya karyawan/kontraktor) untuk bekerja di bidang yang sama selama periode yang sangat panjang atau dengan cakupan yang terlalu luas, yang dapat membatasi mata pencaharian secara tidak wajar.',
    recommendation:
      'Non-compete yang wajar biasanya dibatasi 6-12 bulan, dengan cakupan geografis dan jabatan yang spesifik. Pastikan ada kompensasi selama periode non-compete berlaku.',
    alternativeText:
      'Selama 6 (enam) bulan setelah berakhirnya Perjanjian, Pihak Kedua tidak akan bergabung dengan [daftar pesaing spesifik] dalam kapasitas [jabatan spesifik] di wilayah [area spesifik].',
  },
  {
    id: 'NDA-001',
    category: 'non_compete',
    riskLevel: 'medium',
    keywords: ['rahasia dagang', 'informasi rahasia', 'confidential', 'tidak membocorkan', 'selamanya', 'selama-lamanya'],
    patterns: [
      '(kerahasiaan|confidentiality)\\s+.{0,50}(selama-lamanya|tanpa\\s+batas\\s+waktu|selamanya|perpetual)',
    ],
    title: 'Kewajiban Kerahasiaan Tanpa Batas Waktu',
    description:
      'Klausul kerahasiaan berlaku tanpa batas waktu (perpetual). Untuk informasi bisnis umum, ini tidak wajar karena informasi kehilangan nilai rahasianya seiring waktu.',
    recommendation:
      'Batasi kewajiban kerahasiaan 2-5 tahun pasca berakhirnya perjanjian, kecuali untuk kategori informasi yang benar-benar sensitif seperti trade secret yang secara eksplisit dikecualikan.',
  },

  // ─── FORCE MAJEURE ──────────────────────────────────────────────────────────
  {
    id: 'FM-001',
    category: 'force_majeure',
    riskLevel: 'medium',
    keywords: ['force majeure', 'keadaan kahar', 'di luar kendali'],
    patterns: [
      '(force\\s+majeure|keadaan\\s+kahar)\\s+.{0,100}(tidak\\s+(mencakup|termasuk|meliputi))',
      'tidak\\s+ada\\s+ketentuan\\s+.{0,30}(force\\s+majeure|keadaan\\s+kahar)',
    ],
    title: 'Klausul Force Majeure Tidak Jelas atau Tidak Ada',
    description:
      'Kontrak tidak memuat klausul force majeure yang memadai, atau klausulnya sangat sempit sehingga tidak mencakup kejadian seperti pandemi, bencana alam, atau gangguan supply chain.',
    recommendation:
      'Pastikan ada klausul force majeure yang komprehensif mencakup: bencana alam, perang, keputusan pemerintah, pandemi, dan kejadian di luar kendali wajar. Tambahkan mekanisme notifikasi dan prosedur penanganannya.',
    alternativeText:
      'Keadaan Kahar berarti setiap kejadian di luar kendali wajar Pihak, termasuk namun tidak terbatas pada: bencana alam, perang, wabah penyakit, atau kebijakan pemerintah yang berlaku.',
  },

  // ─── YURISDIKSI ─────────────────────────────────────────────────────────────
  {
    id: 'JUR-001',
    category: 'jurisdiction',
    riskLevel: 'medium',
    keywords: ['yurisdiksi eksklusif', 'hukum negara asing', 'arbitrase luar negeri', 'pengadilan asing'],
    patterns: [
      '(tunduk\\s+pada|governing\\s+law|hukum\\s+yang\\s+berlaku)\\s+.{0,30}(negara|hukum)\\s+(asing|[A-Z][a-z]+(?:\\s+[A-Z][a-z]+)*(?!\\s*Indonesia))',
      'arbitrase\\s+.{0,30}(singapura|singapore|hong\\s+kong|london|internasional)',
    ],
    title: 'Pilihan Hukum & Yurisdiksi yang Merugikan',
    description:
      'Kontrak menetapkan hukum negara asing atau arbitrase internasional di lokasi yang sangat jauh/mahal sebagai forum penyelesaian sengketa. Ini sangat memberatkan pihak Indonesia yang lebih kecil.',
    recommendation:
      'Negosiasikan agar sengketa diselesaikan berdasarkan hukum Indonesia di Pengadilan Negeri setempat atau BANI (Badan Arbitrase Nasional Indonesia) jika memilih arbitrase.',
    alternativeText:
      'Perjanjian ini tunduk pada dan ditafsirkan sesuai Hukum Indonesia. Setiap sengketa diselesaikan melalui Pengadilan Negeri Jakarta Selatan atau melalui BANI.',
  },

  // ─── PEMBATASAN TANGGUNG JAWAB ──────────────────────────────────────────────
  {
    id: 'LIB-001',
    category: 'liability_limitation',
    riskLevel: 'high',
    keywords: ['melepaskan tanggung jawab', 'tidak bertanggung jawab atas', 'as is', 'tanpa jaminan', 'without warranty'],
    patterns: [
      '(melepaskan|tidak\\s+bertanggung\\s+jawab|disclaim|waive)\\s+.{0,50}(tanggung\\s+jawab|liability|kewajiban)\\s+.{0,30}(atas|for|terhadap)',
      '(as.is|without\\s+warranty|tanpa\\s+jaminan)\\s+.{0,50}(kualitas|condition|kondisi)',
    ],
    title: 'Pembatasan Tanggung Jawab yang Tidak Seimbang',
    description:
      'Satu pihak (biasanya vendor/penyedia jasa) secara sepihak melepaskan seluruh tanggung jawab atas kualitas, kerugian, atau kerusakan yang ditimbulkan. Pihak lain tidak mendapat perlindungan yang layak.',
    recommendation:
      'Pastikan ada jaminan minimum atas kualitas layanan/produk. Batasan tanggung jawab harus simetris dan tidak meniadakan tanggung jawab atas kelalaian serius atau kesengajaan.',
  },
  {
    id: 'LIB-002',
    category: 'liability_limitation',
    riskLevel: 'medium',
    keywords: ['consequential damages', 'kerugian tidak langsung', 'indirect loss', 'kehilangan keuntungan'],
    patterns: [
      '(tidak\\s+bertanggung\\s+jawab|tidak\\s+menanggung)\\s+.{0,50}(kerugian\\s+(tidak\\s+langsung|konsekuensial)|kehilangan\\s+keuntungan|loss\\s+of\\s+profit)',
    ],
    title: 'Pengecualian Kerugian Tidak Langsung',
    description:
      'Kontrak mengecualikan tanggung jawab atas kerugian tidak langsung (consequential damages) termasuk kehilangan keuntungan. Ini standar dalam banyak kontrak B2B, namun perlu dievaluasi konteksnya.',
    recommendation:
      'Evaluasi apakah pengecualian ini wajar untuk konteks bisnis Anda. Untuk kontrak yang kegagalannya dapat menyebabkan kehilangan pendapatan signifikan, negosiasikan agar kerugian langsung tetap dapat diklaim.',
  },

  // ─── KETENTUAN PEMBAYARAN ────────────────────────────────────────────────────
  {
    id: 'PAY-001',
    category: 'payment_terms',
    riskLevel: 'medium',
    keywords: ['pembayaran di muka', 'down payment', 'uang muka', 'non-refundable', 'tidak dapat dikembalikan'],
    patterns: [
      '(pembayaran|uang\\s+muka|down\\s+payment)\\s+.{0,30}(tidak\\s+dapat\\s+dikembalikan|non.?refundable)',
    ],
    title: 'Pembayaran Non-Refundable Tanpa Kondisi Jelas',
    description:
      'Pembayaran di muka dinyatakan tidak dapat dikembalikan tanpa ketentuan yang jelas mengenai kondisi pengecualiannya, seperti jika pihak penerima gagal memenuhi kewajibannya.',
    recommendation:
      'Pastikan klausul non-refundable memiliki pengecualian yang jelas, misalnya: pembayaran dapat dikembalikan jika pihak penerima gagal menyerahkan barang/jasa sesuai spesifikasi.',
  },
  {
    id: 'PAY-002',
    category: 'payment_terms',
    riskLevel: 'low',
    keywords: ['harga dapat berubah', 'penyesuaian harga', 'price adjustment', 'eskalasi harga'],
    patterns: [
      '(harga|biaya|fee)\\s+.{0,30}(dapat\\s+berubah|sewaktu-waktu\\s+dapat\\s+disesuaikan|berhak\\s+mengubah)',
    ],
    title: 'Klausul Perubahan Harga Sepihak',
    description:
      'Satu pihak berhak mengubah harga sewaktu-waktu tanpa persetujuan pihak lain. Ini dapat menyebabkan peningkatan biaya yang tidak terduga.',
    recommendation:
      'Minta agar perubahan harga disertai pemberitahuan minimal 30-60 hari sebelumnya dan pihak lain berhak mengakhiri kontrak jika tidak menyetujui perubahan tersebut.',
  },
];

/**
 * Analisis kontrak menggunakan rule engine.
 * Mencocokkan teks dengan rules yang telah didefinisikan.
 */
export function runRuleEngine(text: string): typeof RISK_RULES[number][] {
  const normalizedText = text.toLowerCase();
  const matchedRules: typeof RISK_RULES[number][] = [];

  for (const rule of RISK_RULES) {
    let matched = false;

    // Check keywords (case-insensitive)
    for (const keyword of rule.keywords) {
      if (normalizedText.includes(keyword.toLowerCase())) {
        matched = true;
        break;
      }
    }

    // Check regex patterns if not yet matched
    if (!matched) {
      for (const pattern of rule.patterns) {
        try {
          const regex = new RegExp(pattern, 'gi');
          if (regex.test(text)) {
            matched = true;
            break;
          }
        } catch {
          // Invalid regex — skip
        }
      }
    }

    if (matched) {
      matchedRules.push(rule);
    }
  }

  return matchedRules;
}

/**
 * Ekstrak kutipan konteks seputar keyword yang terdeteksi.
 */
export function extractContext(text: string, keywords: string[], contextChars = 200): string {
  const normalizedText = text.toLowerCase();
  for (const keyword of keywords) {
    const idx = normalizedText.indexOf(keyword.toLowerCase());
    if (idx !== -1) {
      const start = Math.max(0, idx - contextChars);
      const end = Math.min(text.length, idx + keyword.length + contextChars);
      let excerpt = text.substring(start, end).trim();
      if (start > 0) excerpt = `...${excerpt}`;
      if (end < text.length) excerpt = `${excerpt}...`;
      return excerpt;
    }
  }
  return '';
}
