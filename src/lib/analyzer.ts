import type { AnalysisResult, RiskFlag, RiskLevel } from '@/types';
import { runRuleEngine, extractContext } from './ruleEngine';
import { extractText, splitIntoClauses } from './documentParser';
import { generateId, scoreToRiskLevel, sleep } from './utils';

export const MODEL_VERSION = '1.0.0-rule-engine';

/**
 * Pipeline utama analisis kontrak.
 * Menggabungkan rule engine + simulasi AI layer.
 */
export async function analyzeContract(
  file: File,
  onProgress?: (step: string, percent: number) => void,
): Promise<AnalysisResult> {
  const startTime = Date.now();

  // Step 1: Ekstrak teks
  onProgress?.('Mengekstrak teks dokumen...', 15);
  await sleep(300);
  const rawText = await extractText(file);

  if (!rawText || rawText.trim().length < 100) {
    throw new Error('Dokumen terlalu pendek atau tidak dapat dibaca. Pastikan dokumen memuat teks kontrak.');
  }

  // Step 2: Split klausul
  onProgress?.('Mengidentifikasi struktur klausul...', 35);
  await sleep(200);
  const clauses = splitIntoClauses(rawText);

  // Step 3: Jalankan rule engine
  onProgress?.('Menjalankan analisis rule-based...', 55);
  await sleep(400);
  const matchedRules = runRuleEngine(rawText);

  // Step 4: Buat RiskFlag dari setiap rule yang cocok
  onProgress?.('Menganalisis risiko dengan AI...', 75);
  await sleep(600);
  const riskFlags: RiskFlag[] = matchedRules.map((rule) => ({
    id: generateId(),
    category: rule.category,
    riskLevel: rule.riskLevel,
    title: rule.title,
    description: rule.description,
    recommendation: rule.recommendation,
    originalText: extractContext(rawText, rule.keywords) || rule.keywords[0],
    alternativeText: rule.alternativeText,
    ruleSource: 'combined' as const,
  }));

  // Step 5: Hitung skor risiko keseluruhan
  onProgress?.('Menyusun laporan hasil analisis...', 90);
  await sleep(200);
  const overallScore = calculateOverallScore(riskFlags);
  const overallRiskLevel = scoreToRiskLevel(overallScore);

  // Step 6: Buat ringkasan
  const summary = buildSummary(riskFlags, overallRiskLevel, clauses.length);

  onProgress?.('Analisis selesai!', 100);
  await sleep(200);

  return {
    id: generateId(),
    documentName: file.name,
    documentSize: file.size,
    analysisDate: new Date(),
    overallRiskLevel,
    overallScore,
    totalClauses: clauses.length,
    flaggedClauses: riskFlags.length,
    riskFlags,
    summary,
    processingTimeMs: Date.now() - startTime,
    modelVersion: MODEL_VERSION,
    rawText,
  };
}

/**
 * Analisis teks langsung (tanpa file upload)
 */
export async function analyzeText(
  text: string,
  filename = 'teks-kontrak.txt',
  onProgress?: (step: string, percent: number) => void,
): Promise<AnalysisResult> {
  const fakeFile = new File([text], filename, { type: 'text/plain' });
  return analyzeContract(fakeFile, onProgress);
}

/**
 * Hitung skor risiko keseluruhan berdasarkan flags yang ditemukan
 */
function calculateOverallScore(flags: RiskFlag[]): number {
  if (flags.length === 0) return 5;

  const weights: Record<RiskLevel, number> = {
    low: 10,
    medium: 20,
    high: 35,
    critical: 50,
  };

  const totalWeight = flags.reduce((sum, flag) => sum + weights[flag.riskLevel], 0);
  // Normalisasi: anggap 5 flags critical = skor 100
  const maxExpected = 250;
  return Math.min(100, Math.round((totalWeight / maxExpected) * 100));
}

/**
 * Buat ringkasan eksekutif dalam Bahasa Indonesia
 */
function buildSummary(flags: RiskFlag[], riskLevel: RiskLevel, totalClauses: number): string {
  const criticalCount = flags.filter((f) => f.riskLevel === 'critical').length;
  const highCount = flags.filter((f) => f.riskLevel === 'high').length;
  const mediumCount = flags.filter((f) => f.riskLevel === 'medium').length;
  const lowCount = flags.filter((f) => f.riskLevel === 'low').length;

  const riskLabels: Record<RiskLevel, string> = {
    low: 'RENDAH',
    medium: 'SEDANG',
    high: 'TINGGI',
    critical: 'KRITIS',
  };

  if (flags.length === 0) {
    return `Analisis terhadap ${totalClauses} klausul tidak menemukan indikator risiko yang signifikan. Dokumen ini tampak memiliki risiko rendah berdasarkan checklist standar kami. Namun, tetap disarankan untuk melakukan review dengan konsultan hukum untuk aspek spesifik bisnis Anda.`;
  }

  const parts: string[] = [
    `Analisis terhadap ${totalClauses} bagian/klausul menemukan ${flags.length} area yang perlu perhatian dengan tingkat risiko keseluruhan: ${riskLabels[riskLevel]}.`,
  ];

  if (criticalCount > 0) {
    parts.push(`⚠️ Terdapat ${criticalCount} klausul KRITIS yang sangat disarankan untuk dinegosiasikan sebelum tanda tangan.`);
  }
  if (highCount > 0) {
    parts.push(`${highCount} klausul berisiko TINGGI yang berpotensi merugikan secara signifikan.`);
  }
  if (mediumCount > 0) {
    parts.push(`${mediumCount} klausul berisiko SEDANG yang perlu diklarifikasi.`);
  }
  if (lowCount > 0) {
    parts.push(`${lowCount} klausul berisiko RENDAH sebagai catatan informasi.`);
  }

  parts.push('Lihat detail di bawah untuk penjelasan dan rekomendasi perbaikan per klausul.');

  return parts.join(' ');
}
