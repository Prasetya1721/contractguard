import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Clock, Cpu, Filter, Bot, MessageCircle } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useTranslation } from '@/hooks/useTranslation';
import { useAgent } from '@/hooks/useAgent';
import RiskScoreCard from '@/components/analysis/RiskScoreCard';
import ClauseCard from '@/components/analysis/ClauseCard';
import DisclaimerBanner from '@/components/ui/DisclaimerBanner';
import ChatPanel from '@/components/analysis/ChatPanel';
import { generatePDFReport } from '@/lib/reportGenerator';
import { formatDate, formatFileSize, cn } from '@/lib/utils';
import { RISK_LEVEL_CONFIG, type RiskLevel } from '@/types';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { history, currentAnalysis } = useAppStore();
  const { t } = useTranslation();
  const [filterLevel, setFilterLevel] = useState<'all' | RiskLevel>('all');

  const result = currentAnalysis?.id === id
    ? currentAnalysis
    : history.find((h) => h.id === id);

  const { isOpen, openChat } = useAgent(result ?? null);

  const RISK_FILTER_OPTIONS: Array<{ value: 'all' | RiskLevel; label: string }> = [
    { value: 'all',      label: t.common.all },
    { value: 'critical', label: t.risk.critical },
    { value: 'high',     label: t.risk.high },
    { value: 'medium',   label: t.risk.medium },
    { value: 'low',      label: t.risk.low },
  ];

  if (!result) {
    return (
      <div className="p-8 text-center">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-gray-700 mb-2">{t.result.notFoundTitle}</h2>
        <p className="text-gray-500 text-sm mb-4">{t.result.notFoundSubtitle}</p>
        <Link to="/app/analyze" className="btn-primary">{t.result.newAnalysis}</Link>
      </div>
    );
  }

  const filteredFlags = filterLevel === 'all'
    ? result.riskFlags
    : result.riskFlags.filter((f) => f.riskLevel === filterLevel);

  const handleExportPDF = () => {
    try { generatePDFReport(result); toast.success(t.result.pdfSuccess); }
    catch { toast.error(t.result.pdfError); }
  };

  const distribution = (['critical', 'high', 'medium', 'low'] as RiskLevel[]).map((level) => ({
    level, count: result.riskFlags.filter((f) => f.riskLevel === level).length,
    config: RISK_LEVEL_CONFIG[level],
  }));

  return (
    <>
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Back + Actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button onClick={() => navigate(-1)} className="btn-ghost gap-2 text-sm -ml-2">
          <ArrowLeft className="w-4 h-4" />
          {t.common.back}
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={openChat}
            className={cn('btn gap-2 text-sm', isOpen ? 'btn-primary' : 'btn-secondary')}
          >
            {isOpen ? <MessageCircle className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            {t.result.askAi}
          </button>
          <button onClick={handleExportPDF} className="btn-secondary gap-2 text-sm">
            <Download className="w-4 h-4" />
            {t.result.downloadPdf}
          </button>
        </div>
      </div>

      {/* Doc info */}
      <div className="card p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 bg-brand-50 rounded-lg flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-brand-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-gray-900 dark:text-white truncate">{result.documentName}</h1>
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(new Date(result.analysisDate))}</span>
              <span>{formatFileSize(result.documentSize)}</span>
              <span className="flex items-center gap-1"><Cpu className="w-3 h-3" />{t.result.processTime((result.processingTimeMs / 1000).toFixed(1))}</span>
              <span>{t.result.model}: {result.modelVersion}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skor */}
      <RiskScoreCard score={result.overallScore} riskLevel={result.overallRiskLevel} totalClauses={result.totalClauses} flaggedClauses={result.flaggedClauses} />

      {/* Ringkasan */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">{t.result.executiveSummary}</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{result.summary}</p>
      </div>

      {/* Distribusi */}
      {result.riskFlags.length > 0 && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">{t.result.riskDistribution}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {distribution.map(({ level, count, config }) => (
              <div key={level} className={cn('p-3 rounded-lg border text-center', config.bgColor, config.borderColor)}>
                <p className={cn('text-2xl font-bold', config.color)}>{count}</p>
                <p className={cn('text-xs font-medium mt-1', config.color)}>{config.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter + Klausul */}
      {result.riskFlags.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="font-semibold text-gray-900 dark:text-white">{t.result.flaggedClauses(filteredFlags.length)}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              {RISK_FILTER_OPTIONS.map(({ value, label }) => (
                <button key={value} onClick={() => setFilterLevel(value)}
                  className={cn('px-2.5 py-1 rounded-full text-xs font-medium border transition-colors',
                    filterLevel === value ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-300 hover:border-brand-400',
                  )}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {filteredFlags.length === 0 ? (
              <div className="card p-6 text-center text-gray-500 text-sm">{t.result.noClauseFilter}</div>
            ) : (
              filteredFlags.map((flag, i) => <ClauseCard key={flag.id} flag={flag} index={i + 1} />)
            )}
          </div>
        </div>
      ) : (
        <div className="card p-8 text-center">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="font-semibold text-green-700 mb-1">{t.result.noRiskTitle}</h3>
          <p className="text-sm text-gray-500">{t.result.noRiskSubtitle}</p>
        </div>
      )}

      <DisclaimerBanner />
    </div>

    <ChatPanel analysis={result} />

    {!isOpen && (
      <button onClick={openChat} className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-brand-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-brand-700 transition-all active:scale-95 md:hidden" aria-label={t.agent.fabLabel}>
        <Bot className="w-5 h-5" />
        <span className="text-sm font-semibold">{t.agent.fabText}</span>
      </button>
    )}
    </>
  );
}
