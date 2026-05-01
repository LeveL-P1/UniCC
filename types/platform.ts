export type PlatformKey =
  | "leetcode"
  | "codeforces"
  | "codechef"
  | "atcoder"
  | "hackerrank"
  | "hackerearth";

export type SyncStatus = "IDLE" | "SYNCING" | "SUCCESS" | "ERROR" | "NOT_CONNECTED";

export interface PlatformStats {
  platform: PlatformKey;
  handle: string;
  valueLabel: string;
  secondaryLabel?: string;
  syncedAt?: string | null;
  syncStatus?: SyncStatus;
}
