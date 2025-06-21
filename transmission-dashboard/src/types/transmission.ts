export interface Torrent {
  id: number;
  name: string;
  status: number; // Refer to Transmission docs for status codes
  percentDone: number;
  rateDownload: number;
  rateUpload: number;
  eta: number;
  peersGettingFromUs: number;
  peersSendingToUs: number;
  leftUntilDone: number;
  sizeWhenDone: number;
  errorString?: string;
}

export interface TransmissionSession {
  "alt-speed-down": number;
  "alt-speed-enabled": boolean;
  "alt-speed-time-begin": number;
  "alt-speed-time-day": number;
  "alt-speed-time-enabled": boolean;
  "alt-speed-time-end": number;
  "alt-speed-up": number;
  "blocklist-enabled": boolean;
  "blocklist-size": number;
  "blocklist-url": string;
  "cache-size-mb": number;
  "config-dir": string;
  "dht-enabled": boolean;
  "download-dir": string;
  "download-dir-free-space": number;
  "download-queue-enabled": boolean;
  "download-queue-size": number;
  "encryption": string;
  "idle-seeding-limit": number;
  "idle-seeding-limit-enabled": boolean;
  "incomplete-dir": string;
  "incomplete-dir-enabled": boolean;
  "lpd-enabled": boolean;
  "peer-limit-global": number;
  "peer-limit-per-torrent": number;
  "peer-port": number;
  "peer-port-random-on-start": boolean;
  "pex-enabled": boolean;
  "port-forwarding-enabled": boolean;
  "queue-stalled-enabled": boolean;
  "queue-stalled-minutes": number;
  "rename-partial-files": boolean;
  "rpc-version": number;
  "rpc-version-minimum": number;
  "script-torrent-done-enabled": boolean;
  "script-torrent-done-filename": string;
  "seed-queue-enabled": boolean;
  "seed-queue-size": number;
  "seedRatioLimit": number;
  "seedRatioLimited": boolean;
  "speed-limit-down": number;
  "speed-limit-down-enabled": boolean;
  "speed-limit-up": number;
  "speed-limit-up-enabled": boolean;
  "start-added-torrents": boolean;
  "trash-original-torrent-files": boolean;
  "units": {
    "memory-bytes": number;
    "memory-units": string[];
    "size-bytes": number;
    "size-units": string[];
    "speed-bytes": number;
    "speed-units": string[];
  };
  "utp-enabled": boolean;
  "version": string;
}

export interface TransmissionResponse<T> {
  arguments: T;
  result: string; // "success" or an error string
  tag?: number; // Optional tag for matching requests
}
