import { memo } from 'react';
import type { TagEditorProps } from '../types';
import SelectableChipInput from '../components/SelectableChipInput';

const EMPTY_SUGGESTIONS: string[] = [];

const TagEditor = memo(function TagEditor({ initialTags, suggestions, onChange }: TagEditorProps) {
  const resolvedSuggestions = suggestions ?? EMPTY_SUGGESTIONS;

  return (
    <SelectableChipInput
      label="タグ"
      inputId="tags-input"
      inputName="tags"
      values={initialTags}
      suggestions={resolvedSuggestions}
      suggestionsLabel="既存タグ"
      onChange={onChange}
      inputAriaLabel="タグを入力"
      placeholder="タグを入力 (Enterで追加)"
      helperText="既存タグから選択できます。候補にないタグは手入力で追加できます。"
    />
  );
});

export default TagEditor;
