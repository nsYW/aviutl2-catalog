import { i18n } from '@/i18n';
import { AlertOctagon, AlertTriangle, createElement, IconNode, Info, Lightbulb, MessageSquareWarning } from 'lucide';
import { MarkdownExit } from 'markdown-exit';
import githubAlerts, { MarkdownItGitHubAlertsOptions } from 'markdown-it-github-alerts';

function renderAlertIcon(iconNode: IconNode): string {
  const svgString = createElement(iconNode, {
    size: 16,
    strokeWidth: 1.8,
    'aria-hidden': 'true',
    role: 'presentation',
    'data-is-alert-icon': 'true',
  });
  return svgString.outerHTML;
}

/** GitHubのアラートつきコードブロック */
export function alertBlock(md: MarkdownExit): void {
  md.use(githubAlerts, {
    titles: {
      note: i18n.t('common:markdownAlerts.note'),
      tip: i18n.t('common:markdownAlerts.tip'),
      important: i18n.t('common:markdownAlerts.important'),
      warning: i18n.t('common:markdownAlerts.warning'),
      caution: i18n.t('common:markdownAlerts.caution'),
    },
    icons: {
      note: renderAlertIcon(Info),
      tip: renderAlertIcon(Lightbulb),
      important: renderAlertIcon(MessageSquareWarning),
      warning: renderAlertIcon(AlertTriangle),
      caution: renderAlertIcon(AlertOctagon),
    },
  } satisfies MarkdownItGitHubAlertsOptions);
}
