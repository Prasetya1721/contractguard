import { useAppStore } from '@/store/appStore';
import { translations, DEFAULT_LOCALE } from '@/i18n';
import type { Translations } from '@/i18n';

/**
 * Hook untuk mengakses string terjemahan berdasarkan locale aktif.
 * Usage:
 *   const { t, locale } = useTranslation();
 *   <p>{t.common.appName}</p>
 *   <p>{t.dashboard.flaggedClauses(3)}</p>
 */
export function useTranslation(): { t: Translations; locale: 'id' | 'en' } {
  const locale = useAppStore((s) => s.locale) ?? DEFAULT_LOCALE;
  return { t: translations[locale], locale };
}
