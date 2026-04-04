import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getSettings } from '@/utils/settings';
import { defaultNS, namespaces, resources } from './resources';

export const SUPPORTED_UI_LOCALES = ['ja', 'en'] as const;

export type SupportedUiLocale = (typeof SUPPORTED_UI_LOCALES)[number];
type I18nLanguageSource = Pick<typeof i18n, 'resolvedLanguage' | 'language'>;

export function normalizeUiLocale(value: unknown): SupportedUiLocale {
  const locale = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (locale.startsWith('en')) return 'en';
  return 'ja';
}

export function getCurrentUiLocale(source: I18nLanguageSource = i18n): SupportedUiLocale {
  return normalizeUiLocale(source.resolvedLanguage ?? source.language);
}

function resolveInitialLanguage(settingsLocale: unknown): string {
  const saved = typeof settingsLocale === 'string' ? settingsLocale.trim() : '';
  if (saved) return saved;

  const browserLocale =
    navigator.languages?.map((value) => value.trim()).find(Boolean) ??
    (typeof navigator.language === 'string' ? navigator.language.trim() : '');

  return browserLocale || 'ja';
}

export async function initializeI18n(): Promise<typeof i18n> {
  if (i18n.isInitialized) return i18n;

  let settingsLocale = '';
  try {
    settingsLocale = (await getSettings()).locale ?? '';
  } catch {}

  // eslint-disable-next-line import/no-named-as-default-member
  await i18n.use(initReactI18next).init({
    resources,
    lng: resolveInitialLanguage(settingsLocale),
    fallbackLng: 'ja',
    supportedLngs: [...SUPPORTED_UI_LOCALES],
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    defaultNS,
    ns: [...namespaces],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

  return i18n;
}

export { i18n };
