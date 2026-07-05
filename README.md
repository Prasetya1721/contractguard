# ContractGuard 🛡️
**Legal Contract Risk Checker** — AI-powered platform untuk mengidentifikasi klausul berisiko dalam kontrak hukum.

---

## 🚀 Cara Menjalankan

```bash
# 1. Masuk ke folder project
cd ContractGuard

# 2. Install dependencies
npm install

# 3. Jalankan development server
npm run dev

# 4. Buka browser di http://localhost:5173
```

---

## 📁 Struktur Folder

```
ContractGuard/
├── public/
├── src/
│   ├── components/
│   │   ├── analysis/
│   │   │   ├── ClauseCard.tsx       # Kartu detail per klausul berisiko (collapsible)
│   │   │   └── RiskScoreCard.tsx    # Donut chart skor risiko keseluruhan
│   │   ├── layout/
│   │   │   └── Layout.tsx           # Shell app: sidebar + topbar + Outlet
│   │   └── ui/
│   │       ├── DisclaimerBanner.tsx # Banner disclaimer hukum wajib
│   │       ├── FileUploader.tsx     # Drag & drop file upload (PDF/DOCX/TXT)
│   │       └── ProgressBar.tsx      # Progress bar analisis dengan milestones
│   ├── lib/
│   │   ├── analyzer.ts              # Pipeline utama analisis kontrak
│   │   ├── documentParser.ts        # Ekstraksi teks PDF/DOCX + split klausul
│   │   ├── reportGenerator.ts       # Generate laporan PDF (jsPDF + autoTable)
│   │   ├── ruleEngine.ts            # Rule engine: 14 rules deteksi risiko
│   │   └── utils.ts                 # Helper: cn(), formatDate(), generateId(), dll.
│   ├── pages/
│   │   ├── AnalyzePage.tsx          # Upload / tempel teks + trigger analisis
│   │   ├── DashboardPage.tsx        # Halaman utama app (stats + recent history)
│   │   ├── HistoryPage.tsx          # Riwayat analisis + search + delete
│   │   ├── LandingPage.tsx          # Landing page publik + pricing
│   │   ├── LoginPage.tsx            # Login / Register + Demo login
│   │   └── ResultPage.tsx           # Hasil analisis lengkap + filter + export PDF
│   ├── store/
│   │   └── appStore.ts              # Zustand global state (auth, history, analysis)
│   ├── types/
│   │   └── index.ts                 # TypeScript types + constants (RiskLevel, etc.)
│   ├── App.tsx                      # Router (public + protected routes)
│   ├── main.tsx                     # React entry point + Toaster
│   └── index.css                    # Tailwind base + component classes
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🧠 Arsitektur Logic Inti

### Rule Engine (`src/lib/ruleEngine.ts`)
14 rules tervalidasi mencakup 7 kategori risiko utama dari PRD:

| Kategori | Rules | Level |
|----------|-------|-------|
| Indemnifikasi | IND-001, IND-002 | High, Critical |
| Penalti/Denda | PEN-001, PEN-002 | High, Medium |
| Pengakhiran Sepihak | TER-001 | High |
| Non-Compete/NDA | NCC-001, NDA-001 | High, Medium |
| Force Majeure | FM-001 | Medium |
| Yurisdiksi | JUR-001 | Medium |
| Pembatasan Liability | LIB-001, LIB-002 | High, Medium |
| Ketentuan Pembayaran | PAY-001, PAY-002 | Medium, Low |

### Pipeline Analisis (`src/lib/analyzer.ts`)
```
File/Text Input
    ↓
extractText()       → PDF.js / Mammoth / plain text
    ↓
splitIntoClauses()  → Regex-based clause segmentation
    ↓
runRuleEngine()     → Keyword + Pattern matching
    ↓
calculateOverallScore() → Weighted risk scoring (0-100)
    ↓
buildSummary()      → Ringkasan eksekutif Bahasa Indonesia
    ↓
AnalysisResult      → Disimpan di Zustand store + localStorage
```

---

## 📊 Skor Risiko

| Score | Level | Warna |
|-------|-------|-------|
| 0–30 | Rendah | Hijau |
| 31–60 | Sedang | Kuning |
| 61–80 | Tinggi | Merah |
| 81–100 | Kritis | Ungu |

---

## 🔧 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS 3 |
| State | Zustand (dengan localStorage persistence) |
| PDF Parsing | PDF.js (pdfjs-dist) |
| DOCX Parsing | Mammoth.js |
| PDF Export | jsPDF + jsPDF-autoTable |
| File Upload | React Dropzone |
| Routing | React Router v6 |
| Toast | React Hot Toast |
| Icons | Lucide React |

---

## 📋 MVP Checklist (sesuai PRD)

- [x] FR-01: Upload PDF & DOCX ≤ 20MB
- [x] FR-02: Ekstraksi teks (PDF.js + Mammoth)
- [x] FR-03: Parsing struktur klausul
- [x] FR-04: Klasifikasi risiko per klausul
- [x] FR-05: Skor risiko keseluruhan dan per klausul
- [x] FR-06: Penjelasan + rekomendasi bahasa natural
- [x] FR-07: Ekspor laporan PDF
- [x] FR-08: Riwayat analisis per pengguna
- [x] FR-11: Disclaimer hukum di setiap hasil analisis
- [x] FR-12: Penghapusan data pengguna (delete dari riwayat)

---

## 🔮 Roadmap Fase 2

- [ ] Kolaborasi tim (multi-user workspace)
- [ ] Dukungan multi-bahasa (EN/ID auto-detect)
- [ ] Integrasi API LLM nyata (OpenAI / Watsonx)
- [ ] OCR untuk dokumen scan
- [ ] Perbandingan versi kontrak
- [ ] Template checklist per industri

---

> ⚠️ **Disclaimer:** ContractGuard adalah alat bantu analisis otomatis dan BUKAN pengganti nasihat hukum profesional. Selalu konsultasikan dokumen hukum penting dengan advokat berlisensi.
