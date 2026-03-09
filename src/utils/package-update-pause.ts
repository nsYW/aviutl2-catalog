import { ipc } from './invokeIpc';
import { getSettings } from './settings';

let cachedPausedPackageUpdateIds: string[] | null = null;

function normalizePausedPackageUpdateIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return Array.from(new Set(raw.map((value) => String(value || '').trim()).filter(Boolean))).toSorted((a, b) =>
    a.localeCompare(b),
  );
}

export async function loadPausedPackageUpdateIds(force = false): Promise<string[]> {
  if (!force && cachedPausedPackageUpdateIds) {
    return cachedPausedPackageUpdateIds;
  }
  const settings = await getSettings();
  const ids = normalizePausedPackageUpdateIds(settings.package_updates_paused_ids);
  cachedPausedPackageUpdateIds = ids;
  return ids;
}

export function getCachedPausedPackageUpdateIds(): string[] | null {
  return cachedPausedPackageUpdateIds ? [...cachedPausedPackageUpdateIds] : null;
}

export async function persistPausedPackageUpdate(packageId: string, paused: boolean): Promise<string[]> {
  const ids = normalizePausedPackageUpdateIds(
    await ipc.setPackageUpdatePaused({
      packageId,
      paused,
    }),
  );
  cachedPausedPackageUpdateIds = ids;
  return ids;
}
