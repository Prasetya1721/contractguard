import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { AnalysisResult } from '@/types';
import { CLAUSE_CATEGORY_LABELS, RISK_LEVEL_CONFIG } from '@/types';
import { formatDate } from './utils';

export function generatePDFReport(result: AnalysisResult): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = margin;

  // ─── Header ─────────────────────────────────────────────────────────────────
  doc.setFillColor(30, 64, 175); // brand-800
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('ContractGuard', margin, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Legal Contract Risk Checker', margin, 26);
  doc.text(`Tanggal Analisis: ${formatDate(result.analysisDate)}`, margin, 33);

  y = 52;

  // ─── Judul Dokumen ───────────────────────────────────────────────────────────
  doc.setTextColor(31, 35, 40);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('LAPORAN ANALISIS RISIKO KONTRAK', margin, y);
  y += 8;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(87, 96, 106);
  const docName = doc.splitTextToSize(`Dokumen: ${result.documentName}`, pageWidth - margin * 2);
  doc.text(docName, margin, y);
  y += docName.length * 6 + 4;

  // ─── Risk Score Badge ────────────────────────────────────────────────────────
  const riskConfig = RISK_LEVEL_CONFIG[result.overallRiskLevel];
  const badgeColors: Record<string, [number, number, number]> = {
    low: [34, 197, 94],
    medium: [245, 158, 11],
    high: [239, 68, 68],
    critical: [124, 58, 237],
  };
  const [r, g, b] = badgeColors[result.overallRiskLevel];
  doc.setFillColor(r, g, b);
  doc.roundedRect(margin, y, 80, 20, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`RISIKO: ${riskConfig.label.toUpperCase()}`, margin + 5, y + 9);
  doc.setFontSize(11);
  doc.text(`Skor: ${result.overallScore}/100`, margin + 5, y + 16);
  y += 28;

  // ─── Statistik ───────────────────────────────────────────────────────────────
  doc.setTextColor(31, 35, 40);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const stats = [
    ['Total Klausul Dianalisis', String(result.totalClauses)],
    ['Klausul Bermasalah', String(result.flaggedClauses)],
    ['Waktu Proses', `${(result.processingTimeMs / 1000).toFixed(1)} detik`],
    ['Versi Model', result.modelVersion],
  ];
  autoTable(doc, {
    startY: y,
    head: [],
    body: stats,
    theme: 'striped',
    margin: { left: margin, right: margin },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 70 }, 1: { cellWidth: 80 } },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  // ─── Ringkasan ───────────────────────────────────────────────────────────────
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Ringkasan Eksekutif', margin, y);
  y += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(87, 96, 106);
  const summaryLines = doc.splitTextToSize(result.summary, pageWidth - margin * 2);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 5 + 8;

  // ─── Detail Klausul Berisiko ─────────────────────────────────────────────────
  if (result.riskFlags.length > 0) {
    doc.setTextColor(31, 35, 40);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Detail Klausul Berisiko', margin, y);
    y += 4;

    const tableBody = result.riskFlags.map((flag, i) => [
      String(i + 1),
      flag.title,
      CLAUSE_CATEGORY_LABELS[flag.category],
      RISK_LEVEL_CONFIG[flag.riskLevel].label,
      flag.description,
      flag.recommendation,
    ]);

    autoTable(doc, {
      startY: y,
      head: [['#', 'Temuan', 'Kategori', 'Risiko', 'Penjelasan', 'Rekomendasi']],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [30, 64, 175], textColor: 255, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 30, fontStyle: 'bold' },
        2: { cellWidth: 28 },
        3: { cellWidth: 20 },
        4: { cellWidth: 45 },
        5: { cellWidth: 45 },
      },
      margin: { left: margin, right: margin },
    });
  }

  // ─── Disclaimer ──────────────────────────────────────────────────────────────
  const finalY = doc.internal.pageSize.getHeight() - 30;
  doc.setFillColor(247, 248, 250);
  doc.rect(margin, finalY - 5, pageWidth - margin * 2, 28, 'F');
  doc.setTextColor(87, 96, 106);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  const disclaimer =
    'DISCLAIMER: Hasil analisis ini dihasilkan secara otomatis dan bersifat sebagai alat bantu awal (preliminary screening). Analisis ini BUKAN merupakan nasihat hukum dan tidak menggantikan konsultasi dengan advokat/konsultan hukum berlisensi. Pengguna disarankan untuk melakukan verifikasi lebih lanjut sebelum mengambil keputusan hukum apa pun.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - margin * 2 - 4);
  doc.text(disclaimerLines, margin + 2, finalY + 2);

  // Simpan
  const filename = `ContractGuard_Report_${result.documentName.replace(/\.[^/.]+$/, '')}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
