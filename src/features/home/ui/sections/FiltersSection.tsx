import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpDown,
  CalendarClock,
  CalendarPlus,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Crown,
  Filter,
  Layers,
  Search,
  Tags,
  TrendingUp,
  X,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import type { FiltersSectionProps } from '../types';
import {
  DEPRECATION_STATUS_LABELS,
  DEPRECATION_STATUS_OPTIONS,
  INSTALL_STATUS_LABELS,
  INSTALL_STATUS_OPTIONS,
  SORT_OPTIONS,
  SORT_OPTION_LABELS,
} from '@/layouts/app-shell/constants';
import { cn } from '@/lib/cn';
import { layout, state, surface } from '@/components/ui/_styles';

function renderInstallStatusIcon(status: FiltersSectionProps['installStatus'], tone: 'accent' | 'neutral' = 'neutral') {
  if (status === 'installed') {
    return tone === 'accent' ? (
      <CheckCircle2
        size={16}
        className="fill-emerald-600/20 text-emerald-600 dark:fill-emerald-300/20 dark:text-emerald-300"
      />
    ) : (
      <CheckCircle2 size={16} className="fill-slate-600/10 text-slate-600 dark:fill-slate-300/10 dark:text-slate-300" />
    );
  }

  if (status === 'not_installed') {
    return <Circle size={16} className="text-slate-600 dark:text-slate-300" />;
  }

  return <ArrowDownToLine size={16} className="text-slate-600 dark:text-slate-300" />;
}

function renderDeprecationStatusIcon(
  status: FiltersSectionProps['deprecationStatus'],
  tone: 'accent' | 'neutral' = 'neutral',
) {
  if (status === 'deprecated') {
    return (
      <AlertTriangle
        size={16}
        className={tone === 'accent' ? 'text-yellow-600 dark:text-yellow-300' : 'text-slate-600 dark:text-slate-300'}
      />
    );
  }

  if (status === 'active') {
    return (
      <CheckCircle2
        size={16}
        className={
          tone === 'accent'
            ? 'fill-slate-700/10 text-slate-700 dark:fill-slate-200/10 dark:text-slate-200'
            : 'fill-slate-600/10 text-slate-600 dark:fill-slate-300/10 dark:text-slate-300'
        }
      />
    );
  }

  return (
    <AlertTriangle
      size={16}
      className={
        tone === 'accent'
          ? 'fill-slate-700/10 text-slate-700 dark:fill-slate-200/10 dark:text-slate-200'
          : 'fill-slate-600/10 text-slate-600 dark:fill-slate-300/10 dark:text-slate-300'
      }
    />
  );
}

function renderSortOrderIcon(status: FiltersSectionProps['sortOrder'], tone: 'accent' | 'neutral' = 'neutral') {
  const className = tone === 'accent' ? 'text-slate-700 dark:text-slate-200' : 'text-slate-600 dark:text-slate-300';
  if (status === 'popularity_desc') return <Crown size={16} className={className} />;
  if (status === 'trend_desc') return <TrendingUp size={16} className={className} />;
  if (status === 'added_desc') return <CalendarPlus size={16} className={className} />;
  return <CalendarClock size={16} className={className} />;
}

