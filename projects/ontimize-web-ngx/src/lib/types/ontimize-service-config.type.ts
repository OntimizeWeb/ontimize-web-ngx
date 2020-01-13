import { SessionInfo } from '../services/login.service';

/** Ontimize Service Configuration */
export type OntimizeServiceConfig = {
  /** URL used globally for sending HTTP requests */
  urlBase?: string;
  /** Session information */
  session?: SessionInfo;
};

/** Ontimize Service Response Type */
export type OntimizeServiceResponse = {
  code: number;
  data: any;
  message: string;
  sqlTypes: {}
};
