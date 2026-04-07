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
import commonKo from './resources/ko/common.json';
import feedbackKo from './resources/ko/feedback.json';
import homeKo from './resources/ko/home.json';
import initSetupKo from './resources/ko/initSetup.json';
import linksKo from './resources/ko/links.json';
import niconiCommonsKo from './resources/ko/niconiCommons.json';
import navKo from './resources/ko/nav.json';
import packageKo from './resources/ko/packageDetail.json';
import registerFormKo from './resources/ko/register/form.json';
import registerInstallerKo from './resources/ko/register/installer.json';
import registerVersionsKo from './resources/ko/register/versions.json';
import registerWorkflowKo from './resources/ko/register/workflow.json';
import settingsKo from './resources/ko/settings.json';
import updatesKo from './resources/ko/updates.json';
import commonZhCn from './resources/zh-CN/common.json';
import feedbackZhCn from './resources/zh-CN/feedback.json';
import homeZhCn from './resources/zh-CN/home.json';
import initSetupZhCn from './resources/zh-CN/initSetup.json';
import linksZhCn from './resources/zh-CN/links.json';
import niconiCommonsZhCn from './resources/zh-CN/niconiCommons.json';
import navZhCn from './resources/zh-CN/nav.json';
import packageZhCn from './resources/zh-CN/packageDetail.json';
import registerFormZhCn from './resources/zh-CN/register/form.json';
import registerInstallerZhCn from './resources/zh-CN/register/installer.json';
import registerVersionsZhCn from './resources/zh-CN/register/versions.json';
import registerWorkflowZhCn from './resources/zh-CN/register/workflow.json';
import settingsZhCn from './resources/zh-CN/settings.json';
import updatesZhCn from './resources/zh-CN/updates.json';
import commonZhTw from './resources/zh-TW/common.json';
import feedbackZhTw from './resources/zh-TW/feedback.json';
import homeZhTw from './resources/zh-TW/home.json';
import initSetupZhTw from './resources/zh-TW/initSetup.json';
import linksZhTw from './resources/zh-TW/links.json';
import niconiCommonsZhTw from './resources/zh-TW/niconiCommons.json';
import navZhTw from './resources/zh-TW/nav.json';
import packageZhTw from './resources/zh-TW/packageDetail.json';
import registerFormZhTw from './resources/zh-TW/register/form.json';
import registerInstallerZhTw from './resources/zh-TW/register/installer.json';
import registerVersionsZhTw from './resources/zh-TW/register/versions.json';
import registerWorkflowZhTw from './resources/zh-TW/register/workflow.json';
import settingsZhTw from './resources/zh-TW/settings.json';
import updatesZhTw from './resources/zh-TW/updates.json';
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

const registerKo = {
  ...registerWorkflowKo,
  ...registerFormKo,
  ...registerInstallerKo,
  ...registerVersionsKo,
} as const satisfies typeof registerJa;

const registerZhCn = {
  ...registerWorkflowZhCn,
  ...registerFormZhCn,
  ...registerInstallerZhCn,
  ...registerVersionsZhCn,
} as const satisfies typeof registerJa;

const registerZhTw = {
  ...registerWorkflowZhTw,
  ...registerFormZhTw,
  ...registerInstallerZhTw,
  ...registerVersionsZhTw,
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

const koResources = {
  common: commonKo,
  nav: navKo,
  home: homeKo,
  package: packageKo,
  updates: updatesKo,
  settings: settingsKo,
  feedback: feedbackKo,
  initSetup: initSetupKo,
  links: linksKo,
  niconiCommons: niconiCommonsKo,
  register: registerKo,
} as const satisfies LocaleResourceSchema;

const zhCnResources = {
  common: commonZhCn,
  nav: navZhCn,
  home: homeZhCn,
  package: packageZhCn,
  updates: updatesZhCn,
  settings: settingsZhCn,
  feedback: feedbackZhCn,
  initSetup: initSetupZhCn,
  links: linksZhCn,
  niconiCommons: niconiCommonsZhCn,
  register: registerZhCn,
} as const satisfies LocaleResourceSchema;

const zhTwResources = {
  common: commonZhTw,
  nav: navZhTw,
  home: homeZhTw,
  package: packageZhTw,
  updates: updatesZhTw,
  settings: settingsZhTw,
  feedback: feedbackZhTw,
  initSetup: initSetupZhTw,
  links: linksZhTw,
  niconiCommons: niconiCommonsZhTw,
  register: registerZhTw,
} as const satisfies LocaleResourceSchema;

export const resources = {
  ja: jaResources,
  en: enResources,
  ko: koResources,
  'zh-CN': zhCnResources,
  'zh-TW': zhTwResources,
} as const satisfies Record<SupportedUiLocale, LocaleResourceSchema>;
