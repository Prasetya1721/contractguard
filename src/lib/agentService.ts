import type { AnalysisResult, RiskFlag } from '@/types';
import { CLAUSE_CATEGORY_LABELS, RISK_LEVEL_CONFIG } from '@/types';
import { sleep } from './utils';

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  suggestions?: string[];   // Quick reply suggestions
}

export interface AgentContext {
  analysis: AnalysisResult;
  conversationHistory: ChatMessage[];
}

// ─── Pengetahuan dasar Agent ─────────────────────────────────────────────────

const AGENT_PERSONA = `Kamu adalah ContractGuard AI Agent, asisten hukum cerdas yang membantu pengguna memahami risiko dalam kontrak mereka. 
Kamu berbicara dalam Bahasa Indonesia yang ramah, jelas, dan mudah dipahami oleh orang awam.
Kamu SELALU mengingatkan bahwa kamu bukan pengganti advokat berlisensi.
Jawaban kamu singkat, terstruktur, dan actionable.`;

// ─── Intent Detection ────────────────────────────────────────────────────────

type Intent =
  | 'greeting'
  | 'ask_summary'
  | 'ask_clause_detail'
  | 'ask_recommendation'
  | 'ask_risk_score'
  | 'ask_category'
  | 'ask_alternative_text'
  | 'ask_what_to_do'
  | 'ask_specific_keyword'
  | 'ask_safe_to_sign'
  | 'ask_negotiate'
  | 'ask_jurisdiction'
  | 'ask_penalty'
  | 'ask_indemnification'
  | 'ask_noncompete'
  | 'ask_force_majeure'
  | 'ask_termination'
  | 'ask_liability'
  | 'ask_payment'
  | 'ask_help'
  | 'general';

const INTENT_PATTERNS: Array<{ intent: Intent; patterns: RegExp[] }> = [
  { intent: 'greeting', patterns: [/^(halo|hai|hi|hello|selamat|pagi|siang|sore|malam)/i] },
  { intent: 'ask_summary', patterns: [/ringkasan|summary|kesimpulan|gambaran|overview|singkat/i] },
  { intent: 'ask_risk_score', patterns: [/skor|score|nilai risiko|berapa risiko|tingkat risiko|seberapa berbahaya/i] },
  { intent: 'ask_safe_to_sign', patterns: [/aman.*tanda\s*tangan|boleh.*tanda\s*tangan|bisa.*tanda\s*tangan|layak.*tanda\s*tangan|safe to sign|perlu.*khawatir/i] },
  { intent: 'ask_what_to_do', patterns: [/apa.*harus.*lakukan|langkah|tindakan|saran|rekomendasi|solusi|gimana|bagaimana.*selanjutnya/i] },
  { intent: 'ask_negotiate', patterns: [/negosiasi|negotiate|minta perubahan|revisi|minta ubah/i] },
  { intent: 'ask_alternative_text', patterns: [/contoh.*kalimat|alternatif.*teks|bahasa.*alternatif|redrafting|ubah.*kalimat|ganti.*dengan/i] },
  { intent: 'ask_clause_detail', patterns: [/klausul|pasal|bagian|klause|clause|penjelasan.*lebih|detail/i] },
  { intent: 'ask_recommendation', patterns: [/rekomendasi|saran|advice|tips|apa.*perlu/i] },
  { intent: 'ask_category', patterns: [/kategori|jenis risiko|tipe risiko/i] },
  { intent: 'ask_indemnification', patterns: [/indemn|ganti rugi|menanggung kerugian/i] },
  { intent: 'ask_penalty', patterns: [/denda|penalti|penalty|sanksi/i] },
  { intent: 'ask_noncompete', patterns: [/non.?compete|non.?disclosure|larangan bersaing|kerahasiaan|nda/i] },
  { intent: 'ask_force_majeure', patterns: [/force majeure|keadaan kahar|bencana/i] },
  { intent: 'ask_jurisdiction', patterns: [/yurisdiksi|hukum.*berlaku|pengadilan|arbitrase/i] },
  { intent: 'ask_termination', patterns: [/pengakhiran|terminasi|putus|terminate|berakhir/i] },
  { intent: 'ask_liability', patterns: [/tanggung jawab|liability|pertanggungjawaban|ganti rugi/i] },
  { intent: 'ask_payment', patterns: [/pembayaran|bayar|harga|biaya|fee|invoice/i] },
  { intent: 'ask_help', patterns: [/bantuan|help|bisa tanya|apa.*bisa.*tanya|fitur|kemampuan/i] },
];

