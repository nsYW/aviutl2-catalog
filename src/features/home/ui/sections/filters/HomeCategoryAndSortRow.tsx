import { ArrowUpDown, ChevronDown, Layers } from 'lucide-react';
import Button from '@/components/ui/Button';
import { layout, surface } from '@/components/ui/_styles';
import { SORT_OPTIONS, SORT_OPTION_LABELS } from '@/layouts/app-shell/constants';
import { cn } from '@/lib/cn';
import { renderSortOrderIcon } from '../../filterIcons';
import {
  dropdownItemBaseClass,
  dropdownItemSelectedClass,
  dropdownPanelClass,
  neutralControlTextClass,
} from '../../filterStyles';
import type { HomeCategorySortRowProps } from '../../types';

export default function HomeCategoryAndSortRow({
  categories,
  selectedCategory,
  filteredCount,
  isSortMenuOpen,
  sortOrder,
  onCategoryChange,
  onToggleSortMenu,
  onCloseSortMenu,
  onSelectSortOrder,
}: HomeCategorySortRowProps) {
  const selectedSortLabel = SORT_OPTION_LABELS[sortOrder];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className={cn(layout.inlineGap2, 'max-w-full overflow-hidden')}>
        <div
          className={cn(
            layout.inlineGap1_5,
            'shrink-0 select-none text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400',
          )}
        >
          <Layers size={14} className="opacity-70" />
          <span>種類</span>
        </div>
        <div
          className={cn(
            surface.panelLgSubtle,
            'flex min-w-0 flex-1 items-center gap-1 overflow-x-auto bg-slate-200/50 p-1 scrollbar-hide dark:bg-slate-800/50',
          )}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={cn(
                'cursor-pointer whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-all',
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-300/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-200',
              )}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
        <div
          className={cn(
            surface.panelLg,
            'flex h-[38px] min-w-[4rem] items-baseline justify-center bg-slate-100 px-3 py-2 dark:bg-slate-800',
          )}
        >
          <span className={cn('text-lg font-black leading-none tabular-nums', neutralControlTextClass)}>
            {filteredCount}
          </span>
          <span className={cn('ml-1 text-xs font-bold', neutralControlTextClass)}>件</span>
        </div>

        <div
          className={cn(
            layout.inlineGap1_5,
            'shrink-0 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400',
          )}
        >
          <ArrowUpDown size={14} className="opacity-70" />
          <span>並び替え</span>
        </div>
        <div className="relative">
          <Button
            onClick={onToggleSortMenu}
            variant="secondary"
            size="actionSm"
            className={cn('cursor-pointer whitespace-nowrap', neutralControlTextClass)}
            title="並び替え"
            type="button"
          >
            {renderSortOrderIcon(sortOrder, 'accent')}
            <span className={cn('text-sm font-medium', neutralControlTextClass)}>{selectedSortLabel}</span>
            <ChevronDown size={14} />
          </Button>
          {isSortMenuOpen ? (
            <>
              <button
                type="button"
                aria-label="並び替えメニューを閉じる"
                className="fixed inset-0 z-10"
                onClick={onCloseSortMenu}
              />
              <div className={dropdownPanelClass}>
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onSelectSortOrder(option.value)}
                    className={cn(
                      dropdownItemBaseClass,
                      sortOrder === option.value ? dropdownItemSelectedClass : neutralControlTextClass,
                    )}
                    type="button"
                  >
                    <span className="flex items-center gap-2">
                      {renderSortOrderIcon(option.value)}
                      <span>{option.label}</span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
