# Panduan Push ContractGuard ke GitHub

## Prasyarat
- Git sudah terinstall di komputer Anda
- Sudah login ke GitHub (atau sudah setup SSH key / Personal Access Token)

## Langkah 1 — Buat repo di GitHub
1. Buka https://github.com/new
2. Repository name: `contractguard`
3. Description: Legal Contract Risk Checker — AI-powered contract analysis
4. Visibility: Public / Private (bebas)
5. ⚠️ JANGAN centang "Initialize this repository with a README"
6. Klik "Create repository"
7. Salin URL remote, contoh: https://github.com/namaanda/contractguard.git

## Langkah 2 — Jalankan perintah berikut di terminal

# Masuk ke folder ContractGuard
cd ContractGuard

# Init git repo
git init

# Tambahkan semua file
git add .

# Commit pertama
git commit -m "feat: initial ContractGuard MVP setup

- React 18 + TypeScript + Vite + Tailwind CSS
- Rule engine: 14 rules deteksi klausul berisiko (7 kategori)
- PDF/DOCX parser (PDF.js + Mammoth)
- Skor risiko + export laporan PDF (jsPDF)
- Zustand state management dengan localStorage persist
- Halaman: Landing, Login, Dashboard, Analyze, Result, History
- Berdasarkan PRD Legal Contract Risk Checker v1.0"

# Set branch utama ke main
git branch -M main

# Tambahkan remote (ganti URL dengan milik Anda)
git remote add origin https://github.com/NAMAANDA/contractguard.git

# Push ke GitHub
git push -u origin main