function detectIntent(message: string): Intent {
  for (const { intent, patterns } of INTENT_PATTERNS) {
    if (patterns.some((p) => p.test(message))) return intent;
  }
  return 'general';
}

// ─── Context Builder ─────────────────────────────────────────────────────────

function buildContractContext(analysis: AnalysisResult): string {
  const flagsByCategory = analysis.riskFlags.reduce<Record<string, RiskFlag[]>>((acc, flag) => {
    const cat = flag.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(flag);
    return acc;
  }, {});

  const categoryLines = Object.entries(flagsByCategory)
    .map(([cat, flags]) => {
      const label = CLAUSE_CATEGORY_LABELS[cat as keyof typeof CLAUSE_CATEGORY_LABELS] ?? cat;
      const highest = flags.sort((a, b) => {
        const order = { critical: 4, high: 3, medium: 2, low: 1 };
        return order[b.riskLevel] - order[a.riskLevel];
      })[0];
      return `- ${label}: ${RISK_LEVEL_CONFIG[highest.riskLevel].label} (${flags.length} temuan)`;
    })
    .join('\n');

  return `
=== DATA KONTRAK ===
Nama dokumen: ${analysis.documentName}
Skor risiko: ${analysis.overallScore}/100 (${RISK_LEVEL_CONFIG[analysis.overallRiskLevel].label})
Total klausul dianalisis: ${analysis.totalClauses}
Klausul bermasalah: ${analysis.flaggedClauses}

Temuan per kategori:
${categoryLines || '- Tidak ada temuan risiko'}

Ringkasan: ${analysis.summary}
===================`;
}

// ─── Response Generator ───────────────────────────────────────────────────────

