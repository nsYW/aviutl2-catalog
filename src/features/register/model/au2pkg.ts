import type { RegisterInstallStep, RegisterUninstallStep } from './types';

export const AU2PKG_ALLOWED_ROOTS = [
  'Plugin',
  'Script',
  'Language',
  'Alias',
  'Figure',
  'Transition',
  'Preset',
  'Default',
] as const;

export type Au2pkgRoot = (typeof AU2PKG_ALLOWED_ROOTS)[number];

export interface Au2pkgMatchedFile {
  archivePath: string;
  root: Au2pkgRoot;
  relativePath: string;
  installTo: string;
  uninstallPath: string;
}

export interface Au2pkgSummaryGroup {
  root: Au2pkgRoot;
  count: number;
}

export interface Au2pkgImportSummary {
  totalFiles: number;
  groups: Au2pkgSummaryGroup[];
}

export type RegisterInstallStepSeed = Omit<RegisterInstallStep, 'key'>;
export type RegisterUninstallStepSeed = Omit<RegisterUninstallStep, 'key'>;

function getAu2pkgRootPriority(root: Au2pkgRoot): number {
  if (root === 'Plugin') return 0;
  if (root === 'Script') return 1;
  return 2;
}

function compareAu2pkgRootOrder(left: Au2pkgRoot, right: Au2pkgRoot): number {
  return getAu2pkgRootPriority(left) - getAu2pkgRootPriority(right);
}

function normalizeArchivePath(path: string): string {
  return String(path || '')
    .replace(/\\/g, '/')
    .replace(/^\.?\//, '')
    .split('/')
    .filter(Boolean)
    .join('/');
}

function resolveCanonicalRoot(root: string): Au2pkgRoot | null {
  const matched = AU2PKG_ALLOWED_ROOTS.find((entry) => entry.toLowerCase() === root.toLowerCase());
  return matched ?? null;
}

function splitRelativePath(relativePath: string): { parentDir: string; fileName: string } {
  const segments = relativePath.split('/').filter(Boolean);
  const fileName = segments[segments.length - 1] || '';
  return {
    parentDir: segments.slice(0, -1).join('/'),
    fileName,
  };
}

function resolveInstallBase(root: Au2pkgRoot): string {
  if (root === 'Plugin') return `{pluginsDir}`;
  if (root === 'Script') return `{scriptsDir}`;
  return `{dataDir}/${root}`;
}

function resolveInstallDestination(
  root: Au2pkgRoot,
  relativePath: string,
): { installTo: string; uninstallPath: string } {
  const baseDir = resolveInstallBase(root);
  const { parentDir, fileName } = splitRelativePath(relativePath);
  const installTo = parentDir ? `${baseDir}/${parentDir}` : baseDir;
  const uninstallPath = `${installTo}/${fileName}`;
  return { installTo, uninstallPath };
}

export function isAu2pkgFileName(filePath: string): boolean {
  return /\.au2pkg\.zip$/i.test(String(filePath || '').trim());
}

export function collectAu2pkgEntries(entries: string[]): Au2pkgMatchedFile[] {
  const seen = new Set<string>();
  const matched: Au2pkgMatchedFile[] = [];

  for (const rawEntry of entries) {
    const normalizedEntry = normalizeArchivePath(rawEntry);
    if (!normalizedEntry) continue;
    const segments = normalizedEntry.split('/');
    if (segments.length < 2) continue;
    const canonicalRoot = resolveCanonicalRoot(segments[0]);
    if (!canonicalRoot) continue;
    const relativePath = segments.slice(1).join('/');
    if (!relativePath) continue;
    const dedupeKey = `${canonicalRoot}/${relativePath}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    const destination = resolveInstallDestination(canonicalRoot, relativePath);
    matched.push({
      archivePath: `${canonicalRoot}/${relativePath}`,
      root: canonicalRoot,
      relativePath,
      installTo: destination.installTo,
      uninstallPath: destination.uninstallPath,
    });
  }

  return matched.toSorted((a, b) => {
    const rootOrder = compareAu2pkgRootOrder(a.root, b.root);
    if (rootOrder !== 0) return rootOrder;
    return a.archivePath.localeCompare(b.archivePath);
  });
}

export function summarizeAu2pkgFiles(files: Au2pkgMatchedFile[]): Au2pkgImportSummary {
  const counts = new Map<Au2pkgRoot, number>();
  for (const file of files) {
    counts.set(file.root, (counts.get(file.root) || 0) + 1);
  }
  const groups = [...counts.entries()]
    .toSorted((a, b) => AU2PKG_ALLOWED_ROOTS.indexOf(a[0]) - AU2PKG_ALLOWED_ROOTS.indexOf(b[0]))
    .map(([root, count]) => ({ root, count }));
  return {
    totalFiles: files.length,
    groups,
  };
}

export function buildAu2pkgInstallSteps(files: Au2pkgMatchedFile[]): RegisterInstallStepSeed[] {
  const steps: RegisterInstallStepSeed[] = [
    {
      action: 'download',
      path: '',
      argsText: '',
      from: '',
      to: '',
      elevate: false,
    },
    {
      action: 'extract',
      path: '',
      argsText: '',
      from: '',
      to: '',
      elevate: false,
    },
  ];

  for (const file of files) {
    steps.push({
      action: 'copy',
      path: '',
      argsText: '',
      from: `{tmp}/${file.archivePath}`,
      to: file.installTo,
      elevate: false,
    });
  }

  return steps;
}

export function buildAu2pkgUninstallSteps(files: Au2pkgMatchedFile[]): RegisterUninstallStepSeed[] {
  return files.map((file) => ({
    action: 'delete',
    path: file.uninstallPath,
    argsText: '',
    elevate: false,
  }));
}
