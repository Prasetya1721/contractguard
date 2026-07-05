import { Link } from 'react-router-dom';
import { Shield, Zap, FileText, BarChart3, Download, Lock, CheckCircle, ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    icon: Zap,
    title: 'Analisis Instan',
    desc: 'Upload kontrak PDF/DOCX dan dapatkan hasil analisis risiko dalam hitungan detik.',
  },
  {
    icon: BarChart3,
    title: 'Skor Risiko Visual',
    desc: 'Skor risiko keseluruhan dan per klausul dengan visualisasi yang mudah dipahami.',
  },
  {
    icon: FileText,
    title: 'Rekomendasi Konkret',
    desc: 'Setiap klausul berisiko dilengkapi penjelasan dan contoh bahasa alternatif yang lebih aman.',
  },
  {
    icon: Download,
    title: 'Ekspor Laporan PDF',
    desc: 'Unduh laporan hasil analisis lengkap dalam format PDF untuk dibagikan ke tim atau pengacara.',
  },
  {
    icon: Lock,
    title: 'Keamanan Data',
    desc: 'Dokumen Anda diproses dengan enkripsi end-to-end dan tidak disimpan permanen tanpa izin.',
  },
  {
    icon: CheckCircle,
    title: 'Rule Engine Tervalidasi',
    desc: 'Basis aturan hukum yang dikurasi dari checklist klausul berisiko yang umum di Indonesia.',
  },
];

const CONTRACT_TYPES = [
  'Perjanjian Kerja', 'NDA', 'Perjanjian Sewa', 'Perjanjian Jual-Beli',
  'Kontrak Vendor', 'Perjanjian Kemitraan', 'Kontrak Freelance', 'SLA',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Navbar ────────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 bg-brand-600 rounded-lg">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">ContractGuard</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary text-sm py-2">
              Masuk
            </Link>
            <Link to="/login?mode=register" className="btn-primary text-sm py-2">
              Mulai Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-50 border border-brand-200 rounded-full text-sm text-brand-700 font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          AI-Powered Legal Risk Analysis
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          Identifikasi Klausul Berisiko
          <br />
          <span className="text-brand-600">Sebelum Tanda Tangan</span>
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          ContractGuard menganalisis kontrak hukum Anda secara otomatis — menemukan klausul indemnifikasi
          sepihak, denda tidak wajar, non-compete berlebihan, dan risiko lainnya dalam hitungan menit.
          Bukan pengganti pengacara, tapi sahabat review kontrak Anda.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/login?mode=register" className="btn-primary px-6 py-3 text-base gap-2">
            Coba Gratis Sekarang
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/login" className="btn-secondary px-6 py-3 text-base">
            Lihat Demo
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-4">Gratis untuk 3 analisis/bulan • Tidak perlu kartu kredit</p>

        {/* Tipe kontrak */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {CONTRACT_TYPES.map((type) => (
            <span key={type} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm">
              {type}
            </span>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
            Semua yang Anda Butuhkan untuk Review Kontrak
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-xl mx-auto">
            Dari upload dokumen hingga laporan lengkap — selesai dalam satu platform.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-5">
                <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-brand-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Cara Kerja ContractGuard</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Upload Kontrak', desc: 'Unggah file PDF atau DOCX, atau tempel teks kontrak langsung.' },
            { step: '2', title: 'Analisis Otomatis', desc: 'Sistem memecah klausul dan menjalankan rule engine + AI analysis.' },
            { step: '3', title: 'Lihat Hasil', desc: 'Dapatkan skor risiko, daftar klausul bermasalah, dan rekomendasi.' },
            { step: '4', title: 'Ekspor & Bagikan', desc: 'Unduh laporan PDF untuk dikirim ke pengacara atau tim Anda.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="w-12 h-12 bg-brand-600 text-white rounded-xl flex items-center justify-center text-xl font-bold mx-auto mb-3">
                {step}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1.5">{title}</h3>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Harga Transparan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { plan: 'Free', price: 'Gratis', desc: '2-3 analisis/bulan', features: ['Upload PDF/DOCX', 'Skor risiko dasar', 'Rekomendasi per klausul', 'Riwayat 7 hari'], highlight: false },
              { plan: 'Pro', price: 'Rp 99.000/bln', desc: 'Untuk freelancer & UMKM', features: ['Analisis tidak terbatas', 'Ekspor laporan PDF', 'Riwayat lengkap', 'Prioritas proses'], highlight: true },
              { plan: 'Team', price: 'Rp 299.000/bln', desc: 'Untuk tim & perusahaan', features: ['Semua fitur Pro', 'Kolaborasi tim', 'Dashboard admin', 'API akses', 'Dukungan prioritas'], highlight: false },
            ].map(({ plan, price, desc, features, highlight }) => (
              <div
                key={plan}
                className={`card p-6 ${highlight ? 'border-brand-400 ring-2 ring-brand-200' : ''}`}
              >
                {highlight && (
                  <span className="inline-block bg-brand-600 text-white text-xs font-bold px-2.5 py-1 rounded-full mb-3">
                    Paling Populer
                  </span>
                )}
                <h3 className="text-lg font-bold text-gray-900">{plan}</h3>
                <p className="text-2xl font-extrabold text-brand-600 my-2">{price}</p>
                <p className="text-sm text-gray-500 mb-4">{desc}</p>
                <ul className="space-y-2 mb-6">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/login?mode=register"
                  className={highlight ? 'btn-primary w-full justify-center' : 'btn-secondary w-full justify-center'}
                >
                  Mulai Sekarang
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-600" />
            <span className="font-bold text-gray-800">ContractGuard</span>
            <span className="text-gray-400 text-sm">· Legal Contract Risk Checker</span>
          </div>
          <p className="text-sm text-gray-500">
            © 2026 ContractGuard. Bukan pengganti nasihat hukum profesional.
          </p>
        </div>
      </footer>
    </div>
  );
}
