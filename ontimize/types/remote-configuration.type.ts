/** Remote configuration storage */
export type ORemoteConfiguration = {
  /** timeout [number]: Timeout for making remote storage requests. Default: 1000*60*10 (10 minutes) */
  timeout?: number;
  /** endpoint [string]: The URL used by remote configuration service */
  endpoint?: string;
  /** The path of the URL for the remote configuration storage requests */
  path: string;
  /** Database columns used in the remote configuration storage service */
  columns?: ORemoteConfigurationColumns
};

/** Columns configuration for remote configuration storage */
export type ORemoteConfigurationColumns = {
  /** Database column for storing the user. Default: 'USER_' */
  user?: string;
  /** Database column for storing the app UUID. Default: 'APP_UUID' */
  appId?: string;
  /** Database column for storing the configuration. Default: 'CONFIGURATION' */
  configuration?: string;
};
