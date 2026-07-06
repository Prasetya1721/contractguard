import id from './id';
import en from './en';
import type { Translations } from './id';

export type Locale = 'id' | 'en';

export const translations: Record<Locale, Translations> = { id, en };

export const LOCALE_LABELS: Record<Locale, { label: string; flag: string }> = {
  id: { label: 'Indonesia', flag: '🇮🇩' },
  en: { label: 'English',   flag: '🇺🇸' },
};

export const DEFAULT_LOCALE: Locale = 'id';

/** Detect browser language on first visit */
export function detectLocale(): Locale {
  const lang = navigator.language?.toLowerCase() ?? '';
  if (lang.startsWith('id') || lang.startsWith('in')) return 'id';
  return 'en';
}

export { type Translations };
export { default as idTranslations } from './id';
export { default as enTranslations } from './en';
