import type { CSSProperties } from 'react';
import type { BulkUpdateProgress, ItemUpdateProgressMap, UpdatesItem } from '../model/types';

export interface UpdatesHeaderSectionProps {
  bulkUpdating: boolean;
  hasAnyItemUpdating: boolean;
  updatableCount: number;
  onBulkUpdate: () => void;
}

export interface BulkProgressSectionProps {
  bulkProgress: BulkUpdateProgress;
  bulkPercent: number;
  progressStyle: CSSProperties;
}

export interface UpdatesTableSectionProps {
  items: UpdatesItem[];
  emptyMessage: string;
  itemProgress: ItemUpdateProgressMap;
  bulkUpdating: boolean;
  pausedPackageIds: ReadonlySet<string>;
  pauseBusyIds: ReadonlySet<string>;
  onUpdate: (item: UpdatesItem) => void;
  onTogglePause: (item: UpdatesItem, paused: boolean) => void;
}