export default function FiltersSection({
  searchQuery,
  categories,
  selectedCategory,
  filteredCount,
  installStatus,
  deprecationStatus,
  selectedTags,
  sortedSelectedTags,
  sortedAllTags,
  isFilterExpanded,
  isInstallMenuOpen,
  isDeprecationMenuOpen,
  isSortMenuOpen,
  sortOrder,
  onSearchQueryChange,
  onCategoryChange,
  onToggleInstallMenu,
  onCloseInstallMenu,
  onSelectInstallStatus,
  onToggleDeprecationMenu,
  onCloseDeprecationMenu,
  onSelectDeprecationStatus,
  onToggleFilterExpanded,
  onToggleSortMenu,
  onCloseSortMenu,
  onSelectSortOrder,
  onToggleTag,
  onClearTags,
}: FiltersSectionProps) {
  const installButtonLabel = INSTALL_STATUS_LABELS[installStatus];
  const installButtonVariant =
    installStatus === 'installed' ? 'accentEmerald' : installStatus === 'not_installed' ? 'muted' : 'secondary';
  const neutralControlTextClass = 'text-slate-600 dark:text-slate-300';
  const dropdownPanelClass = cn(
    surface.baseMuted,
    state.enterZoomIn95,
    'absolute right-0 top-full z-20 mt-2 flex w-max flex-col origin-top-right rounded-xl bg-white py-1 shadow-xl duration-100 dark:bg-slate-900',
  );
  const dropdownItemBaseClass =
    'w-full cursor-pointer px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800';
  const dropdownItemSelectedClass = 'bg-slate-100 font-bold text-slate-800 dark:bg-slate-800/80 dark:text-slate-100';
  const installButtonTextClass =
    installStatus === 'installed' ? 'text-emerald-600 dark:text-emerald-300' : neutralControlTextClass;
  const deprecationButtonLabel = DEPRECATION_STATUS_LABELS[deprecationStatus];
  const deprecationButtonClass =
    deprecationStatus === 'deprecated'
      ? 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100 dark:border-yellow-800/60 dark:bg-yellow-950/30 dark:hover:bg-yellow-950/45'
      : neutralControlTextClass;
  const deprecationButtonTextClass =
    deprecationStatus === 'deprecated' ? 'text-yellow-600 dark:text-yellow-300' : neutralControlTextClass;
  const selectedSortLabel = SORT_OPTION_LABELS[sortOrder];

  return (
    <div className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all">
      <div className="px-6 py-3">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[8rem] max-w-2xl flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="パッケージ名、作者、キーワードで検索..."
                className="w-full rounded-lg border border-slate-200/80 bg-white/95 py-2 pl-10 pr-10 text-sm text-slate-900 shadow-sm outline-none transition-all placeholder-slate-500 focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400"
                value={searchQuery}
                onChange={(event) => onSearchQueryChange(event.target.value)}
              />
              {searchQuery ? (
                <button
                  onClick={() => onSearchQueryChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                  type="button"
                >
                  <X size={14} />
                </button>
              ) : null}
            </div>

            <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
              <div
                className={cn(
                  layout.inlineGap1_5,
                  'shrink-0 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400',
                )}
              >
                <Filter size={14} className="opacity-70" />
                <span>絞り込み</span>
              </div>
              <div className="relative">
                <Button
                  onClick={onToggleInstallMenu}
                  variant={installButtonVariant}
                  size="actionSm"
                  className="cursor-pointer whitespace-nowrap"
                  type="button"
                >
                  {renderInstallStatusIcon(installStatus, installStatus === 'installed' ? 'accent' : 'neutral')}
                  <span className={cn('text-sm font-medium', installButtonTextClass)}>{installButtonLabel}</span>
                  <ChevronDown size={14} />
                </Button>
                {isInstallMenuOpen ? (
                  <>
                    <button
                      type="button"
                      aria-label="インストール状態メニューを閉じる"
                      className="fixed inset-0 z-10"
                      onClick={onCloseInstallMenu}
                    />
                    <div className={dropdownPanelClass}>
                      {INSTALL_STATUS_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => onSelectInstallStatus(option.value)}
                          className={cn(
                            dropdownItemBaseClass,
                            installStatus === option.value ? dropdownItemSelectedClass : neutralControlTextClass,
                          )}
                          type="button"
                        >
                          <span className="flex items-center gap-2">
                            {renderInstallStatusIcon(option.value)}
                            <span>{option.label}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>

              <div className="relative">
                <Button
                  onClick={onToggleDeprecationMenu}
                  variant="secondary"
                  size="actionSm"
                  className={cn('cursor-pointer whitespace-nowrap', deprecationButtonClass)}
                  type="button"
                >
                  {renderDeprecationStatusIcon(deprecationStatus, 'accent')}
                  <span className={cn('text-sm font-medium', deprecationButtonTextClass)}>
                    {deprecationButtonLabel}
                  </span>
                  <ChevronDown size={14} />
                </Button>
                {isDeprecationMenuOpen ? (
                  <>
                    <button
                      type="button"
                      aria-label="廃止状態メニューを閉じる"
                      className="fixed inset-0 z-10"
                      onClick={onCloseDeprecationMenu}
                    />
                    <div className={dropdownPanelClass}>
                      {DEPRECATION_STATUS_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => onSelectDeprecationStatus(option.value)}
                          className={cn(
                            dropdownItemBaseClass,
                            deprecationStatus === option.value ? dropdownItemSelectedClass : neutralControlTextClass,
                          )}
                          type="button"
                        >
                          <span className="flex items-center gap-2">
                            {renderDeprecationStatusIcon(option.value)}
                            <span>{option.label}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>

              <Button
                onClick={onToggleFilterExpanded}
                variant={isFilterExpanded || selectedTags.length > 0 ? 'accentBlue' : 'secondary'}
                size="actionSm"
                className={cn('cursor-pointer whitespace-nowrap', neutralControlTextClass)}
                type="button"
              >
                <Filter size={16} className={neutralControlTextClass} />
                <span className={cn('text-sm font-medium', neutralControlTextClass)}>タグ絞り込み</span>
                {selectedTags.length > 0 ? (
                  <span
                    className={cn(
                      layout.center,
                      'ml-1 h-5 w-5 rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm',
                    )}
                  >
                    {selectedTags.length}
                  </span>
                ) : null}
                {isFilterExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </Button>
            </div>
          </div>

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

          {!isFilterExpanded && selectedTags.length > 0 ? (
            <div className={cn(layout.wrapItemsGap2, 'mt-4 animate-in slide-in-from-top-1')}>
              <span className="text-sm font-medium text-slate-400">選択中:</span>
              {sortedSelectedTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onToggleTag(tag)}
                  className={cn(
                    layout.inlineGap1_5,
                    'cursor-pointer rounded-md border border-blue-100 bg-blue-50 px-3 py-1 text-sm text-blue-600 transition-colors hover:bg-blue-100 dark:border-blue-800/50 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/40',
                  )}
                  type="button"
                >
                  {tag}
                  <X size={14} />
                </button>
              ))}
              <button
                onClick={onClearTags}
                className="ml-2 cursor-pointer text-sm text-slate-400 underline decoration-slate-300 underline-offset-2 hover:text-slate-600 dark:hover:text-slate-300"
                type="button"
              >
                すべてクリア
              </button>
            </div>
          ) : null}

          {isFilterExpanded ? (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2 border-t border-slate-100 pt-4 duration-200 dark:border-slate-800">
              <div className={cn(layout.rowBetween, 'mb-3')}>
                <div className={cn(layout.inlineGap1_5, 'text-slate-500 dark:text-slate-400')}>
                  <Tags size={14} />
                  <span className="text-sm font-bold uppercase tracking-wider">すべてのタグ</span>
                </div>
                {selectedTags.length > 0 ? (
                  <button
                    onClick={onClearTags}
                    className="cursor-pointer text-sm font-medium text-red-500 hover:text-red-600"
                    type="button"
                  >
                    選択をクリア
                  </button>
                ) : null}
              </div>

              <div className="custom-scrollbar flex max-h-[60vh] flex-wrap gap-2 overflow-y-auto pr-2">
                {sortedAllTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onToggleTag(tag)}
                    className={cn(
                      'cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                      selectedTags.includes(tag)
                        ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-700/50',
                    )}
                    type="button"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