function generateResponse(
  intent: Intent,
  userMessage: string,
  analysis: AnalysisResult,
): { content: string; suggestions: string[] } {
  const score = analysis.overallScore;
  const riskLabel = RISK_LEVEL_CONFIG[analysis.overallRiskLevel].label;
  const flags = analysis.riskFlags;
  const criticalFlags = flags.filter((f) => f.riskLevel === 'critical');
  const highFlags = flags.filter((f) => f.riskLevel === 'high');
  const docName = analysis.documentName;

  switch (intent) {
    case 'greeting':
      return {
        content: `Halo! 👋 Saya **ContractGuard AI Agent**.\n\nSaya sudah membaca dan menganalisis dokumen **"${docName}"** Anda. Ada **${flags.length} klausul** yang perlu diperhatikan dengan skor risiko keseluruhan **${score}/100 (${riskLabel})**.\n\nAda yang ingin Anda tanyakan tentang kontrak ini?`,
        suggestions: ['Berikan ringkasan risiko', 'Klausul mana yang paling berbahaya?', 'Apakah aman untuk ditandatangani?'],
      };

    case 'ask_summary':
      return {
        content: buildSummaryResponse(analysis),
        suggestions: ['Apa yang harus saya lakukan?', 'Tunjukkan klausul paling berbahaya', 'Bagaimana cara negosiasi?'],
      };

    case 'ask_risk_score': {
      const interpretation =
        score <= 30
          ? 'relatif aman dengan risiko minimal'
          : score <= 60
          ? 'memiliki risiko sedang yang perlu perhatian sebelum tanda tangan'
          : score <= 80
          ? 'berisiko tinggi dan perlu negosiasi sebelum disetujui'
          : 'sangat berbahaya dan SANGAT disarankan untuk dikonsultasikan dengan pengacara';

      return {
        content: `📊 **Skor Risiko: ${score}/100 (${riskLabel})**\n\nKontrak ini ${interpretation}.\n\n**Breakdown:**\n- 🔴 Kritis: ${criticalFlags.length} klausul\n- 🟠 Tinggi: ${highFlags.length} klausul\n- 🟡 Sedang: ${flags.filter((f) => f.riskLevel === 'medium').length} klausul\n- 🟢 Rendah: ${flags.filter((f) => f.riskLevel === 'low').length} klausul`,
        suggestions: ['Klausul mana yang paling berbahaya?', 'Apa yang harus dilakukan?'],
      };
    }

    case 'ask_safe_to_sign': {
      if (score <= 30) {
        return {
          content: `✅ Berdasarkan analisis kami, kontrak ini **relatif aman** untuk ditandatangani (skor ${score}/100).\n\nTidak ada klausul yang sangat berisiko ditemukan. Namun tetap disarankan untuk membaca ulang seluruh kontrak dan konsultasikan hal-hal yang kurang jelas dengan pihak pemberi kontrak.\n\n⚠️ *Ini bukan nasihat hukum profesional.*`,
          suggestions: ['Ada rekomendasi tambahan?', 'Klausul apa yang perlu diperhatikan?'],
        };
      }
      if (criticalFlags.length > 0) {
        return {
          content: `⛔ **JANGAN tanda tangan dulu!**\n\nKontrak ini memiliki **${criticalFlags.length} klausul KRITIS** yang berpotensi merugikan Anda secara serius:\n\n${criticalFlags.map((f) => `• **${f.title}**: ${f.description.slice(0, 80)}...`).join('\n\n')}\n\n**Saran:** Minta pihak pemberi kontrak untuk merevisi klausul-klausul tersebut, atau konsultasikan dengan advokat sebelum tanda tangan.\n\n⚠️ *Ini bukan nasihat hukum profesional.*`,
          suggestions: ['Bagaimana cara negosiasi klausul ini?', 'Berikan contoh teks alternatif', 'Hubungi pengacara'],
        };
      }
      return {
        content: `⚠️ **Tunda dulu sebelum tanda tangan.**\n\nKontrak ini memiliki skor risiko **${score}/100 (${riskLabel})** dengan ${highFlags.length} klausul berisiko tinggi.\n\nDisarankan untuk:\n1. Negosiasikan klausul-klausul yang teridentifikasi berisiko\n2. Minta penjelasan tertulis dari pihak pemberi\n3. Konsultasikan dengan konsultan hukum jika nilai kontrak signifikan\n\n⚠️ *Ini bukan nasihat hukum profesional.*`,
          suggestions: ['Klausul mana yang perlu dinegosiasi?', 'Bagaimana cara negosiasi?'],
        };
    }

    case 'ask_what_to_do':
      return {
        content: buildActionPlan(analysis),
        suggestions: ['Contoh teks alternatif untuk klausul berbahaya', 'Bagaimana cara negosiasi?'],
      };

    case 'ask_negotiate':
      return {
        content: `💬 **Tips Negosiasi Kontrak:**\n\n**1. Identifikasi prioritas**\nFokus dulu pada klausul kritis & tinggi. Jangan perdebatkan hal minor dulu.\n\n**2. Siapkan alternatif**\nJangan hanya menolak, tawarkan bahasa pengganti yang seimbang. (Saya bisa bantu contohkan)\n\n**3. Dokumentasikan permintaan**\nAjukan revisi secara tertulis via email agar ada rekam jejak.\n\n**4. Batas waktu**\nMinta waktu yang wajar (3-7 hari) untuk review, jangan biarkan didesak.\n\n**5. Eskalasi jika perlu**\nJika klausul kritis tidak mau direvisi, pertimbangkan konsultasi pengacara atau tolak kontrak.\n\nKlausul mana yang ingin Anda negosiasikan?`,
        suggestions: ['Contoh teks alternatif untuk klausul indemnifikasi', 'Tips untuk klausul denda', 'Cara minta revisi non-compete'],
      };

    case 'ask_alternative_text': {
      const flagsWithAlt = flags.filter((f) => f.alternativeText);
      if (flagsWithAlt.length === 0) {
        return {
          content: `Maaf, saat ini tidak ada contoh teks alternatif yang tersedia untuk klausul yang ditemukan di kontrak ini. Saran saya, konsultasikan dengan advokat untuk mendapatkan redrafting yang tepat.`,
          suggestions: ['Apa saja klausul yang berisiko?', 'Bagaimana cara negosiasi?'],
        };
      }
      const examples = flagsWithAlt
        .slice(0, 3)
        .map((f) => `**${f.title}:**\n> *Alternatif:* "${f.alternativeText}"`)
        .join('\n\n');
      return {
        content: `📝 **Contoh Teks Alternatif untuk Klausul Berisiko:**\n\n${examples}\n\nTeks alternatif ini hanya sebagai referensi. Sesuaikan dengan konteks bisnis dan konsultasikan dengan pengacara.`,
        suggestions: ['Klausul lain yang perlu direvisi?', 'Cara menyampaikan revisi ke pihak lain?'],
      };
    }

    case 'ask_indemnification': {
      const relatedFlags = flags.filter((f) => f.category === 'indemnification');
      return buildCategoryResponse('Indemnifikasi (Ganti Rugi)', relatedFlags,
        'Klausul indemnifikasi mengatur siapa yang menanggung kerugian jika terjadi masalah. Klausul yang buruk bisa membuat Anda menanggung SEMUA kerugian termasuk yang bukan kesalahan Anda.');
    }

    case 'ask_penalty': {
      const relatedFlags = flags.filter((f) => f.category === 'penalty');
      return buildCategoryResponse('Penalti & Denda', relatedFlags,
        'Klausul denda mengatur sanksi finansial jika ada pelanggaran. Waspada terhadap denda yang berjalan harian tanpa batas maksimal.');
    }

    case 'ask_noncompete': {
      const relatedFlags = flags.filter((f) => f.category === 'non_compete' || f.category === 'confidentiality');
      return buildCategoryResponse('Non-Compete & Kerahasiaan', relatedFlags,
        'Klausul non-compete membatasi Anda bekerja di industri yang sama setelah kontrak berakhir. Pastikan durasinya wajar (6-12 bulan) dan cakupannya tidak terlalu luas.');
    }

    case 'ask_force_majeure': {
      const relatedFlags = flags.filter((f) => f.category === 'force_majeure');
      return buildCategoryResponse('Force Majeure (Keadaan Kahar)', relatedFlags,
        'Klausul force majeure melindungi kedua pihak dari kejadian di luar kendali seperti bencana alam atau pandemi. Pastikan klausul ini ada dan cukup komprehensif.');
    }

    case 'ask_jurisdiction': {
      const relatedFlags = flags.filter((f) => f.category === 'jurisdiction');
      return buildCategoryResponse('Yurisdiksi & Pilihan Hukum', relatedFlags,
        'Klausul yurisdiksi menentukan di mana dan hukum negara mana yang berlaku jika terjadi sengketa. Sangat penting agar Anda tidak dipaksa bersengketa di negara asing yang mahal.');
    }

    case 'ask_termination': {
      const relatedFlags = flags.filter((f) => f.category === 'unilateral_termination');
      return buildCategoryResponse('Pengakhiran Kontrak', relatedFlags,
        'Klausul pengakhiran mengatur kapan dan bagaimana kontrak bisa diakhiri. Waspada jika hanya satu pihak yang boleh mengakhiri kapan saja tanpa syarat.');
    }

    case 'ask_liability': {
      const relatedFlags = flags.filter((f) => f.category === 'liability_limitation');
      return buildCategoryResponse('Pembatasan Tanggung Jawab', relatedFlags,
        'Klausul ini membatasi berapa besar kerugian yang bisa diklaim. Pastikan batasannya adil dan tidak menghilangkan hak Anda sepenuhnya.');
    }

    case 'ask_payment': {
      const relatedFlags = flags.filter((f) => f.category === 'payment_terms');
      return buildCategoryResponse('Ketentuan Pembayaran', relatedFlags,
        'Klausul pembayaran mengatur harga, jadwal bayar, dan denda keterlambatan. Perhatikan klausul non-refundable dan hak mengubah harga sepihak.');
    }

    case 'ask_help':
      return {
        content: `🤖 **Saya bisa membantu Anda dengan:**\n\n• 📊 **Ringkasan risiko** — gambaran cepat dokumen\n• 🔍 **Detail per klausul** — penjelasan tiap temuan\n• ✅ **Layak tanda tangan?** — rekomendasi go/no-go\n• 💬 **Tips negosiasi** — cara minta revisi ke pihak lain\n• 📝 **Teks alternatif** — contoh kalimat yang lebih aman\n• 🏷️ **Penjelasan per kategori** — indemnifikasi, denda, yurisdiksi, dll.\n• 📋 **Rencana tindakan** — langkah konkret yang harus dilakukan\n\nApa yang ingin Anda tanyakan?`,
        suggestions: ['Ringkasan risiko kontrak ini', 'Apakah aman untuk ditandatangani?', 'Klausul mana yang paling berbahaya?'],
      };

    default:
      return buildGeneralResponse(userMessage, analysis);
  }
}

