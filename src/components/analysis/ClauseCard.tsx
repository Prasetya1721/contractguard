import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, Info, CheckCircle, Zap, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RiskFlag } from '@/types';
import { CLAUSE_CATEGORY_LABELS, RISK_LEVEL_CONFIG } from '@/types';
import toast from 'react-hot-toast';

interface ClauseCardProps {
  flag: RiskFlag;
  index: number;
}

const RISK_ICONS = {
  low: CheckCircle,
  medium: Info,
  high: AlertTriangle,
  critical: Zap,
};

export default function ClauseCard({ flag, index }: ClauseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = RISK_LEVEL_CONFIG[flag.riskLevel];
  const Icon = RISK_ICONS[flag.riskLevel];

  const copyAlt = () => {
    if (flag.alternativeText) {
      navigator.clipboard.writeText(flag.alternativeText);
      toast.success('Alternatif teks disalin!');
    }
  };

  return (
    <div
      className={cn(
        'card border-l-4 transition-shadow hover:shadow-md',
        {
          'border-l-green-400': flag.riskLevel === 'low',
          'border-l-amber-400': flag.riskLevel === 'medium',
          'border-l-red-500': flag.riskLevel === 'high',
          'border-l-purple-500': flag.riskLevel === 'critical',
        },
      )}
    >
      {/* Header */}
      <button
        className="w-full flex items-start gap-4 p-4 text-left"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-xs font-bold text-gray-500 shrink-0 mt-0.5">
          {index}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-gray-900">{flag.title}</h4>
            <span
              className={cn(
                'badge',
                `badge-${flag.riskLevel}`,
              )}
            >
              <Icon className="w-3 h-3" />
              {config.label}
            </span>
          </div>
          <p className="text-xs text-gray-500">{CLAUSE_CATEGORY_LABELS[flag.category]}</p>
        </div>

        <div className="shrink-0 text-gray-400 mt-0.5">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-5 space-y-4 border-t border-gray-100">
          {/* Kutipan asli */}
          {flag.originalText && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Kutipan dari Kontrak
              </p>
              <blockquote className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 italic">
                "{flag.originalText}"
              </blockquote>
            </div>
          )}

          {/* Penjelasan */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Mengapa Berisiko?
            </p>
            <p className="text-sm text-gray-700">{flag.description}</p>
          </div>

          {/* Rekomendasi */}
          <div className={cn('rounded-lg p-3.5', config.bgColor, config.borderColor, 'border')}>
            <p className={cn('text-xs font-semibold uppercase tracking-wide mb-1.5', config.color)}>
              Rekomendasi
            </p>
            <p className={cn('text-sm', config.color)}>{flag.recommendation}</p>
          </div>

          {/* Alternatif teks */}
          {flag.alternativeText && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Contoh Bahasa Alternatif
                </p>
                <button
                  onClick={copyAlt}
                  className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  Salin
                </button>
              </div>
              <div className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                {flag.alternativeText}
              </div>
            </div>
          )}

          {/* Source badge */}
          <div className="flex justify-end">
            <span className="text-xs text-gray-400">
              Sumber: {flag.ruleSource === 'rule_engine' ? 'Rule Engine' : flag.ruleSource === 'ai' ? 'AI Analysis' : 'Rule Engine + AI'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
