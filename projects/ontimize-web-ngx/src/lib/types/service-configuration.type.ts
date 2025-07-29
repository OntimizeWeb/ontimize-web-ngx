import { SessionInfo } from "./session-info.type";

export type ServiceConfig = {
  [key: string]: {
    path: string;
    serviceType?: string;
    /** URL used globally for sending HTTP requests */
    urlBase?: string;
    /** Session information */
    session?: SessionInfo;
    /* (Ontimize Boot 2.x or earlier) API endpoint used to generate export files (e.g., CSV, Excel, PDF) from an o-table.*/
    exportPath?: string;
    /* (Ontimize Boot 2.x or earlier) API endpoint used to download a previously exported file via its file ID.*/
    downloadPath?:string
  };
};
export type OntimizeServiceConfig = ServiceConfig & {
  fileManagerPath?: string;
};

export type JSONAPIServiceConfig = ServiceConfig & {
  delimiter?: string;
};

