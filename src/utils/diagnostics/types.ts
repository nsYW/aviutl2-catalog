export interface DeviceOsInfo {
  name?: string;
  version?: string;
  arch?: string;
}

export interface DeviceCpuInfo {
  model?: string;
  manufacturer?: string;
  cores?: number | null;
  logicalProcessors?: number | null;
  maxClockMHz?: number | null;
  id?: string;
}

export interface DeviceGpuInfo {
  name?: string;
  vendor?: string;
  driver?: string;
  driverDate?: string;
  processor?: string;
}

export interface DeviceInfo {
  os?: DeviceOsInfo;
  cpu?: DeviceCpuInfo;
  gpu?: DeviceGpuInfo;
}
