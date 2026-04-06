import commonEn from './resources/en/common.json';
import feedbackEn from './resources/en/feedback.json';
import homeEn from './resources/en/home.json';
import initSetupEn from './resources/en/initSetup.json';
import linksEn from './resources/en/links.json';
import niconiCommonsEn from './resources/en/niconiCommons.json';
import navEn from './resources/en/nav.json';
import packageEn from './resources/en/packageDetail.json';
import registerFormEn from './resources/en/register/form.json';
import registerInstallerEn from './resources/en/register/installer.json';
import registerVersionsEn from './resources/en/register/versions.json';
import registerWorkflowEn from './resources/en/register/workflow.json';
import settingsEn from './resources/en/settings.json';
import updatesEn from './resources/en/updates.json';
import commonJa from './resources/ja/common.json';
import feedbackJa from './resources/ja/feedback.json';
import homeJa from './resources/ja/home.json';
import initSetupJa from './resources/ja/initSetup.json';
import linksJa from './resources/ja/links.json';
import niconiCommonsJa from './resources/ja/niconiCommons.json';
import navJa from './resources/ja/nav.json';
import packageJa from './resources/ja/packageDetail.json';
import registerFormJa from './resources/ja/register/form.json';
import registerInstallerJa from './resources/ja/register/installer.json';
import registerVersionsJa from './resources/ja/register/versions.json';
import registerWorkflowJa from './resources/ja/register/workflow.json';
import settingsJa from './resources/ja/settings.json';
import updatesJa from './resources/ja/updates.json';
import type { SupportedUiLocale } from './uiLocale';

export const defaultNS = 'common';
export const namespaces = [
  'common',
  'nav',
  'home',
  'package',
  'updates',
  'settings',
  'feedback',
  'initSetup',
  'links',
  'niconiCommons',
  'register',
] as const;

const registerJa = {
  ...registerWorkflowJa,
  ...registerFormJa,
  ...registerInstallerJa,
  ...registerVersionsJa,
} as const;

const registerEn = {
  ...registerWorkflowEn,
  ...registerFormEn,
  ...registerInstallerEn,
  ...registerVersionsEn,
} as const satisfies typeof registerJa;

const jaResources = {
  common: commonJa,
  nav: navJa,
  home: homeJa,
  package: packageJa,
  updates: updatesJa,
  settings: settingsJa,
  feedback: feedbackJa,
  initSetup: initSetupJa,
  links: linksJa,
  niconiCommons: niconiCommonsJa,
  register: registerJa,
} as const;

export type LocaleResourceSchema = typeof jaResources;

const enResources = {
  common: commonEn,
  nav: navEn,
  home: homeEn,
  package: packageEn,
  updates: updatesEn,
  settings: settingsEn,
  feedback: feedbackEn,
  initSetup: initSetupEn,
  links: linksEn,
  niconiCommons: niconiCommonsEn,
  register: registerEn,
} as const satisfies LocaleResourceSchema;

export const resources = {
  ja: jaResources,
  en: enResources,
} as const satisfies Record<SupportedUiLocale, LocaleResourceSchema>;
