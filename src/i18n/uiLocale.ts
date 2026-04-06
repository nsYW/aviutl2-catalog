export const SUPPORTED_UI_LOCALES = ['ja', 'en'] as const;

export type SupportedUiLocale = (typeof SUPPORTED_UI_LOCALES)[number];

export interface UiLocaleOption {
  value: SupportedUiLocale;
  label: string;
}

const UI_LOCALE_LABELS: Record<SupportedUiLocale, string> = {
  ja: '日本語',
  en: 'English',
};

const UI_LOCALE_ALIASES: Record<SupportedUiLocale, readonly string[]> = {
  ja: ['ja'],
  en: ['en'],
};

export const UI_LOCALE_OPTIONS: readonly UiLocaleOption[] = SUPPORTED_UI_LOCALES.map((locale) => ({
  value: locale,
  label: UI_LOCALE_LABELS[locale],
}));

export function normalizeUiLocale(value: unknown): SupportedUiLocale {
  const locale = typeof value === 'string' ? value.trim().toLowerCase() : '';
  const matched = SUPPORTED_UI_LOCALES.find((candidate) =>
    UI_LOCALE_ALIASES[candidate].some((alias) => locale.startsWith(alias)),
  );
  return matched ?? 'ja';
}

export function getUiLocaleLabel(locale: string): string {
  const normalized = String(locale || '')
    .trim()
    .toLowerCase();
  if (!normalized) return 'Unknown';
  const directMatch = UI_LOCALE_LABELS[normalized as SupportedUiLocale];
  if (directMatch) return directMatch;
  const baseLocale = normalized.split('-')[0];
  const baseMatch = UI_LOCALE_LABELS[baseLocale as SupportedUiLocale];
  if (baseMatch) return baseMatch;
  return normalized.toUpperCase();
}
