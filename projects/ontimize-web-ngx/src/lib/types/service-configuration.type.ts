
export type ServiceConfigType = {
  [key: string]: {
    path: string;
    serviceType?: string;
  };
};
export type OntimizeServiceConfigType = ServiceConfigType & {
  fileManagerPath?: string;
};

export type JSONAPIServiceConfigType = ServiceConfigType & {
  delimiter?: string;
};

