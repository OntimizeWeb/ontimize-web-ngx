import { Injector } from "@angular/core";

export type OConfigureServiceArgs = {
  injector:Injector;
  baseService: any;
  entity: string;
  service: string;
  serviceType: string;
  context?:any
};
