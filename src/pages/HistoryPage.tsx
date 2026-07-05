import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, FileText, ArrowRight, Search, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { formatDateShort, formatFileSize, cn } from '@/lib/utils';
import { RISK_LEVEL_CONFIG } from '@/types';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const { history, removeFromHistory, clearHistory } = useAppStore();
  const [search, setSearch] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const filtered = history.filter((item) =>
    item.documentName.toLowerCase().includes(search.toLowerCase()),
  );

  const handleRemove = (id: string, name: string) => {
    removeFromHistory(id);
    toast.success(`"${name}" dihapus dari riwayat.`);
  };

  const handleClearAll = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    clearHistory();
    setConfirmClear(false);
    toast.success('Semua riwayat berhasil dihapus.');
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Analisis</h1>
          <p className="text-gray-500 text-sm mt-1">
            {history.length} kontrak pernah dianalisis
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className={cn(
              'btn text-sm',
              confirmClear ? 'btn-danger' : 'btn-ghost text-red-500 hover:bg-red-50',
            )}
          >
            <Trash2 className="w-4 h-4" />
            {confirmClear ? 'Klik lagi untuk konfirmasi' : 'Hapus Semua'}
          </button>
        )}
      </div>

      {/* Search */}
      {history.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            className="input pl-10"
            placeholder="Cari nama dokumen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* List */}
      {history.length === 0 ? (
        <div className="card p-10 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium mb-1">Belum Ada Riwayat</p>
          <p className="text-sm text-gray-500 mb-4">Mulai analisis kontrak untuk melihat riwayat di sini.</p>
          <Link to="/app/analyze" className="btn-primary">
            Analisis Kontrak Baru
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-8 text-center">
          <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Tidak ditemukan dokumen dengan kata kunci "{search}".</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const config = RISK_LEVEL_CONFIG[item.overallRiskLevel];
            return (
              <div key={item.id} className="card p-4 flex items-center gap-4 group">
                {/* Icon */}
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', config.bgColor)}>
                  <FileText className={cn('w-5 h-5', config.color)} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.documentName}</p>
                  <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                    <span>{formatDateShort(new Date(item.analysisDate))}</span>
                    <span>·</span>
                    <span>{formatFileSize(item.documentSize)}</span>
                    <span>·</span>
                    <span>{item.flaggedClauses} klausul bermasalah</span>
                  </div>
                </div>

                {/* Risk badge */}
                <span className={cn('badge hidden sm:flex shrink-0', `badge-${item.overallRiskLevel}`)}>
                  {config.label}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    to={`/app/result/${item.id}`}
                    className="p-2 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                    title="Lihat detail"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleRemove(item.id, item.documentName)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Hapus dari riwayat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
