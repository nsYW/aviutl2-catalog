/**
 * パッケージ基本情報登録セクションのコンポーネント
 */
import type { RegisterMetaSectionProps } from '../types';
import PackageTypeEditor from './PackageTypeEditor';
import TagEditor from './TagEditor';
import { grid, layout, surface, text } from '@/components/ui/_styles';

export default function RegisterMetaSection({
  packageForm,
  initialTags,
  tagCandidates,
  onUpdatePackageField,
  onTagsChange,
}: RegisterMetaSectionProps) {
  return (
    <section className={surface.cardSection}>
      <div className={layout.rowBetweenWrapGap2}>
        <h2 className={text.titleLg}>基本情報</h2>
      </div>
      <div className="grid gap-6">
        <div className={grid.twoColWideGap}>
          <div className="space-y-2">
            <label className={text.labelSm} htmlFor="package-id">
              ID <span className="text-red-500">*</span>
            </label>
            <input
              id="package-id"
              name="id"
              value={packageForm.id}
              onChange={(e) => onUpdatePackageField('id', e.target.value)}
              required
              placeholder="Kenkun.AviUtlExEdit2"
            />
            <p className={text.mutedXs}>作者名.パッケージ名 の形式で入力してください。英数字と記号 ( . - _ ) のみ</p>
          </div>
          <div className="space-y-2">
            <label className={text.labelSm} htmlFor="package-name">
              パッケージ名 <span className="text-red-500">*</span>
            </label>
            <input
              id="package-name"
              name="name"
              value={packageForm.name}
              onChange={(e) => onUpdatePackageField('name', e.target.value)}
              required
              placeholder="AviUtl2"
            />
          </div>
        </div>

        <div className={grid.twoColWideGap}>
          <div className="space-y-2">
            <label className={text.labelSm} htmlFor="package-author">
              作者名 <span className="text-red-500">*</span>
            </label>
            <input
              id="package-author"
              name="author"
              value={packageForm.author}
              onChange={(e) => onUpdatePackageField('author', e.target.value)}
              required
              placeholder="KENくん"
            />
          </div>
          <div className="space-y-2">
            <label className={text.labelSm} htmlFor="package-original-author">
              オリジナル作者名 (任意)
            </label>
            <input
              id="package-original-author"
              name="originalAuthor"
              value={packageForm.originalAuthor}
              onChange={(e) => onUpdatePackageField('originalAuthor', e.target.value)}
              placeholder="オリジナル版がある場合に入力"
            />
          </div>
          <div className="md:col-span-2">
            <PackageTypeEditor value={packageForm.type} onChange={(value) => onUpdatePackageField('type', value)} />
          </div>
          <div className="space-y-2">
            <label className={text.labelSm} htmlFor="package-repo-url">
              パッケージのサイト <span className="text-red-500">*</span>
            </label>
            <input
              id="package-repo-url"
              name="repoURL"
              value={packageForm.repoURL}
              onChange={(e) => onUpdatePackageField('repoURL', e.target.value)}
              placeholder="パッケージのことが分かるURL"
              type="url"
              required
            />
          </div>
          <div className="space-y-2">
            <label className={text.labelSm} htmlFor="package-niconi-commons-id">
              ニコニ・コモンズID (任意)
            </label>
            <input
              id="package-niconi-commons-id"
              name="niconiCommonsId"
              value={packageForm.niconiCommonsId}
              onChange={(e) => onUpdatePackageField('niconiCommonsId', e.target.value)}
              placeholder=""
            />
          </div>
        </div>

        <div className={grid.twoColWideGap}>
          <div className="space-y-2">
            <label className={text.labelSm} htmlFor="package-dependencies">
              依存パッケージ (現在非対応)
            </label>
            <input
              id="package-dependencies"
              name="dependencies"
              value={packageForm.dependenciesText}
              onChange={(e) => onUpdatePackageField('dependenciesText', e.target.value)}
              placeholder="パッケージID (カンマ区切り)"
            />
          </div>
        </div>

        <TagEditor initialTags={initialTags} suggestions={tagCandidates} onChange={onTagsChange} />
      </div>
    </section>
  );
}
