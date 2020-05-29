import { Injector } from '@angular/core';

import { AppConfig } from '../config/app-config';
import { Config } from '../types';
import { OntimizeExportService } from './ontimize-export.service';

export class ExportServiceFactory {

  protected config: Config;

  constructor(protected injector: Injector) {
    this.config = this.injector.get(AppConfig).getConfiguration();
  }

  public factory(): any {
    if (typeof (this.config.exportServiceType) === 'undefined') {
      return new OntimizeExportService(this.injector);
    } else {
      const newInstance = Object.create((this.config.exportServiceType as any).prototype);
      this.config.exportServiceType.apply(newInstance, [this.injector]);
      return newInstance;
    }
  }
}

export function exportServiceFactory(injector: Injector) {
  return new ExportServiceFactory(injector).factory();
}
