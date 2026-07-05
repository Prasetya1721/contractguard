import { Link } from 'react-router-dom';
import { Upload, FileText, BarChart3, ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { formatDateShort } from '@/lib/utils';
import { RISK_LEVEL_CONFIG } from '@/types';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user, history } = useAppStore();
  const recentItems = history.slice(0, 5);

  const stats = {
    total: history.length,
    high: history.filter((h) => h.overallRiskLevel === 'high' || h.overallRiskLevel === 'critical').length,
    safe: history.filter((h) => h.overallRiskLevel === 'low').length,
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Selamat datang, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Mulai review kontrak atau lihat riwayat analisis Anda.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Dianalisis', value: stats.total, icon: FileText, color: 'text-brand-600', bg: 'bg-brand-50' },
          { label: 'Risiko Tinggi/Kritis', value: stats.high, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Risiko Rendah', value: stats.safe, icon: BarChart3, color: 'text-green-600', bg: 'bg-green-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', bg)}>
              <Icon className={cn('w-5 h-5', color)} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="card p-6 bg-gradient-to-br from-brand-600 to-brand-800 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold mb-1">Analisis Kontrak Baru</h2>
            <p className="text-brand-200 text-sm max-w-md">
              Upload dokumen kontrak Anda (PDF/DOCX) atau tempel teks langsung untuk mendapatkan analisis risiko instan.
            </p>
            {user?.plan === 'free' && (
              <p className="text-brand-300 text-xs mt-2">
                {user.analysisLimit - user.analysisCount} analisis tersisa bulan ini (paket Free)
              </p>
            )}
          </div>
          <Link
            to="/app/analyze"
            className="shrink-0 flex items-center gap-2 bg-white text-brand-700 font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-brand-50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Mulai Analisis
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Recent history */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            Analisis Terbaru
          </h2>
          {history.length > 0 && (
            <Link to="/app/history" className="text-sm text-brand-600 hover:underline">
              Lihat semua
            </Link>
          )}
        </div>

        {recentItems.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FileText className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium mb-1">Belum Ada Analisis</p>
            <p className="text-sm text-gray-500 mb-4">Upload kontrak pertama Anda untuk memulai.</p>
            <Link to="/app/analyze" className="btn-primary">
              <Upload className="w-4 h-4" />
              Analisis Sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentItems.map((item) => {
              const config = RISK_LEVEL_CONFIG[item.overallRiskLevel];
              return (
                <Link
                  key={item.id}
                  to={`/app/result/${item.id}`}
                  className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', config.bgColor)}>
                    <FileText className={cn('w-5 h-5', config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.documentName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatDateShort(new Date(item.analysisDate))} · {item.flaggedClauses} klausul bermasalah
                    </p>
                  </div>
                  <span className={cn('badge hidden sm:flex shrink-0', `badge-${item.overallRiskLevel}`)}>
                    {config.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
