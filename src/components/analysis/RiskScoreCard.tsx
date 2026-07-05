import { cn } from '@/lib/utils';
import type { RiskLevel } from '@/types';
import { RISK_LEVEL_CONFIG } from '@/types';

interface RiskScoreCardProps {
  score: number;
  riskLevel: RiskLevel;
  totalClauses: number;
  flaggedClauses: number;
  className?: string;
}

export default function RiskScoreCard({
  score,
  riskLevel,
  totalClauses,
  flaggedClauses,
  className,
}: RiskScoreCardProps) {
  const config = RISK_LEVEL_CONFIG[riskLevel];

  // SVG donut chart
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const strokeColors: Record<RiskLevel, string> = {
    low: '#22c55e',
    medium: '#f59e0b',
    high: '#ef4444',
    critical: '#7c3aed',
  };

  return (
    <div className={cn('card p-6', className)}>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Skor Risiko Keseluruhan
      </h3>

      <div className="flex items-center gap-6">
        {/* Donut chart */}
        <div className="relative shrink-0">
          <svg width="140" height="140" className="-rotate-90">
            {/* Background circle */}
            <circle
              cx="70" cy="70" r={radius}
              fill="none" stroke="#e5e7eb" strokeWidth="12"
            />
            {/* Score arc */}
            <circle
              cx="70" cy="70" r={radius}
              fill="none"
              stroke={strokeColors[riskLevel]}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{score}</span>
            <span className="text-xs text-gray-500">/100</span>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-3">
          <div>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border',
                config.bgColor, config.color, config.borderColor,
              )}
            >
              <span className="text-base">{config.icon}</span>
              {config.label}
            </span>
          </div>

          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Total klausul dianalisis:</span>
              <span className="font-semibold text-gray-900">{totalClauses}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Klausul bermasalah:</span>
              <span className={cn('font-semibold', flaggedClauses > 0 ? 'text-red-600' : 'text-green-600')}>
                {flaggedClauses}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
