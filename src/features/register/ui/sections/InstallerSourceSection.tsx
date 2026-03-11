/**
 * インストーラーのソースコンポーネント
 */
import { Alert } from '@/components/ui/Alert';
import Button, { buttonVariants } from '@/components/ui/Button';
import { ExternalLink } from 'lucide-react';
import { INSTALLER_SOURCES } from '../../model/form';
import type { PackageInstallerSectionProps } from '../types';
import { action, grid, layout, surface, text } from '@/components/ui/_styles';
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

const autoUpdateStatusUrl =
  'https://github.com/Neosku/aviutl2-catalog-data/blob/main/%E3%83%91%E3%83%83%E3%82%B1%E3%83%BC%E3%82%B8.md';

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
        <div className={cn(action.segmentedGroup, 'flex flex-wrap gap-1')}>
          {INSTALLER_SOURCES.map((option) => {
            const isActive = installer.sourceType === option.value;
            return (
              <Button
                variant="plain"
                size="xs"
                key={option.value}
                type="button"
                className={cn(
                  action.segmentedOptionBase,
                  'flex-1',
                  isActive ? action.segmentedOptionActive : action.segmentedOptionInactive,
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
          <div className="space-y-4">
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

            <div className={cn(surface.panelRoundedSubtle, 'space-y-3 p-3')}>
              <p className={text.bodySmMuted}>
                GitHub Release を利用しているパッケージは、`.exe`
                形式など一部の配布形態を除き、管理側で自動更新プログラムの対象に追加いたします。自動更新プログラムでは
                30
                分ごとに更新を確認し、更新があればカタログデータを更新します。対象への追加は管理側で順次手動対応しています。
              </p>
              <a
                className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'w-fit')}
                href={autoUpdateStatusUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                <ExternalLink size={14} />
                自動更新対応状況
              </a>
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
