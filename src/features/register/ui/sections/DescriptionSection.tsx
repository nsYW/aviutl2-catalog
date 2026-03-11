/**
 * 詳細説明エリアの表示コンポーネント
 */
import { useEffect, useMemo, useRef } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import * as tauriShell from '@tauri-apps/plugin-shell';
import type { RegisterDescriptionSectionProps } from '../types';
import { action, layout, surface, text } from '@/components/ui/_styles';
import { cn } from '@/lib/cn';

export default function RegisterDescriptionSection({
  packageForm,
  descriptionTab,
  descriptionLoading,
  descriptionPreviewHtml,
  isExternalDescription,
  hasExternalDescriptionUrl,
  isExternalDescriptionLoaded,
  externalDescriptionStatus,
  onUpdatePackageField,
  onSetDescriptionTab,
}: RegisterDescriptionSectionProps) {
  const previewMarkup = useMemo(() => ({ __html: descriptionPreviewHtml }), [descriptionPreviewHtml]);
  const previewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = previewRef.current;
    if (!el || descriptionTab !== 'preview') return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest('a[href]');
      if (!(link instanceof HTMLAnchorElement) || !link.href) return;
      event.preventDefault();
      void tauriShell.open(link.href);
    };

    el.addEventListener('click', handleClick);
    return () => el.removeEventListener('click', handleClick);
  }, [descriptionTab]);

  return (
    <section className={surface.cardSection}>
      <div className={layout.rowBetweenWrapGap2}>
        <h2 className={text.titleLg}>説明</h2>
      </div>
      <div className="space-y-2">
        <label className={text.labelSm} htmlFor="package-summary">
          概要 <span className="text-red-500">*</span>
        </label>
        <input
          id="package-summary"
          name="summary"
          value={packageForm.summary}
          onChange={(e) => onUpdatePackageField('summary', e.target.value)}
          required
          placeholder="パッケージの概要 (35文字以内)"
        />
        <div className="flex justify-end">
          <span
            className={cn('text-xs', packageForm.summary.length > 35 ? 'text-red-500 font-bold' : 'text-slate-400')}
          >
            {packageForm.summary.length} / 35
          </span>
        </div>
      </div>
      <div className={layout.rowBetweenWrapGap2}>
        <label htmlFor={isExternalDescription ? 'description-url' : 'description-textarea'} className={text.labelSm}>
          詳細説明 <span className="text-red-500">*</span>
        </label>
        <div className={layout.wrapItemsGap2}>
          <div className={action.segmentedGroupFlush}>
            <Button
              variant="plain"
              size="none"
              type="button"
              className={cn(
                action.segmentedOptionBase,
                'rounded-l-lg rounded-r-none px-3 py-1.5',
                !isExternalDescription ? action.switchTabActive : action.switchTabInactive,
              )}
              onClick={() => onUpdatePackageField('descriptionMode', 'inline')}
            >
              アプリ内入力
            </Button>
            <Button
              variant="plain"
              size="none"
              type="button"
              className={cn(
                action.segmentedOptionBase,
                'rounded-l-none rounded-r-lg px-3 py-1.5',
                isExternalDescription ? action.switchTabActive : action.switchTabInactive,
              )}
              onClick={() => onUpdatePackageField('descriptionMode', 'external')}
            >
              外部MDリンク
            </Button>
          </div>
          <span className={text.mutedXs}>Markdown形式</span>
        </div>
      </div>
      <div className={surface.panelOverflow}>
        <div
          className="flex border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50"
          role="tablist"
        >
          <Button
            variant="plain"
            size="actionSm"
            type="button"
            role="tab"
            aria-selected={descriptionTab === 'edit'}
            className={cn(
              action.segmentedOptionBase,
              'flex-1 rounded-b-none rounded-tl-lg rounded-tr-none',
              descriptionTab === 'edit' ? action.switchTabActive : action.switchTabInactive,
            )}
            onClick={() => onSetDescriptionTab('edit')}
          >
            {isExternalDescription ? '外部リンク指定' : '編集'}
          </Button>
          <Button
            variant="plain"
            size="actionSm"
            type="button"
            role="tab"
            aria-selected={descriptionTab === 'preview'}
            className={cn(
              action.segmentedOptionBase,
              'flex-1 rounded-b-none rounded-tl-none rounded-tr-lg',
              descriptionTab === 'preview' ? action.switchTabActive : action.switchTabInactive,
            )}
            onClick={() => onSetDescriptionTab('preview')}
          >
            プレビュー
          </Button>
        </div>
        <div className="p-0">
          {descriptionTab === 'edit' ? (
            isExternalDescription ? (
              <div className="space-y-3 p-4">
                <Input
                  id="description-url"
                  className="focus:border-blue-500 focus:ring-blue-500/20"
                  type="url"
                  value={packageForm.descriptionUrl}
                  onChange={(e) => onUpdatePackageField('descriptionUrl', e.target.value)}
                  placeholder="https://example.com/description.md"
                />
                {!hasExternalDescriptionUrl && <p className={text.mutedXs}>MarkdownのURLを入力してください。</p>}
                <p className={text.mutedXs}>
                  GitHub上のMDを登録される場合はhttps://raw.githubusercontent.com/から始まるリンクになっているか注意してください。
                </p>
                {descriptionLoading && (
                  <p className="text-xs text-slate-400 dark:text-slate-500">リンク先を読み込み中…</p>
                )}
                {isExternalDescriptionLoaded && !descriptionLoading && (
                  <div className={cn(layout.inlineGap1, 'text-xs text-emerald-600 dark:text-emerald-400')}>
                    <CheckCircle2 size={14} />
                    Markdown読み込み済み
                  </div>
                )}
                {hasExternalDescriptionUrl && externalDescriptionStatus === 'error' && !descriptionLoading && (
                  <div className={cn(layout.inlineGap1, 'text-xs text-red-500 dark:text-red-400')}>
                    <AlertCircle size={14} />
                    Markdownを読み込めませんでした
                  </div>
                )}
              </div>
            ) : (
              <textarea
                id="description-textarea"
                className="min-h-[400px] w-full resize-y rounded-b-xl rounded-t-none border-0 bg-white p-4 font-mono text-sm leading-relaxed text-slate-900 shadow-none focus-visible:outline-none focus-visible:ring-0 dark:bg-slate-800 dark:text-slate-100"
                value={packageForm.descriptionText}
                onChange={(e) => onUpdatePackageField('descriptionText', e.target.value)}
                required
                placeholder="パッケージの詳細情報を入力してください。Markdown形式で記入できます。どこから呼び出せるか（メニュー位置など）や、UIの説明もあわせて記入していただけると助かります。外部サイトの画像も貼り付けることができます。"
              />
            )
          ) : (
            <div
              ref={previewRef}
              className="prose prose-slate max-h-[400px] w-full max-w-none overflow-y-auto p-6 dark:prose-invert"
              dangerouslySetInnerHTML={previewMarkup}
            />
          )}
        </div>
      </div>
    </section>
  );
}
