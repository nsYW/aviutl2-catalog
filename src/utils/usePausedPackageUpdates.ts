import { useMemo, useSyncExternalStore } from 'react';
import {
  getCachedPausedPackageUpdateIds,
  loadPausedPackageUpdateIds,
  persistPausedPackageUpdate,
} from './package-update-pause';

export interface UsePausedPackageUpdatesResult {
  isLoaded: boolean;
  pausedPackageIdSet: ReadonlySet<string>;
  pauseBusyIdSet: ReadonlySet<string>;
  togglePause: (packageId: string, paused: boolean) => Promise<string[]>;
}

interface PausedPackageUpdatesStoreState {
  isLoaded: boolean;
  pausedPackageIds: string[];
  pauseBusyIds: string[];
}

const cachedPausedIds = getCachedPausedPackageUpdateIds();
let storeState: PausedPackageUpdatesStoreState = {
  isLoaded: cachedPausedIds !== null,
  pausedPackageIds: cachedPausedIds ?? [],
  pauseBusyIds: [],
};
let storeInitialized = false;
let toggleQueue = Promise.resolve<string[]>(storeState.pausedPackageIds);
const storeListeners = new Set<() => void>();

function emitStoreChange(): void {
  storeListeners.forEach((listener) => {
    listener();
  });
}

function setStoreState(next: Partial<PausedPackageUpdatesStoreState>): void {
  storeState = {
    ...storeState,
    ...next,
  };
  emitStoreChange();
}

function subscribeStore(listener: () => void): () => void {
  ensureStoreInitialized();
  storeListeners.add(listener);
  return () => {
    storeListeners.delete(listener);
  };
}

function getStoreSnapshot(): PausedPackageUpdatesStoreState {
  return storeState;
}

function ensureStoreInitialized(): void {
  if (storeInitialized) return;
  storeInitialized = true;

  void loadPausedPackageUpdateIds().then((ids) => {
    setStoreState({
      isLoaded: true,
      pausedPackageIds: ids,
    });
    return ids;
  });
}

async function togglePause(packageId: string, paused: boolean): Promise<string[]> {
  const id = String(packageId || '').trim();
  if (!id) return storeState.pausedPackageIds;

  const runToggle = async () => {
    if (storeState.pauseBusyIds.includes(id)) {
      return storeState.pausedPackageIds;
    }

    const previousIds = storeState.pausedPackageIds;
    const nextIds = paused
      ? Array.from(new Set([...previousIds, id])).toSorted((a, b) => a.localeCompare(b))
      : previousIds.filter((existingId) => existingId !== id);

    setStoreState({
      pausedPackageIds: nextIds,
      pauseBusyIds: Array.from(new Set([...storeState.pauseBusyIds, id])),
    });

    try {
      const persistedIds = await persistPausedPackageUpdate(id, paused);
      setStoreState({ pausedPackageIds: persistedIds });
      return persistedIds;
    } catch (error) {
      setStoreState({ pausedPackageIds: previousIds });
      throw error;
    } finally {
      setStoreState({
        pauseBusyIds: storeState.pauseBusyIds.filter((busyId) => busyId !== id),
      });
    }
  };

  const queued = toggleQueue.catch(() => storeState.pausedPackageIds).then(runToggle);
  toggleQueue = queued.catch(() => storeState.pausedPackageIds);
  return queued;
}

export default function usePausedPackageUpdates(): UsePausedPackageUpdatesResult {
  const snapshot = useSyncExternalStore(subscribeStore, getStoreSnapshot, getStoreSnapshot);
  const pausedPackageIdSet = useMemo(() => new Set(snapshot.pausedPackageIds), [snapshot.pausedPackageIds]);
  const pauseBusyIdSet = useMemo(() => new Set(snapshot.pauseBusyIds), [snapshot.pauseBusyIds]);

  return {
    isLoaded: snapshot.isLoaded,
    pausedPackageIdSet,
    pauseBusyIdSet,
    togglePause,
  };
}
