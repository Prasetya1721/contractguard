import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

interface DisclaimerBannerProps {
  className?: string;
  compact?: boolean;
}

export default function DisclaimerBanner({ className, compact }: DisclaimerBannerProps) {
  const { t } = useTranslation();
  return (
    <div
      className={cn('flex gap-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800', compact ? 'p-3' : 'p-4', className)}
      role="note"
      aria-label={t.common.disclaimerLabel}
    >
      <span className="text-amber-500 shrink-0 mt-0.5 text-base">⚠</span>
      <p className={cn('text-amber-800', compact ? 'text-xs' : 'text-sm')}>
        <strong>{t.common.disclaimerLabel}:</strong> {t.common.disclaimer}
      </p>
    </div>
  );
}
