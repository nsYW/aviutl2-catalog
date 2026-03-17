import type { InstallerAction, InstallerSource } from '@/utils/catalogSchema';
import type { RegisterInstallStep, RegisterInstallerState, RegisterUninstallStep } from './types';

type InstallActionRule = {
  special?: boolean;
  requiresPath?: boolean;
  requiresFromTo?: boolean;
  supportsElevate?: boolean;
};

type UninstallActionRule = {
  requiresPath?: boolean;
  supportsElevate?: boolean;
};

export const installActionRules: Record<string, InstallActionRule> = {
  download: {},
  extract: {},
  extract_sfx: { special: true },
  copy: { requiresFromTo: true },
  delete: { requiresPath: true },
  run: { requiresPath: true, supportsElevate: true },
  run_auo_setup: { special: true, requiresPath: true },
};

export const uninstallActionRules: Record<string, UninstallActionRule> = {
  delete: { requiresPath: true },
  run: { requiresPath: true, supportsElevate: true },
};

export type InstallerSourceIssue = 'missing' | 'direct' | 'booth' | 'github' | 'GoogleDrive' | null;

export type InstallerStepIssue = 'unsupported' | 'path' | 'from_to' | 'elevate' | null;

function parseArgsText(argsText: string): string[] {
  if (!argsText) return [];
  return argsText
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

export function normalizeInstallStepState(step: RegisterInstallStep): RegisterInstallStep {
  const action = String(step.action || '').trim();
  if (action === 'download') {
    return { ...step, action, path: '', argsText: '', from: '', to: '', elevate: false };
  }
  if (action === 'extract' || action === 'extract_sfx') {
    return { ...step, action, path: '', argsText: '', elevate: false };
  }
  if (action === 'copy') {
    return { ...step, action, path: '', argsText: '', elevate: false };
  }
  if (action === 'delete') {
    return { ...step, action, argsText: '', from: '', to: '', elevate: false };
  }
  if (action === 'run') {
    return { ...step, action, from: '', to: '', elevate: step.elevate === true };
  }
  if (action === 'run_auo_setup') {
    return { ...step, action, argsText: '', from: '', to: '', elevate: false };
  }
  return { ...step, action, elevate: step.elevate === true };
}

export function resetInstallStepForAction(step: RegisterInstallStep, action: string): RegisterInstallStep {
  return normalizeInstallStepState({
    ...step,
    action,
    path: '',
    argsText: '',
    from: '',
    to: '',
    elevate: false,
  });
}

export function normalizeUninstallStepState(step: RegisterUninstallStep): RegisterUninstallStep {
  const action = String(step.action || '').trim();
  if (action === 'run') {
    return { ...step, action, elevate: step.elevate === true };
  }
  return { ...step, action, argsText: '', elevate: false };
}

export function resetUninstallStepForAction(step: RegisterUninstallStep, action: string): RegisterUninstallStep {
  return normalizeUninstallStepState({
    ...step,
    action,
    path: '',
    argsText: '',
    elevate: false,
  });
}

export function getInstallerSourceIssue(installer: RegisterInstallerState): InstallerSourceIssue {
  if (installer.sourceType === 'direct') {
    return installer.directUrl.trim() ? null : 'direct';
  }
  if (installer.sourceType === 'booth') {
    return installer.boothUrl.trim() ? null : 'booth';
  }
  if (installer.sourceType === 'github') {
    return installer.githubOwner.trim() && installer.githubRepo.trim() && installer.githubPattern.trim()
      ? null
      : 'github';
  }
  if (installer.sourceType === 'GoogleDrive') {
    return installer.googleDriveId.trim() ? null : 'GoogleDrive';
  }
  return 'missing';
}

export function buildInstallerSource(installer: RegisterInstallerState): InstallerSource {
  const issue = getInstallerSourceIssue(installer);
  if (issue === 'direct') throw new Error('installer.source.direct is required');
  if (issue === 'booth') throw new Error('installer.source.booth is required');
  if (issue === 'github') throw new Error('installer.source.github owner/repo/pattern are required');
  if (issue === 'GoogleDrive') throw new Error('installer.source.GoogleDrive.id is required');
  if (issue === 'missing') throw new Error('installer.source must be selected');

  if (installer.sourceType === 'direct') {
    return { direct: installer.directUrl.trim() };
  }
  if (installer.sourceType === 'booth') {
    return { booth: installer.boothUrl.trim() };
  }
  if (installer.sourceType === 'github') {
    return {
      github: {
        owner: installer.githubOwner.trim(),
        repo: installer.githubRepo.trim(),
        pattern: installer.githubPattern.trim(),
      },
    };
  }
  return { GoogleDrive: { id: installer.googleDriveId.trim() } };
}

export function isKnownInstallAction(action: string): boolean {
  return Object.prototype.hasOwnProperty.call(installActionRules, action);
}

export function isKnownUninstallAction(action: string): boolean {
  return Object.prototype.hasOwnProperty.call(uninstallActionRules, action);
}

function getInstallStepIssueFromNormalized(step: RegisterInstallStep): InstallerStepIssue {
  const action = String(step.action || '').trim();
  const rule = installActionRules[action];
  if (!rule || !isKnownInstallAction(action)) return 'unsupported';
  if (rule.requiresPath && !String(step.path || '').trim()) return 'path';
  if (rule.requiresFromTo && (!String(step.from || '').trim() || !String(step.to || '').trim())) return 'from_to';
  if (!rule.supportsElevate && step.elevate) return 'elevate';
  return null;
}

export function getInstallStepIssue(step: RegisterInstallStep): InstallerStepIssue {
  const normalized = normalizeInstallStepState(step);
  return getInstallStepIssueFromNormalized(normalized);
}

function getUninstallStepIssueFromNormalized(step: RegisterUninstallStep): InstallerStepIssue {
  const action = String(step.action || '').trim();
  const rule = uninstallActionRules[action];
  if (!rule || !isKnownUninstallAction(action)) return 'unsupported';
  if (rule.requiresPath && !String(step.path || '').trim()) return 'path';
  if (!rule.supportsElevate && step.elevate) return 'elevate';
  return null;
}

export function getUninstallStepIssue(step: RegisterUninstallStep): InstallerStepIssue {
  const normalized = normalizeUninstallStepState(step);
  return getUninstallStepIssueFromNormalized(normalized);
}

export function serializeInstallStep(step: RegisterInstallStep): InstallerAction {
  const normalized = normalizeInstallStepState(step);
  const action = String(normalized.action || '').trim();
  const issue = getInstallStepIssueFromNormalized(normalized);
  if (issue === 'unsupported') throw new Error(`unsupported install action: ${action || '(empty)'}`);
  if (issue === 'path') throw new Error(`${action || 'install'} action requires path`);
  if (issue === 'from_to') throw new Error('copy action requires from/to');
  if (issue === 'elevate') throw new Error('elevate is only supported for run action');

  const path = String(normalized.path || '').trim();
  const from = String(normalized.from || '').trim();
  const to = String(normalized.to || '').trim();
  if (action === 'download') return { action: 'download' };
  if (action === 'extract') {
    return { action: 'extract', ...(from ? { from } : {}), ...(to ? { to } : {}) };
  }
  if (action === 'extract_sfx') {
    return { action: 'extract_sfx', ...(from ? { from } : {}), ...(to ? { to } : {}) };
  }
  if (action === 'copy') {
    return { action: 'copy', from, to };
  }
  if (action === 'delete') {
    return { action: 'delete', path };
  }
  if (action === 'run') {
    return {
      action: 'run',
      path,
      args: parseArgsText(normalized.argsText),
      ...(normalized.elevate ? { elevate: true } : {}),
    };
  }
  return { action: 'run_auo_setup', path };
}

export function serializeUninstallStep(step: RegisterUninstallStep): InstallerAction {
  const normalized = normalizeUninstallStepState(step);
  const action = String(normalized.action || '').trim();
  const issue = getUninstallStepIssueFromNormalized(normalized);
  if (issue === 'unsupported') throw new Error(`unsupported uninstall action: ${action || '(empty)'}`);
  if (issue === 'path') throw new Error(`${action || 'uninstall'} action requires path`);
  if (issue === 'elevate') throw new Error('elevate is only supported for run action');

  const path = String(normalized.path || '').trim();
  if (action === 'delete') {
    return { action: 'delete', path };
  }
  return {
    action: 'run',
    path,
    args: parseArgsText(normalized.argsText),
    ...(normalized.elevate ? { elevate: true } : {}),
  };
}
