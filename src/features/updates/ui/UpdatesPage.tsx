import { useMemo } from 'react';
import ErrorDialog from '../../../components/ErrorDialog';
import useUpdatesPage from './hooks/useUpdatesPage';
import { BulkProgressSection, UpdatesHeaderSection, UpdatesTableSection } from './sections';
import { page, text } from '@/components/ui/_styles';
import { cn } from '@/lib/cn';

export default function UpdatesPage() {
  const {
    activeUpdatableItems,
    pausedUpdatableItems,
    pausedPackageUpdatesLoaded,
    bulkUpdatableCount,
    bulkUpdating,
    hasAnyItemUpdating,
    bulkProgress,
    bulkPercent,
    itemProgress,
    pausedPackageIdSet,
    pauseBusyIdSet,
    error,
    setError,
    handleBulkUpdate,
    handleUpdate,
    handleTogglePause,
  } = useUpdatesPage();

  const progressStyle = useMemo(() => ({ width: `${bulkPercent}%` }), [bulkPercent]);

  return (
    <>
      <div className={cn(page.container3xl, page.selectNone)}>
        <UpdatesHeaderSection
          bulkUpdating={bulkUpdating}
          hasAnyItemUpdating={hasAnyItemUpdating}
          updatableCount={bulkUpdatableCount}
          onBulkUpdate={handleBulkUpdate}
        />

        {bulkUpdating && bulkProgress ? (
          <BulkProgressSection bulkProgress={bulkProgress} bulkPercent={bulkPercent} progressStyle={progressStyle} />
        ) : null}

        <div className="space-y-3">
          <h3 className={text.headingSmBold}>更新可能</h3>
          <UpdatesTableSection
            items={activeUpdatableItems}
            emptyMessage={pausedPackageUpdatesLoaded ? '更新可能なパッケージはありません' : '一時停止設定を読み込み中…'}
            itemProgress={itemProgress}
            bulkUpdating={bulkUpdating || !pausedPackageUpdatesLoaded}
            pausedPackageIds={pausedPackageIdSet}
            pauseBusyIds={pauseBusyIdSet}
            onUpdate={handleUpdate}
            onTogglePause={handleTogglePause}
          />
        </div>

        {pausedUpdatableItems.length > 0 ? (
          <div className="mt-6 space-y-3">
            <h3 className={text.headingSmBold}>一時停止中</h3>
            <UpdatesTableSection
              items={pausedUpdatableItems}
              emptyMessage="一時停止中のパッケージはありません"
              itemProgress={itemProgress}
              bulkUpdating={bulkUpdating}
              pausedPackageIds={pausedPackageIdSet}
              pauseBusyIds={pauseBusyIdSet}
              onUpdate={handleUpdate}
              onTogglePause={handleTogglePause}
            />
          </div>
        ) : null}
      </div>
      <ErrorDialog open={Boolean(error)} message={error} onClose={() => setError('')} />
    </>
  );
}