function buildSummaryResponse(analysis: AnalysisResult): string {
  const { riskFlags, overallScore, overallRiskLevel, documentName, totalClauses } = analysis;
  const riskLabel = RISK_LEVEL_CONFIG[overallRiskLevel].label;

  const topFlags = riskFlags
    .sort((a, b) => {
      const order = { critical: 4, high: 3, medium: 2, low: 1 };
      return order[b.riskLevel] - order[a.riskLevel];
    })
    .slice(0, 3);

  const flagList = topFlags.length > 0
    ? topFlags.map((f) => `• **${f.title}** (${RISK_LEVEL_CONFIG[f.riskLevel].label})`).join('\n')
    : '• Tidak ditemukan klausul berisiko signifikan';

  return `📋 **Ringkasan Risiko: "${documentName}"**\n\n🎯 **Skor Keseluruhan:** ${overallScore}/100 — **${riskLabel}**\n📄 **Klausul dianalisis:** ${totalClauses} | **Bermasalah:** ${riskFlags.length}\n\n**Temuan Utama:**\n${flagList}\n\n${analysis.summary}`;
}

function buildActionPlan(analysis: AnalysisResult): string {
  const criticalFlags = analysis.riskFlags.filter((f) => f.riskLevel === 'critical');
  const highFlags = analysis.riskFlags.filter((f) => f.riskLevel === 'high');
  const mediumFlags = analysis.riskFlags.filter((f) => f.riskLevel === 'medium');

  const steps: string[] = ['📋 **Rencana Tindakan yang Disarankan:**\n'];

  if (criticalFlags.length > 0) {
    steps.push(`**🔴 Langkah 1 — PRIORITAS TINGGI: Revisi Klausul Kritis**\nAda ${criticalFlags.length} klausul kritis yang HARUS dinegosiasikan sebelum tanda tangan:\n${criticalFlags.map((f) => `   • ${f.title}`).join('\n')}`);
  }

  if (highFlags.length > 0) {
    steps.push(`**🟠 Langkah ${criticalFlags.length > 0 ? 2 : 1} — Negosiasi Klausul Berisiko Tinggi**\nMinta revisi untuk ${highFlags.length} klausul berisiko tinggi:\n${highFlags.map((f) => `   • ${f.title}`).join('\n')}`);
  }

  if (mediumFlags.length > 0) {
    steps.push(`**🟡 Langkah Lanjutan — Klarifikasi Klausul Sedang**\nMinta penjelasan tertulis untuk ${mediumFlags.length} klausul yang perlu klarifikasi.`);
  }

  steps.push(`**📞 Langkah Akhir — Konsultasi Profesional**\nJika klausul kritis/tinggi tidak mau direvisi dan nilai kontrak signifikan, konsultasikan dengan advokat berlisensi sebelum memutuskan.`);

  steps.push(`\n⚠️ *Ini bukan nasihat hukum profesional.*`);

  return steps.join('\n\n');
}

