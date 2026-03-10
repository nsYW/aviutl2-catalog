use std::{cmp::Reverse, env};

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DeviceOsInfo {
    pub name: String,
    pub version: String,
    pub arch: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DeviceCpuInfo {
    pub model: String,
    pub manufacturer: String,
    #[serde(rename = "maxClockMHz")]
    pub max_clock_mhz: Option<u32>,
    pub cores: Option<u32>,
    pub logical_processors: Option<u32>,
    pub id: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DeviceGpuInfo {
    pub name: String,
    pub vendor: String,
    pub driver: String,
    pub driver_date: String,
    pub processor: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DeviceInfo {
    pub os: DeviceOsInfo,
    pub cpu: DeviceCpuInfo,
    pub gpu: DeviceGpuInfo,
}

#[derive(Debug, Deserialize)]
#[serde(rename = "Win32_OperatingSystem")]
#[serde(rename_all = "PascalCase")]
struct OperatingSystem {
    caption: Option<String>,
    build_number: Option<String>,
    os_architecture: Option<String>,
    version: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename = "Win32_Processor")]
#[serde(rename_all = "PascalCase")]
struct Processor {
    name: Option<String>,
    manufacturer: Option<String>,
    max_clock_speed: Option<u32>,
    number_of_cores: Option<u32>,
    number_of_logical_processors: Option<u32>,
    processor_id: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename = "Win32_VideoController")]
#[serde(rename_all = "PascalCase")]
struct VideoController {
    name: Option<String>,
    adapter_compatibility: Option<String>,
    driver_version: Option<String>,
    driver_date: Option<String>,
    video_processor: Option<String>,
    adapter_ram: Option<u64>,
}

#[derive(Debug, Deserialize)]
struct StdRegProv;

#[derive(Debug, Serialize)]
#[allow(non_snake_case)]
struct GetStringValueInput {
    hDefKey: u32,
    sSubKeyName: String,
    sValueName: String,
}

#[derive(Debug, Deserialize)]
#[allow(non_snake_case)]
struct GetStringValueOutput {
    ReturnValue: u32,
    sValue: Option<String>,
}

const HKEY_LOCAL_MACHINE: u32 = 0x8000_0002;
const CURRENT_VERSION_REG_PATH: &str = r"SOFTWARE\Microsoft\Windows NT\CurrentVersion";

fn default_device_info() -> DeviceInfo {
    DeviceInfo {
        os: DeviceOsInfo { name: "Windows".to_string(), version: String::new(), arch: detect_arch() },
        cpu: DeviceCpuInfo {
            model: String::new(),
            manufacturer: String::new(),
            max_clock_mhz: None,
            cores: None,
            logical_processors: None,
            id: String::new(),
        },
        gpu: DeviceGpuInfo {
            name: String::new(),
            vendor: String::new(),
            driver: String::new(),
            driver_date: String::new(),
            processor: String::new(),
        },
    }
}

fn detect_arch() -> String {
    let raw = env::var("PROCESSOR_ARCHITEW6432")
        .ok()
        .filter(|value| !value.trim().is_empty())
        .or_else(|| env::var("PROCESSOR_ARCHITECTURE").ok().filter(|value| !value.trim().is_empty()))
        .unwrap_or_else(|| env::consts::ARCH.to_string());

    normalize_arch(&raw)
}

fn normalize_arch(value: &str) -> String {
    match value.trim().to_ascii_lowercase().as_str() {
        "amd64" | "x86_64" => "x64".to_string(),
        "arm64" | "aarch64" => "ARM64".to_string(),
        "x86" | "i386" | "i686" => "x86".to_string(),
        other if other.is_empty() => String::new(),
        _ => value.trim().to_string(),
    }
}

#[cfg(target_os = "windows")]
fn read_current_version_string(wmi: &wmi::WMIConnection, value_name: &str) -> Option<String> {
    let input = GetStringValueInput {
        hDefKey: HKEY_LOCAL_MACHINE,
        sSubKeyName: CURRENT_VERSION_REG_PATH.to_string(),
        sValueName: value_name.to_string(),
    };

    match wmi.exec_class_method::<StdRegProv, GetStringValueOutput>("GetStringValue", &input) {
        Ok(output) if output.ReturnValue == 0 => output.sValue.and_then(|value| {
            let trimmed = value.trim();
            if trimmed.is_empty() { None } else { Some(trimmed.to_string()) }
        }),
        Ok(output) => {
            tracing::debug!("collect_device_info: StdRegProv.GetStringValue({value_name}) returned {}", output.ReturnValue);
            None
        }
        Err(error) => {
            tracing::debug!("collect_device_info: StdRegProv.GetStringValue({value_name}) failed: {error}");
            None
        }
    }
}

#[cfg(target_os = "windows")]
fn normalize_windows_name(product_name: Option<String>, caption: Option<String>, build_number: Option<u32>) -> String {
    let raw = product_name.or(caption).unwrap_or_else(|| "Windows".to_string());
    let normalized = raw.trim().strip_prefix("Microsoft ").unwrap_or(raw.trim()).to_string();

    if build_number.unwrap_or_default() >= 22_000 { normalized.replacen("Windows 10", "Windows 11", 1) } else { normalized }
}

#[cfg(target_os = "windows")]
fn format_windows_version(release: Option<String>, build_number: Option<&str>, version: Option<String>) -> String {
    let build_number = build_number.and_then(|value| {
        let trimmed = value.trim();
        if trimmed.is_empty() { None } else { Some(trimmed) }
    });

    match (release.filter(|value| !value.trim().is_empty()), build_number, version.filter(|value| !value.trim().is_empty())) {
        (Some(release), Some(build), _) => format!("{release} (build {build})"),
        (Some(release), None, _) => release,
        (None, Some(build), Some(version)) => format!("{version} (build {build})"),
        (None, Some(build), None) => format!("build {build}"),
        (None, None, Some(version)) => version,
        (None, None, None) => String::new(),
    }
}

#[cfg(target_os = "windows")]
fn collect_device_info_impl() -> DeviceInfo {
    use wmi::WMIConnection;

    let mut info = default_device_info();

    let wmi = match WMIConnection::new() {
        Ok(wmi) => wmi,
        Err(error) => {
            tracing::error!("collect_device_info: WMIConnection::new failed: {error}");
            return info;
        }
    };

    let product_name = read_current_version_string(&wmi, "ProductName");
    let display_version = read_current_version_string(&wmi, "DisplayVersion").or_else(|| read_current_version_string(&wmi, "ReleaseId"));

    match wmi.query::<OperatingSystem>() {
        Ok(rows) => {
            if let Some(os) = rows.into_iter().next() {
                let build_number_value = os.build_number.as_deref().and_then(|value| value.trim().parse::<u32>().ok());
                info.os = DeviceOsInfo {
                    name: normalize_windows_name(product_name, os.caption, build_number_value),
                    version: format_windows_version(display_version, os.build_number.as_deref(), os.version),
                    arch: os.os_architecture.as_deref().map(normalize_arch).filter(|value| !value.is_empty()).unwrap_or_else(detect_arch),
                };
            }
        }
        Err(error) => tracing::warn!("collect_device_info: OS query failed: {error}"),
    }

    match wmi.query::<Processor>() {
        Ok(rows) => {
            if let Some(cpu) = rows.into_iter().next() {
                info.cpu = DeviceCpuInfo {
                    model: cpu.name.unwrap_or_default(),
                    manufacturer: cpu.manufacturer.unwrap_or_default(),
                    max_clock_mhz: cpu.max_clock_speed,
                    cores: cpu.number_of_cores,
                    logical_processors: cpu.number_of_logical_processors,
                    id: cpu.processor_id.unwrap_or_default(),
                };
            }
        }
        Err(error) => tracing::warn!("collect_device_info: CPU query failed: {error}"),
    }

    match wmi.query::<VideoController>() {
        Ok(mut rows) => {
            rows.sort_by_key(|row| Reverse(row.adapter_ram.unwrap_or_default()));
            let preferred = rows.iter().find(|row| !row.name.as_deref().unwrap_or_default().to_ascii_lowercase().contains("microsoft basic render")).or_else(|| rows.first());

            if let Some(gpu) = preferred {
                info.gpu = DeviceGpuInfo {
                    name: gpu.name.clone().unwrap_or_default(),
                    vendor: gpu.adapter_compatibility.clone().unwrap_or_default(),
                    driver: gpu.driver_version.clone().unwrap_or_default(),
                    driver_date: gpu.driver_date.clone().unwrap_or_default(),
                    processor: gpu.video_processor.clone().unwrap_or_default(),
                };
            }
        }
        Err(error) => tracing::warn!("collect_device_info: GPU query failed: {error}"),
    }

    info
}

#[cfg(not(target_os = "windows"))]
fn collect_device_info_impl() -> DeviceInfo {
    default_device_info()
}

#[tauri::command]
pub async fn collect_device_info() -> Result<DeviceInfo, String> {
    tauri::async_runtime::spawn_blocking(collect_device_info_impl).await.map_err(|error| error.to_string())
}
