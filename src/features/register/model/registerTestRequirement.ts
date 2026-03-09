import { entryToForm } from './parse';
import { computeStableTextHash } from './helpers';
import type { CatalogEntry } from '../../../utils/catalogSchema';
import type { RegisterPackageForm } from './types';

export type RegisterDraftTestState = 'not_required' | 'ready' | 'blocked';

function normalizeInstaller(installer: RegisterPackageForm['installer']) {
  return {
    sourceType: String(installer.sourceType || ''),
    directUrl: String(installer.directUrl || '').trim(),
    boothUrl: String(installer.boothUrl || '').trim(),
    githubOwner: String(installer.githubOwner || '').trim(),
    githubRepo: String(installer.githubRepo || '').trim(),
    githubPattern: String(installer.githubPattern || '').trim(),
    googleDriveId: String(installer.googleDriveId || '').trim(),
    installSteps: installer.installSteps.map((step) => ({
      action: String(step.action || ''),
      path: String(step.path || '').trim(),
      argsText: String(step.argsText || '').trim(),
      from: String(step.from || '').trim(),
      to: String(step.to || '').trim(),
      elevate: step.elevate === true,
    })),
    uninstallSteps: installer.uninstallSteps.map((step) => ({
      action: String(step.action || ''),
      path: String(step.path || '').trim(),
      argsText: String(step.argsText || '').trim(),
      elevate: step.elevate === true,
    })),
  };
}

function normalizeVersions(versions: RegisterPackageForm['versions']) {
  return versions.map((version) => ({
    version: String(version.version || '').trim(),
    release_date: String(version.release_date || '').trim(),
    files: version.files.map((file) => ({
      path: String(file.path || '').trim(),
      hash: String(file.hash || '').trim(),
    })),
  }));
}

export function computeRegisterRelevantHash(form: Pick<RegisterPackageForm, 'id' | 'installer' | 'versions'>): string {
  const normalized = {
    id: String(form.id || '').trim(),
    installer: normalizeInstaller(form.installer),
    versions: normalizeVersions(form.versions),
  };
  return computeStableTextHash(JSON.stringify(normalized));
}

export function getRegisterRelevantHashFromCatalogItem(item: CatalogEntry | null | undefined): string {
  if (!item) return '';
  return computeRegisterRelevantHash(entryToForm(item));
}

export function findRegisterCatalogItem(catalogItems: CatalogEntry[], packageId: string): CatalogEntry | null {
  const normalizedPackageId = String(packageId || '').trim();
  if (!normalizedPackageId) return null;
  return catalogItems.find((item) => item.id === normalizedPackageId) || null;
}

export function resolveRegisterCatalogRelevantHash(catalogItems: CatalogEntry[], packageId: string): string {
  return getRegisterRelevantHashFromCatalogItem(findRegisterCatalogItem(catalogItems, packageId));
}

export function isRegisterTestRequired(args: {
  catalogItems: CatalogEntry[];
  packageId: string;
  packageForm: Pick<RegisterPackageForm, 'id' | 'installer' | 'versions'>;
}): boolean {
  const baselineRelevantHash = resolveRegisterCatalogRelevantHash(args.catalogItems, args.packageId);
  if (!baselineRelevantHash) return true;
  return baselineRelevantHash !== computeRegisterRelevantHash(args.packageForm);
}

export function resolveRegisterDraftTestState(args: {
  catalogItems: CatalogEntry[];
  packageId: string;
  installerTestedHash?: string;
  uninstallerTestedHash?: string;
  packageForm: Pick<RegisterPackageForm, 'id' | 'installer' | 'versions'>;
}): {
  installerReady: boolean;
  uninstallerReady: boolean;
  state: RegisterDraftTestState;
} {
  const currentRelevantHash = computeRegisterRelevantHash(args.packageForm);
  const baselineRelevantHash = resolveRegisterCatalogRelevantHash(args.catalogItems, args.packageId);
  const requiresTest = !baselineRelevantHash || baselineRelevantHash !== currentRelevantHash;
  if (!requiresTest) {
    return {
      installerReady: true,
      uninstallerReady: true,
      state: 'not_required',
    };
  }
  const installerReady = String(args.installerTestedHash || '') === currentRelevantHash;
  const uninstallerReady = String(args.uninstallerTestedHash || '') === currentRelevantHash;
  return {
    installerReady,
    uninstallerReady,
    state: installerReady && uninstallerReady ? 'ready' : 'blocked',
  };
}
