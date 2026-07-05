import { cn } from '@/lib/utils';

interface ProgressBarProps {
  step: string;
  percent: number;
  className?: string;
}

export default function ProgressBar({ step, percent, className }: ProgressBarProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">{step}</span>
        <span className="font-semibold text-brand-600">{percent}%</span>
      </div>
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex gap-1.5 justify-center">
        {[15, 35, 55, 75, 90, 100].map((milestone) => (
          <div
            key={milestone}
            className={cn(
              'w-2 h-2 rounded-full transition-colors duration-300',
              percent >= milestone ? 'bg-brand-500' : 'bg-gray-200',
            )}
          />
        ))}
      </div>
    </div>
  );
}
