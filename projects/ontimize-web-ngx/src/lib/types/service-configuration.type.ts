
export type ServiceConfigType = {
  [key: string]: {
    path: string;
    fileManagerPath?: string;
    serviceType?: string;
  };
};
export type OntimizeServiceConfigType = ServiceConfigType;

export type JSONAPIServiceConfigType = ServiceConfigType & {
  delimiter?: string;
};

