/**
 * インストーラーのソースコンポーネント
 */
import { Alert } from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import { INSTALLER_SOURCES } from '../../model/form';
import type { PackageInstallerSectionProps } from '../types';
import { grid, layout, surface, text } from '@/components/ui/_styles';
import { cn } from '@/lib/cn';

type InstallerSourceSectionProps = Pick<
  PackageInstallerSectionProps,
  | 'installer'
  | 'updateInstallerField'
  | 'packageFileName'
  | 'packageFileSummary'
  | 'packageFileError'
  | 'packageFileImporting'
  | 'onSelectPackageFile'
>;

export default function InstallerSourceSection({
  installer,
  updateInstallerField,
  packageFileName,
  packageFileSummary,
  packageFileError,
  packageFileImporting,
  onSelectPackageFile,
}: InstallerSourceSectionProps) {
  const packageFileSummaryText = packageFileSummary
    ? packageFileSummary.groups.map((group) => `${group.root}: ${group.count}件`).join(' / ')
    : '';

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className={text.labelSm}>ダウンロード元</div>
        <div className={cn(surface.panelSubtle, 'flex flex-wrap gap-1 p-1')}>
          {INSTALLER_SOURCES.map((option) => {
            const isActive = installer.sourceType === option.value;
            return (
              <Button
                variant="plain"
                size="xs"
                key={option.value}
                type="button"
                className={cn(
                  'flex-1 transition-all',
                  isActive
                    ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-800 dark:text-blue-400'
                    : 'text-slate-600 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50',
                )}
                onClick={() => updateInstallerField('sourceType', option.value)}
              >
                {option.label}
              </Button>
            );
          })}
        </div>
      </div>
      <div className={cn(surface.panel, 'p-4')}>
        {installer.sourceType === 'direct' && (
          <div className="space-y-2">
            <label className={text.labelSm} htmlFor="installer-direct-url">
              ダウンロードURL
            </label>
            <input
              id="installer-direct-url"
              value={installer.directUrl}
              onChange={(e) => updateInstallerField('directUrl', e.target.value)}
              placeholder="https://example.com/plugin.zip"
            />
          </div>
        )}
        {installer.sourceType === 'booth' && (
          <div className="space-y-2">
            <label className={text.labelSm} htmlFor="installer-booth-url">
              BOOTH URL
            </label>
            <input
              id="installer-booth-url"
              value={installer.boothUrl}
              onChange={(e) => updateInstallerField('boothUrl', e.target.value)}
              placeholder="https://booth.pm/downloadables/...で始まるパス"
            />
          </div>
        )}
        {installer.sourceType === 'github' && (
          <div className={grid.twoCol}>
            <div className="space-y-2">
              <label className={text.labelSm} htmlFor="installer-github-owner">
                GitHub ID (Owner)
              </label>
              <input
                id="installer-github-owner"
                value={installer.githubOwner}
                onChange={(e) => updateInstallerField('githubOwner', e.target.value)}
                placeholder="例: neosku"
              />
            </div>
            <div className="space-y-2">
              <label className={text.labelSm} htmlFor="installer-github-repo">
                レポジトリ名 (Repo)
              </label>
              <input
                id="installer-github-repo"
                value={installer.githubRepo}
                onChange={(e) => updateInstallerField('githubRepo', e.target.value)}
                placeholder="例: aviutl2-catalog"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className={text.labelSm} htmlFor="installer-github-pattern">
                正規表現パターン
              </label>
              <input
                id="installer-github-pattern"
                value={installer.githubPattern}
                onChange={(e) => updateInstallerField('githubPattern', e.target.value)}
                placeholder="^aviutl_plugin_.*\.zip$"
              />
              <p className={text.mutedXs}>リリースファイル名に一致する正規表現を指定してください。</p>
            </div>
          </div>
        )}
        {installer.sourceType === 'GoogleDrive' && (
          <div className="space-y-2">
            <label className={text.labelSm} htmlFor="installer-google-drive-id">
              ファイルID
            </label>
            <input
              id="installer-google-drive-id"
              value={installer.googleDriveId}
              onChange={(e) => updateInstallerField('googleDriveId', e.target.value)}
              placeholder="Google Drive の共有リンクに含まれるID（…/drive/folders/{フォルダID}）"
            />
          </div>
        )}
      </div>
      <div className={cn(surface.panelSubtle, 'space-y-3 p-4')}>
        <div className="space-y-1">
          <div className={text.labelSm}>パッケージファイル ( .au2pkg.zip )</div>
          <p className={text.bodySmMuted}>
            '.au2pkg.zip'形式のファイルからインストール手順を生成します。
            該当しない場合は、以下の手順欄に手動で入力してください。
          </p>
        </div>
        <div className={layout.wrapItemsGap2}>
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={onSelectPackageFile}
            disabled={packageFileImporting}
          >
            {packageFileImporting ? '解析中...' : 'ファイルを選択'}
          </Button>
          {packageFileName && <span className={text.bodySmMuted}>{packageFileName}</span>}
        </div>
        {packageFileSummary && (
          <div className={cn(surface.panelRoundedSubtle, 'space-y-1 p-3')}>
            <div className={text.labelXsSemibold}>生成対象</div>
            <p className={text.bodySmMuted}>
              {packageFileSummary.totalFiles}件のファイルから手順を生成しました
              {packageFileSummaryText ? ` (${packageFileSummaryText})` : ''}
            </p>
          </div>
        )}
        {packageFileError && <Alert variant="danger">{packageFileError}</Alert>}
      </div>
    </div>
  );
}
