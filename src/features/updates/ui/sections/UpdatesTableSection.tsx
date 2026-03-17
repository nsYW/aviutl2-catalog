import ProgressCircle from '@/components/ProgressCircle';
import PackageNameLink from '@/components/PackageNameLink';
import { latestVersionOf } from '@/utils/catalog';
import type { UpdatesTableSectionProps } from '../types';
import { surface, table, text } from '@/components/ui/_styles';
import { cn } from '@/lib/cn';

const cellTruncateClass = table.cellBodyTruncate;

export default function UpdatesTableSection({
  items,
  emptyMessage,
  itemProgress,
  bulkUpdating,
  pausedPackageIds,
  pauseBusyIds,
  onUpdate,
  onTogglePause,
}: UpdatesTableSectionProps) {
  return (
    <div className={surface.panel}>
      {items.length === 0 ? (
        <div className={text.emptyStateMuted}>
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className={table.scrollX}>
          <div className="min-w-[760px]">
            <div
              className={cn(
                table.headerBase,
                'grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_8rem]',
              )}
            >
              <span>パッケージ</span>
              <span>作者</span>
              <span>種類</span>
              <span>更新前</span>
              <span>更新後</span>
              <span className="text-right"></span>
            </div>
            <div className={surface.divideMuted}>
              {items.map((item) => {
                const progress = itemProgress[item.id];
                const paused = pausedPackageIds.has(item.id);
                const pauseBusy = pauseBusyIds.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={cn(
                      table.rowBase,
                      table.rowRelaxed,
                      'grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_8rem] transition-none hover:bg-transparent dark:hover:bg-transparent',
                    )}
                  >
                    <div className="min-w-0">
                      <PackageNameLink id={item.id} name={item.name} source="updates" />
                    </div>
                    <div className={cellTruncateClass}>{item.author || '?'}</div>
                    <div className={cellTruncateClass}>{item.type || '?'}</div>
                    <div className={text.bodySmMutedAlt}>{item.installedVersion || '?'}</div>
                    <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {latestVersionOf(item) || ''}
                    </div>
                    <div className="text-right">
                      {progress ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className={text.mutedXs}>{progress.label}</span>
                          <ProgressCircle
                            value={progress.ratio}
                            size={24}
                            strokeWidth={3}
                            ariaLabel={`${item.name} の更新進捗`}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          {paused ? (
                            <button
                              className={table.actionButtonSubtle}
                              onClick={() => onTogglePause(item, false)}
                              disabled={bulkUpdating || pauseBusy}
                              type="button"
                            >
                              {pauseBusy ? '保存中…' : '再開'}
                            </button>
                          ) : (
                            <>
                              <button
                                className={table.actionButtonSubtle}
                                onClick={() => onTogglePause(item, true)}
                                disabled={bulkUpdating || pauseBusy}
                                type="button"
                              >
                                {pauseBusy ? '保存中…' : '一時停止'}
                              </button>
                              <button
                                className={table.actionButtonSubtle}
                                onClick={() => onUpdate(item)}
                                disabled={bulkUpdating || pauseBusy}
                                type="button"
                              >
                                更新
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
