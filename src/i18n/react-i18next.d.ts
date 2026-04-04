// eslint-disable-next-line import/no-unassigned-import
import 'react-i18next';
import type { defaultNS, resources } from './resources';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)['ja'];
  }
}
