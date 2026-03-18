import { memo, useMemo } from 'react';
import SelectableChipInput from '../components/SelectableChipInput';
import { PRIMARY_PACKAGE_TYPES } from '@/utils/query';

interface PackageTypeEditorProps {
  value: string;
  onChange?: (next: string) => void;
}

const PACKAGE_TYPE_SUGGESTIONS = PRIMARY_PACKAGE_TYPES.map((entry) => entry.label);

const PackageTypeEditor = memo(function PackageTypeEditor({ value, onChange }: PackageTypeEditorProps) {
  const normalizedValue = String(value || '').trim();
  const selectedValues = useMemo(() => (normalizedValue ? [normalizedValue] : []), [normalizedValue]);

  return (
    <SelectableChipInput
      label="種類"
      inputId="package-type"
      inputName="type"
      values={selectedValues}
      suggestions={PACKAGE_TYPE_SUGGESTIONS}
      suggestionsLabel="種類一覧"
      onChange={(next) => onChange?.(next[0] || '')}
      inputAriaLabel="種類を入力"
      placeholder="種類を入力または一覧から選択"
      helperText="一覧から選択できます。候補にない種類は手入力で追加できます。"
      required
      multiple={false}
      commitOnBlur
    />
  );
});

export default PackageTypeEditor;
