import { Link } from 'react-router-dom';
import { Shield, Zap, FileText, BarChart3, Download, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

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
  const { t } = useTranslation();
  const FEATURES = [
    { icon: Zap,           title: t.landing.features.instant.title,        desc: t.landing.features.instant.desc },
    { icon: BarChart3,     title: t.landing.features.score.title,          desc: t.landing.features.score.desc },
    { icon: FileText,      title: t.landing.features.recommendation.title, desc: t.landing.features.recommendation.desc },
    { icon: Download,      title: t.landing.features.export.title,         desc: t.landing.features.export.desc },
    { icon: Lock,          title: t.landing.features.security.title,       desc: t.landing.features.security.desc },
    { icon: CheckCircle,   title: t.landing.features.rules.title,          desc: t.landing.features.rules.desc },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* ── Navbar ────────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-200 dark:border-gray-700/60">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 bg-brand-600 rounded-lg">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-lg">{t.common.appName}</span>
          </div>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <LanguageSwitcher />
            <Link to="/login" className="btn-secondary text-sm py-2">
              {t.auth.login}
            </Link>
            <Link to="/login?mode=register" className="btn-primary text-sm py-2">
              {t.landing.heroCta}
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-700 rounded-full text-sm text-brand-700 dark:text-brand-300 font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          {t.landing.heroBadge}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
          {t.landing.heroTitle}
          <br />
          <span className="text-brand-600 dark:text-brand-400">{t.landing.heroTitleHighlight}</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          {t.landing.heroSubtitle}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/login?mode=register" className="btn-primary px-6 py-3 text-base gap-2">
            {t.landing.heroCta}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/login" className="btn-secondary px-6 py-3 text-base">
            {t.landing.heroDemo}
          </Link>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">{t.landing.heroFreeNote}</p>
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {['NDA', 'Employment', 'Lease', 'Sales', 'Vendor', 'Partnership', 'Freelance', 'SLA'].map((type) => (
            <span key={type} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm">
              {type}
            </span>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-3">{t.landing.featuresTitle}</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-xl mx-auto">{t.landing.featuresSubtitle}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-5">
                <div className="w-10 h-10 bg-brand-50 dark:bg-brand-900/30 rounded-lg flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-10">{t.landing.howItWorksTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {t.landing.steps.map(({ title, desc }, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 bg-brand-600 text-white rounded-xl flex items-center justify-center text-xl font-bold mx-auto mb-3">
                {i + 1}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5">{title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-10">{t.landing.pricingTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.landing.plans.map(({ name, price, desc, features }, i) => {
              const highlight = i === 1;
              return (
              <div key={name} className={`card p-6 ${highlight ? 'border-brand-400 ring-2 ring-brand-200 dark:ring-brand-700' : ''}`}>
                {highlight && (
                  <span className="inline-block bg-brand-600 text-white text-xs font-bold px-2.5 py-1 rounded-full mb-3">
                    {t.landing.mostPopular}
                  </span>
                )}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{name}</h3>
                <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 my-2">{price}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{desc}</p>
                <ul className="space-y-2 mb-6">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/login?mode=register" className={highlight ? 'btn-primary w-full justify-center' : 'btn-secondary w-full justify-center'}>
                  {t.landing.startNow}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-200 dark:border-gray-700/60 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span className="font-bold text-gray-800 dark:text-gray-200">{t.common.appName}</span>
            <span className="text-gray-400 text-sm">· {t.common.tagline}</span>
          </div>
          <p className="text-sm text-gray-500">© 2026 {t.common.appName}. {t.landing.footerNote}</p>
        </div>
      </footer>
    </div>
  );
}
