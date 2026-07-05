// Contract risk analysis types for ContractGuard

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type ClauseCategory =
  | 'indemnification'
  | 'penalty'
  | 'unilateral_termination'
  | 'non_compete'
  | 'force_majeure'
  | 'jurisdiction'
  | 'liability_limitation'
  | 'payment_terms'
  | 'confidentiality'
  | 'ip_ownership'
  | 'other';

export interface RiskFlag {
  id: string;
  category: ClauseCategory;
  riskLevel: RiskLevel;
  title: string;
  description: string;          // Penjelasan bahasa sederhana
  recommendation: string;       // Saran perbaikan
  originalText: string;         // Kutipan klausul asli
  alternativeText?: string;     // Alternatif bahasa yang lebih aman
  ruleSource: 'rule_engine' | 'ai' | 'combined';
}

export interface AnalysisResult {
  id: string;
  documentName: string;
  documentSize: number;
  analysisDate: Date;
  overallRiskLevel: RiskLevel;
  overallScore: number;          // 0-100 (0=aman, 100=sangat berisiko)
  totalClauses: number;
  flaggedClauses: number;
  riskFlags: RiskFlag[];
  summary: string;              // Ringkasan eksekutif
  processingTimeMs: number;
  modelVersion: string;
  rawText?: string;
}

export interface Document {
  id: string;
  name: string;
  size: number;
  type: 'pdf' | 'docx' | 'text';
  uploadDate: Date;
  status: 'pending' | 'processing' | 'completed' | 'error';
  analysisId?: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'team';
  analysisCount: number;
  analysisLimit: number;
  createdAt: Date;
}

export interface AnalysisHistory {
  items: AnalysisResult[];
  total: number;
  page: number;
  pageSize: number;
}

export interface RuleDefinition {
  id: string;
  category: ClauseCategory;
  riskLevel: RiskLevel;
  patterns: string[];           // Regex patterns to match
  keywords: string[];
  title: string;
  description: string;
  recommendation: string;
  alternativeText?: string;
}

export type UploadStatus =
  | { type: 'idle' }
  | { type: 'uploading'; progress: number }
  | { type: 'processing'; step: string }
  | { type: 'done'; result: AnalysisResult }
  | { type: 'error'; message: string };

export const RISK_LEVEL_CONFIG: Record<RiskLevel, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  score: [number, number]; // [min, max]
}> = {
  low: {
    label: 'Risiko Rendah',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: '✓',
    score: [0, 30],
  },
  medium: {
    label: 'Risiko Sedang',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: '⚠',
    score: [31, 60],
  },
  high: {
    label: 'Risiko Tinggi',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: '✕',
    score: [61, 80],
  },
  critical: {
    label: 'Risiko Kritis',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: '!',
    score: [81, 100],
  },
};

export const CLAUSE_CATEGORY_LABELS: Record<ClauseCategory, string> = {
  indemnification: 'Indemnifikasi',
  penalty: 'Penalti & Denda',
  unilateral_termination: 'Pengakhiran Sepihak',
  non_compete: 'Non-Compete / Non-Disclosure',
  force_majeure: 'Force Majeure',
  jurisdiction: 'Yurisdiksi & Pilihan Hukum',
  liability_limitation: 'Pembatasan Tanggung Jawab',
  payment_terms: 'Ketentuan Pembayaran',
  confidentiality: 'Kerahasiaan',
  ip_ownership: 'Kepemilikan Kekayaan Intelektual',
  other: 'Lainnya',
};
