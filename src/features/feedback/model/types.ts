import { SubmitEndpointResponse } from '@/lib/submitEndpoint';
import type { DeviceInfo } from '@/utils/diagnostics/types';
export type { DeviceCpuInfo, DeviceGpuInfo, DeviceInfo, DeviceOsInfo } from '@/utils/diagnostics/types';

export type FeedbackMode = 'bug' | 'inquiry';
export type SubmitAction = 'issues' | 'feedback';

export interface BugFormState {
  title: string;
  detail: string;
  contact: string;
  includeApp: boolean;
  includeDevice: boolean;
  includeLog: boolean;
}

export interface InquiryFormState {
  title: string;
  detail: string;
  contact: string;
}

export interface FeedbackSuccessDialogState {
  open: boolean;
  message: string;
  url: string;
}

export interface FeedbackDiagnosticsSnapshot {
  device: DeviceInfo | null;
  installedPackages: string[];
  appLog: string;
  appVersion: string;
}

export interface FeedbackDiagnosticsState extends FeedbackDiagnosticsSnapshot {
  loading: boolean;
}

interface FeedbackSubmitPayloadBase {
  title: string;
  body: string;
  labels: string[];
  contact?: string;
}

export interface BugSubmitPayload extends FeedbackSubmitPayloadBase {
  action: 'issues';
  appVersion?: string;
  os?: string;
  cpu?: string;
  gpu?: string;
  installed?: string[];
}

export interface InquirySubmitPayload extends FeedbackSubmitPayloadBase {
  action: 'feedback';
}

export interface ParsedSubmitResponse {
  json: SubmitEndpointResponse | null;
  text: string;
}
