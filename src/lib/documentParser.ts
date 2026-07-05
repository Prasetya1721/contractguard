import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Setup PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

/**
 * Ekstrak teks dari file PDF menggunakan PDF.js
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const textPages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .filter((item): item is pdfjsLib.TextItem => 'str' in item)
      .map((item) => item.str)
      .join(' ');
    textPages.push(pageText);
  }

  return textPages.join('\n\n');
}

/**
 * Ekstrak teks dari file DOCX menggunakan Mammoth
 */
export async function extractTextFromDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

/**
 * Router utama ekstraksi teks berdasarkan tipe file
 */
export async function extractText(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (file.type === 'application/pdf' || ext === 'pdf') {
    return extractTextFromPDF(file);
  }

  if (
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    ext === 'docx'
  ) {
    return extractTextFromDOCX(file);
  }

  if (file.type === 'text/plain' || ext === 'txt') {
    return file.text();
  }

  throw new Error(`Format file tidak didukung: ${file.type || ext}. Gunakan PDF, DOCX, atau TXT.`);
}

/**
 * Pecah teks menjadi klausul/paragraf terstruktur
 */
export function splitIntoClauses(text: string): string[] {
  // Pola umum penomoran klausul dalam kontrak Indonesia/Inggris
  const clausePatterns = [
    /(?:Pasal|Klausul|Bagian|BAB|PASAL|KLAUSUL|Article|Section|Clause)\s+\d+[.:)]/gi,
    /^\d+\.\d*\s+[A-Z]/gm,
    /^\([a-z]\)\s/gm,
  ];

  let clauses: string[] = [];

  // Coba split berdasarkan pola penomoran klausul
  for (const pattern of clausePatterns) {
    const parts = text.split(pattern);
    if (parts.length > 3) {
      clauses = parts.filter((p) => p.trim().length > 50);
      break;
    }
  }

  // Fallback: split berdasarkan paragraf
  if (clauses.length === 0) {
    clauses = text
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter((p) => p.length > 50);
  }

  return clauses;
}

/**
 * Validasi file sebelum upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 20 * 1024 * 1024; // 20MB
  const ALLOWED_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];
  const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'txt'];

  if (file.size > MAX_SIZE) {
    return { valid: false, error: `Ukuran file melebihi batas 20MB (saat ini: ${(file.size / 1024 / 1024).toFixed(1)}MB)` };
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: 'Format file tidak didukung. Gunakan PDF, DOCX, atau TXT.' };
  }

  return { valid: true };
}
