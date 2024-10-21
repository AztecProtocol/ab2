export interface SnapMetadata {
  id: string;
  version: string;
  enabled: boolean;
  blocked: boolean;
  initialPermissions: InitialPermissions;
}

export interface InitialPermissions {
  [key: string]: boolean | number | string | InitialPermissions;
}

export type GetSnapsResponse = Record<string, SnapMetadata>;

export type RequestSnapsResponse = Record<string, SnapMetadata>;
export type RequestSnapsParams = Record<string, { version?: string }>;

export interface InvokeSnapParams {
  snapId: string;
  request: object;
}
