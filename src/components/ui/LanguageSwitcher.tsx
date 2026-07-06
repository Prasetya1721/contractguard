import { useAppStore } from '@/store/appStore';
import { LOCALE_LABELS, type Locale } from '@/i18n';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  className?: string;
  compact?: boolean;  // hanya tampilkan flag
}

export default function LanguageSwitcher({ className, compact }: LanguageSwitcherProps) {
  const { locale, setLocale } = useAppStore();
  const locales = Object.entries(LOCALE_LABELS) as [Locale, { label: string; flag: string }][];

  return (
    <div className={cn('flex items-center gap-1 p-1 bg-gray-100 rounded-lg', className)}>
      {locales.map(([key, { label, flag }]) => (
        <button
          key={key}
          onClick={() => setLocale(key)}
          title={label}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all',
            locale === key
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-800',
          )}
        >
          <span className="text-sm leading-none">{flag}</span>
          {!compact && <span>{label}</span>}
        </button>
      ))}
    </div>
  );
}
