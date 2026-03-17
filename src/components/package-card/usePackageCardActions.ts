import { useCatalogDispatch } from '../../utils/catalogStore';
import usePackageInstallerActions from '../../utils/usePackageInstallerActions';
import type { PackageCardItem, PackageCardProgressView, UsePackageCardActionsResult } from './types';

export default function usePackageCardActions(item: PackageCardItem): UsePackageCardActionsResult {
  const dispatch = useCatalogDispatch();
  const { error, setError, busyAction, isBusy, progress, onDownload, onUpdate, onRemove } = usePackageInstallerActions({
    item,
    dispatch,
    missingInstallerMessage: 'インストーラーがありません',
  });
  const progressView: PackageCardProgressView = {
    ratio: progress.ratio ?? 0,
    label: progress.label ?? '準備中…',
  };

  return {
    error,
    setError,
    busyAction,
    isBusy,
    progress: progressView,
    onDownload,
    onUpdate,
    onRemove,
  };
}