function buildCategoryResponse(
  categoryName: string,
  relatedFlags: RiskFlag[],
  explanation: string,
): { content: string; suggestions: string[] } {
  if (relatedFlags.length === 0) {
    return {
      content: `✅ Tidak ditemukan masalah terkait **${categoryName}** dalam kontrak ini.\n\n${explanation}`,
      suggestions: ['Tunjukkan semua klausul bermasalah', 'Ringkasan risiko keseluruhan'],
    };
  }

  const details = relatedFlags
    .map(
      (f) =>
        `**${f.title}** (${RISK_LEVEL_CONFIG[f.riskLevel].label})\n> ${f.description}\n💡 *${f.recommendation}*`,
    )
    .join('\n\n');

  return {
    content: `🔍 **${categoryName}** — ${relatedFlags.length} temuan\n\n*Penjelasan singkat:* ${explanation}\n\n---\n${details}`,
    suggestions: ['Contoh teks alternatif', 'Cara negosiasi klausul ini', 'Lihat klausul kategori lain'],
  };
}

function buildGeneralResponse(
  userMessage: string,
  analysis: AnalysisResult,
): { content: string; suggestions: string[] } {
  // Coba cari keyword dari pesan yang cocok dengan judul flag
  const lowerMsg = userMessage.toLowerCase();
  const matchingFlag = analysis.riskFlags.find(
    (f) =>
      f.title.toLowerCase().split(' ').some((w) => w.length > 4 && lowerMsg.includes(w)) ||
      CLAUSE_CATEGORY_LABELS[f.category].toLowerCase().split(' ').some((w) => w.length > 4 && lowerMsg.includes(w)),
  );

  if (matchingFlag) {
    return {
      content: `🔍 **${matchingFlag.title}** (${RISK_LEVEL_CONFIG[matchingFlag.riskLevel].label})\n\n**Penjelasan:**\n${matchingFlag.description}\n\n**Rekomendasi:**\n${matchingFlag.recommendation}${matchingFlag.alternativeText ? `\n\n**Contoh teks alternatif:**\n> "${matchingFlag.alternativeText}"` : ''}`,
      suggestions: ['Klausul lain yang bermasalah?', 'Bagaimana cara negosiasi?', 'Apakah aman untuk ditandatangani?'],
    };
  }

  return {
    content: `Saya mencoba memahami pertanyaan Anda tentang kontrak **"${analysis.documentName}"**.\n\nBisakah Anda lebih spesifik? Misalnya:\n• Tanyakan tentang klausul tertentu (indemnifikasi, denda, dll.)\n• Tanya apakah kontrak ini aman\n• Minta rekomendasi langkah selanjutnya\n\nSaya siap membantu!`,
    suggestions: ['Ringkasan risiko kontrak ini', 'Apakah aman untuk ditandatangani?', 'Apa yang harus saya lakukan?'],
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function sendMessage(
  userMessage: string,
  context: AgentContext,
  onStream?: (chunk: string) => void,
): Promise<{ content: string; suggestions: string[] }> {
  // Simulasi thinking delay
  await sleep(600 + Math.random() * 800);

  const intent = detectIntent(userMessage);
  const { content, suggestions } = generateResponse(intent, userMessage, context.analysis);

  // Simulasi streaming effect
  if (onStream) {
    const words = content.split(' ');
    let streamed = '';
    for (const word of words) {
      streamed += (streamed ? ' ' : '') + word;
      onStream(streamed);
      await sleep(18);
    }
  }

  return { content, suggestions };
}

export function getWelcomeMessage(analysis: AnalysisResult): ChatMessage {
  const flagCount = analysis.riskFlags.length;
  const riskLabel = RISK_LEVEL_CONFIG[analysis.overallRiskLevel].label;
  const score = analysis.overallScore;

  const criticalCount = analysis.riskFlags.filter((f) => f.riskLevel === 'critical').length;
  const urgency = criticalCount > 0
    ? `⚠️ Ada **${criticalCount} klausul KRITIS** yang perlu perhatian segera.`
    : flagCount === 0
    ? '✅ Tidak ditemukan klausul berisiko signifikan.'
    : `Ditemukan **${flagCount} klausul bermasalah** yang perlu ditinjau.`;

  return {
    id: `welcome-${Date.now()}`,
    role: 'agent',
    content: `Halo! 👋 Saya **ContractGuard AI Agent**.\n\nSaya sudah menganalisis dokumen **"${analysis.documentName}"**:\n\n📊 **Skor Risiko:** ${score}/100 (${riskLabel})\n${urgency}\n\nSilakan tanya apa saja tentang kontrak ini — saya siap membantu Anda memahami setiap risiko dan langkah yang perlu diambil.`,
    timestamp: new Date(),
    suggestions: [
      'Berikan ringkasan risiko',
      'Apakah aman untuk ditandatangani?',
      'Apa yang harus saya lakukan?',
    ],
  };
}

export function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
}

// Re-export tipe agar bisa diimport dari sini
export type { Intent };
export { AGENT_PERSONA, buildContractContext };
