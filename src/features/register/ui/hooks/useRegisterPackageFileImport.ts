import { useCallback, useState } from 'react';
import * as tauriDialog from '@tauri-apps/plugin-dialog';
import {
  buildAu2pkgInstallSteps,
  buildAu2pkgUninstallSteps,
  collectAu2pkgEntries,
  isAu2pkgFileName,
  summarizeAu2pkgFiles,
} from '../../model/au2pkg';
import { basename, generateKey, getErrorMessage } from '../../model/helpers';
import type { Au2pkgImportSummary } from '../../model/au2pkg';
import type { RegisterInstallStep, RegisterUninstallStep } from '../../model/types';
import { ipc } from '@/utils/invokeIpc';

interface UseRegisterPackageFileImportArgs {
  replaceInstallSteps: (steps: RegisterInstallStep[]) => void;
  replaceUninstallSteps: (steps: RegisterUninstallStep[]) => void;
}

function toKeyedInstallSteps(steps: ReturnType<typeof buildAu2pkgInstallSteps>): RegisterInstallStep[] {
  return steps.map((step) => ({ key: generateKey(), ...step }));
}

function toKeyedUninstallSteps(steps: ReturnType<typeof buildAu2pkgUninstallSteps>): RegisterUninstallStep[] {
  return steps.map((step) => ({ key: generateKey(), ...step }));
}

function toFriendlyErrorMessage(error: unknown): string {
  const rawMessage = getErrorMessage(error);
  if (/module/i.test(rawMessage)) {
    return 'パッケージファイル取込機能を利用できません。';
  }
  return rawMessage || 'パッケージファイルの解析に失敗しました。';
}

export default function useRegisterPackageFileImport({
  replaceInstallSteps,
  replaceUninstallSteps,
}: UseRegisterPackageFileImportArgs) {
  const [selectedPackageFileName, setSelectedPackageFileName] = useState('');
  const [packageFileSummary, setPackageFileSummary] = useState<Au2pkgImportSummary | null>(null);
  const [packageFileError, setPackageFileError] = useState('');
  const [packageFileImporting, setPackageFileImporting] = useState(false);

  const importPackageFileFromPath = useCallback(
    async (selectedPath: string) => {
      const normalizedPath = String(selectedPath || '').trim();
      if (!normalizedPath) return;

      setPackageFileImporting(true);
      setPackageFileError('');
      try {
        if (!isAu2pkgFileName(normalizedPath)) {
          throw new Error('`.au2pkg.zip` 形式のファイルを選択してください。該当しない場合は手順を手入力してください。');
        }
        const entries = await ipc.listZipEntries({ zipPath: normalizedPath });
        const files = collectAu2pkgEntries(entries);
        if (!files.length) {
          throw new Error('対応ディレクトリ配下にコピー対象ファイルがありませんでした。');
        }
        replaceInstallSteps(toKeyedInstallSteps(buildAu2pkgInstallSteps(files)));
        replaceUninstallSteps(toKeyedUninstallSteps(buildAu2pkgUninstallSteps(files)));
        setSelectedPackageFileName(basename(normalizedPath));
        setPackageFileSummary(summarizeAu2pkgFiles(files));
      } catch (error) {
        setPackageFileError(toFriendlyErrorMessage(error));
      } finally {
        setPackageFileImporting(false);
      }
    },
    [replaceInstallSteps, replaceUninstallSteps],
  );

  const handleSelectPackageFile = useCallback(async () => {
    try {
      const selection = await tauriDialog.open({
        multiple: false,
        title: 'パッケージファイル(.au2pkg.zip)を選択',
      });
      const selectedPath = Array.isArray(selection) ? selection[0] : selection;
      if (!selectedPath || typeof selectedPath !== 'string') return;
      await importPackageFileFromPath(selectedPath);
    } catch (error) {
      setPackageFileError(toFriendlyErrorMessage(error));
    }
  }, [importPackageFileFromPath]);

  const resetPackageFileImport = useCallback(() => {
    setSelectedPackageFileName('');
    setPackageFileSummary(null);
    setPackageFileError('');
    setPackageFileImporting(false);
  }, []);

  return {
    selectedPackageFileName,
    packageFileSummary,
    packageFileError,
    packageFileImporting,
    handleSelectPackageFile,
    resetPackageFileImport,
  };
}
