import { SessionInfo } from "./session-info.type";

export type ServiceConfig = {
  [key: string]: {
    path: string;
    serviceType?: string;
    /** URL used globally for sending HTTP requests */
    urlBase?: string;
    /** Session information */
    session?: SessionInfo;
    /* URL used to generate an export file(e.g., CSV, Excel, PDF) from the o-table.*/
    exportPath?: string;
    /*URL used to retrieve the exported file that was previously generated. */
    downloadPath?:string
  };
};
export type OntimizeServiceConfig = ServiceConfig & {
  fileManagerPath?: string;
};

export type JSONAPIServiceConfig = ServiceConfig & {
  delimiter?: string;
};

