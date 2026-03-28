import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import Button from '@/components/ui/Button';
import { layout } from '@/components/ui/_styles';
import {
  DEPRECATION_STATUS_LABELS,
  DEPRECATION_STATUS_OPTIONS,
  INSTALL_STATUS_LABELS,
  INSTALL_STATUS_OPTIONS,
} from '@/layouts/app-shell/constants';
import { cn } from '@/lib/cn';
import { renderDeprecationStatusIcon, renderInstallStatusIcon } from '../../filterIcons';
import {
  dropdownItemBaseClass,
  dropdownItemSelectedClass,
  dropdownPanelClass,
  neutralControlTextClass,
} from '../../filterStyles';
import type { HomeQuickFiltersRowProps } from '../../types';

export default function HomeQuickFiltersRow({
  installStatus,
  deprecationStatus,
  selectedTags,
  isFilterExpanded,
  isInstallMenuOpen,
  isDeprecationMenuOpen,
  onToggleInstallMenu,
  onCloseInstallMenu,
  onSelectInstallStatus,
  onToggleDeprecationMenu,
  onCloseDeprecationMenu,
  onSelectDeprecationStatus,
  onToggleFilterExpanded,
}: HomeQuickFiltersRowProps) {
  const installButtonLabel = INSTALL_STATUS_LABELS[installStatus];
  const installButtonVariant =
    installStatus === 'installed' ? 'accentEmerald' : installStatus === 'not_installed' ? 'muted' : 'secondary';
  const installButtonTextClass =
    installStatus === 'installed' ? 'text-emerald-600 dark:text-emerald-300' : neutralControlTextClass;
  const deprecationButtonLabel = DEPRECATION_STATUS_LABELS[deprecationStatus];
  const deprecationButtonClass =
    deprecationStatus === 'deprecated'
      ? 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100 dark:border-yellow-800/60 dark:bg-yellow-950/30 dark:hover:bg-yellow-950/45'
      : neutralControlTextClass;
  const deprecationButtonTextClass =
    deprecationStatus === 'deprecated' ? 'text-yellow-600 dark:text-yellow-300' : neutralControlTextClass;

  return (
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
          <span className={cn('text-sm font-medium', deprecationButtonTextClass)}>{deprecationButtonLabel}</span>
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
  );
}
