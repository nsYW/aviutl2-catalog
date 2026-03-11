import type { MarkdownExit, RuleBlock } from 'markdown-exit';

const DETAILS_OPEN_RE = /^<details\b[^>]*>/i;
const DETAILS_OPEN_LINE_RE = /^<details\b[^>]*>\s*$/i;
const DETAILS_CLOSE_LINE_RE = /^<\/details>\s*$/i;
const SUMMARY_RE = /^\s*(<summary\b[^>]*>[\s\S]*?<\/summary>)([\s\S]*)$/i;

type FenceState = {
  marker: '`' | '~';
  length: number;
};

function pushHtmlBlockToken(state: Parameters<RuleBlock>[0], startLine: number, endLine: number, content: string) {
  const token = state.push('html_block', '', 0);
  token.map = [startLine, endLine];
  token.content = content;
  return token;
}

function getLineText(state: Parameters<RuleBlock>[0], line: number): string {
  const pos = state.bMarks[line] + state.tShift[line];
  const max = state.eMarks[line];
  return state.src.slice(pos, max);
}

function getFenceStart(lineText: string): FenceState | null {
  const match = /^(?<markup>`{3,}|~{3,})(?<params>.*)$/.exec(lineText);
  if (!match?.groups) return null;

  const { markup, params } = match.groups;
  const marker = markup[0] as FenceState['marker'];
  if (marker === '`' && params.includes('`')) return null;

  return {
    marker,
    length: markup.length,
  };
}

function isFenceEnd(lineText: string, fence: FenceState): boolean {
  const match = new RegExp(`^\\${fence.marker}{${fence.length},}\\s*$`).exec(lineText);
  return Boolean(match);
}

function findDetailsEndLine(state: Parameters<RuleBlock>[0], startLine: number, endLine: number): number {
  let depth = 0;
  let fence: FenceState | null = null;

  for (let line = startLine; line < endLine; line += 1) {
    const lineText = getLineText(state, line);

    if (fence) {
      if (isFenceEnd(lineText, fence)) {
        fence = null;
      }
      continue;
    }

    const nextFence = getFenceStart(lineText);
    if (nextFence) {
      fence = nextFence;
      continue;
    }

    if (DETAILS_OPEN_LINE_RE.test(lineText)) {
      depth += 1;
      continue;
    }
    if (DETAILS_CLOSE_LINE_RE.test(lineText)) {
      depth -= 1;
      if (depth === 0) return line + 1;
    }
  }

  return -1;
}

const detailsBlockRule: RuleBlock = (state, startLine, endLine, silent) => {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  const max = state.eMarks[startLine];

  if (state.sCount[startLine] - state.blkIndent >= 4) return false;
  if (!state.md.options.html) return false;
  if (state.src.charCodeAt(pos) !== 0x3c) return false;

  const lineText = state.src.slice(pos, max);
  if (!DETAILS_OPEN_LINE_RE.test(lineText)) return false;

  const nextLine = findDetailsEndLine(state, startLine, endLine);
  if (nextLine < 0) return false;
  if (silent) return true;

  const block = state.getLines(startLine, nextLine, state.blkIndent, true);
  const openTagMatch = DETAILS_OPEN_RE.exec(block);
  const closeTagIndex = block.toLowerCase().lastIndexOf('</details>');
  if (!openTagMatch || closeTagIndex < 0) return false;

  const openTag = openTagMatch[0];
  const inner = block.slice(openTag.length, closeTagIndex);
  const summaryMatch = SUMMARY_RE.exec(inner);
  const summaryHtml = summaryMatch?.[1]?.trim() || '';
  const bodyMarkdown = summaryMatch ? summaryMatch[2] : inner;
  const isOpen = /\bopen(?:\s*=\s*(?:""|''|open))?\b/i.test(openTag);

  state.line = nextLine;

  const detailsOpenToken = state.push('details_open', 'details', 1);
  detailsOpenToken.map = [startLine, nextLine];
  if (isOpen) {
    detailsOpenToken.attrSet('open', '');
  }

  if (summaryHtml) {
    pushHtmlBlockToken(state, startLine, nextLine, `${summaryHtml}\n`);
  }
  if (bodyMarkdown.trim()) {
    state.md.block.parse(bodyMarkdown, state.md, state.env, state.tokens);
  }

  const detailsCloseToken = state.push('details_close', 'details', -1);
  detailsCloseToken.map = [startLine, nextLine];
  return true;
};

export function detailsBlock(md: MarkdownExit): void {
  md.block.ruler.before('html_block', 'details_block', detailsBlockRule, {
    alt: ['paragraph', 'reference', 'blockquote'],
  });
}
