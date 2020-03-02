import { SessionInfo } from './session-info.type';

/** Ontimize Service Configuration */
export type OntimizeServiceConfig = {
  /** URL used globally for sending HTTP requests */
  urlBase?: string;
  /** Session information */
  session?: SessionInfo;
};
