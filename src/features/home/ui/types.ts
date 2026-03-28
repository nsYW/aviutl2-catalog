import type { PackageItem } from '@/utils/catalogStore';
import type {
  HomeContextValue,
  HomeDeprecationStatus,
  HomeInstallStatus,
  HomeSortOrder,
} from '@/layouts/app-shell/types';

export type { HomeContextValue, HomeDeprecationStatus, HomeInstallStatus, HomeSortOrder };

export interface FiltersSectionProps {
  searchQuery: string;
  categories: string[];
  selectedCategory: string;
  filteredCount: number;
  installStatus: HomeInstallStatus;
  deprecationStatus: HomeDeprecationStatus;
  selectedTags: string[];
  sortedSelectedTags: string[];
  sortedAllTags: string[];
  isFilterExpanded: boolean;
  isInstallMenuOpen: boolean;
  isDeprecationMenuOpen: boolean;
  isSortMenuOpen: boolean;
  sortOrder: HomeSortOrder;
  onSearchQueryChange: (next: string) => void;
  onCategoryChange: (category: string) => void;
  onToggleInstallMenu: () => void;
  onCloseInstallMenu: () => void;
  onSelectInstallStatus: (status: HomeInstallStatus) => void;
  onToggleDeprecationMenu: () => void;
  onCloseDeprecationMenu: () => void;
  onSelectDeprecationStatus: (status: HomeDeprecationStatus) => void;
  onToggleFilterExpanded: () => void;
  onToggleSortMenu: () => void;
  onCloseSortMenu: () => void;
  onSelectSortOrder: (order: HomeSortOrder) => void;
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
}

export interface PackageGridSectionProps {
  filteredPackages: PackageItem[];
  pausedPackageUpdatesLoaded: boolean;
  pausedPackageUpdateIds: ReadonlySet<string>;
  listSearch: string;
  onBeforeOpenDetail: () => void;
}

export interface EmptyStateSectionProps {
  onClearConditions: () => void;
}
