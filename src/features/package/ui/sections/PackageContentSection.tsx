import { useEffect, useMemo, useRef } from 'react';
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
          <h2 className="text-lg font-bold">スクリーンショット</h2>
          <ImageCarousel images={carouselImages} />
        </section>
      ) : null}

      <section className={surface.cardSection}>
        <h2 className={sectionTitleClass}>概要</h2>
        <p className="select-text text-base leading-7 text-slate-600 dark:text-slate-300">{item.summary || '?'}</p>
        {item.deprecation ? (
          <>
            <h3 className="text-sm font-bold text-yellow-600 dark:text-yellow-400 mt-4 mb-2 content-center">
              <TriangleAlert className="inline text-yellow-600 dark:text-yellow-400 mr-1" />
              非推奨
            </h3>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              このパッケージは以下の理由で非推奨となっています。
              <br />
              <blockquote className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-700 text-sm text-yellow-800 dark:text-yellow-300 rounded">
                {item.deprecation.message}
              </blockquote>
            </p>
          </>
        ) : null}
      </section>

      {item.description ? (
        <section className={surface.cardSection}>
          <h2 className="text-lg font-bold mb-3">詳細説明</h2>
          {descriptionLoading ? (
            <p className={text.mutedSm}>詳細説明を読み込み中です…</p>
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
          <h2 className={sectionTitleClass}>依存関係</h2>
          <p className={text.bodySmMuted}>{item.dependencies.join(', ')}</p>
        </section>
      ) : null}
    </div>
  );
}
