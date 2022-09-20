import { Injector } from "@angular/core";

export type OConfigureServiceArgs = {
  injector:Injector;
  baseDataService: any;
  entity: string;
  service: string;
  serviceType: string;
};
