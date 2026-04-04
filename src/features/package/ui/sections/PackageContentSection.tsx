import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ImageCarousel from '../components/ImageCarousel';
import type { PackageContentSectionProps } from '../types';
import { surface, text } from '@/components/ui/_styles';
import { TriangleAlert } from 'lucide-react';

const sectionTitleClass = 'text-lg font-bold mb-2';

function resolveAnchorHref(target: EventTarget | null): string {
  if (!(target instanceof Element)) return '';
  const link = target.closest('a[href]');
  if (!(link instanceof HTMLAnchorElement)) return '';
  return link.href || '';
}

export default function PackageContentSection({
  item,
  carouselImages,
  descriptionHtml,
  descriptionLoading,
  descriptionError,
  onOpenLink,
}: PackageContentSectionProps) {
  const { t } = useTranslation('package');
  const descriptionMarkup = useMemo(() => ({ __html: descriptionHtml }), [descriptionHtml]);
  const descriptionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = descriptionRef.current;
    if (!el || descriptionLoading || !item.description) return;

    const handleClick = (event: MouseEvent) => {
      const href = resolveAnchorHref(event.target);
      if (!href) return;
      event.preventDefault();
      void onOpenLink(href);
    };

    el.addEventListener('click', handleClick);
    return () => el.removeEventListener('click', handleClick);
  }, [descriptionLoading, item.description, onOpenLink]);

  return (
    <div className="space-y-6">
      {carouselImages.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-bold">{t('content.screenshots')}</h2>
          <ImageCarousel images={carouselImages} />
        </section>
      ) : null}

      <section className={surface.cardSection}>
        <h2 className={sectionTitleClass}>{t('common:labels.summary')}</h2>
        <p className="select-text text-base leading-7 text-slate-600 dark:text-slate-300">{item.summary || '?'}</p>
        {item.deprecation ? (
          <>
            <h3 className="text-sm font-bold text-yellow-600 dark:text-yellow-300 mt-4 mb-2 justify-center">
              <TriangleAlert className="inline text-yellow-600 dark:text-yellow-300 mr-1" />
              {t('content.deprecated')}
            </h3>
            {item.deprecation.message ? (
              <>
                <p className="text-sm text-yellow-600 dark:text-yellow-300">{t('content.deprecatedReason')}</p>
                <blockquote className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 dark:border-yellow-500 text-sm text-yellow-600 dark:text-yellow-300 rounded">
                  {item.deprecation.message}
                </blockquote>
              </>
            ) : (
              <p className="text-sm text-yellow-600 dark:text-yellow-300">{t('content.deprecatedSimple')}</p>
            )}
          </>
        ) : null}
      </section>

      {item.description ? (
        <section className={surface.cardSection}>
          <h2 className="text-lg font-bold mb-3">{t('common:labels.description')}</h2>
          {descriptionLoading ? (
            <p className={text.mutedSm}>{t('content.descriptionLoading')}</p>
          ) : (
            <div
              ref={descriptionRef}
              className="prose prose-slate max-w-none dark:prose-invert select-text"
              dangerouslySetInnerHTML={descriptionMarkup}
            />
          )}
          {descriptionError ? (
            <p className="error mt-3" role="alert">
              {descriptionError}
            </p>
          ) : null}
        </section>
      ) : null}

      {item.dependencies?.length ? (
        <section className={surface.cardSection}>
          <h2 className={sectionTitleClass}>{t('content.dependencies')}</h2>
          <p className={text.bodySmMuted}>{item.dependencies.join(', ')}</p>
        </section>
      ) : null}
    </div>
  );
}
