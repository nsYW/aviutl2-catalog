import * as tauriFs from '@tauri-apps/plugin-fs';
import type { DeviceInfo } from './types';
import { formatUnknownError } from '../errors';
import { ipc } from '../invokeIpc';
import { logError } from '../logging';

const LOG_FILE = 'logs/app.log';

function defaultDeviceInfo(): DeviceInfo {
  return {
    os: { name: 'Windows', version: '', arch: '' },
    cpu: {
      model: '',
      manufacturer: '',
      maxClockMHz: undefined,
      cores: undefined,
      logicalProcessors: undefined,
      id: '',
    },
    gpu: { name: '', vendor: '', driver: '', driverDate: '', processor: '' },
  };
}

export async function collectDeviceInfo(): Promise<DeviceInfo> {
  try {
    return await ipc.collectDeviceInfo();
  } catch (e: unknown) {
    try {
      await logError(`[collectDeviceInfo] failed: ${formatUnknownError(e)}`);
    } catch {}
    return defaultDeviceInfo();
  }
}

export async function readAppLog(): Promise<string> {
  try {
    const hasLog = await tauriFs.exists(LOG_FILE, { baseDir: tauriFs.BaseDirectory.AppConfig });
    if (!hasLog) return '';
    const text = await tauriFs.readTextFile(LOG_FILE, { baseDir: tauriFs.BaseDirectory.AppConfig });
    return text || '';
  } catch (e: unknown) {
    try {
      await logError(`[readAppLog] failed: ${formatUnknownError(e)}`);
    } catch {}
    return '';
  }
}
