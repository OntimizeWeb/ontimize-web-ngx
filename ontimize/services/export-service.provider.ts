import { Injector } from '@angular/core';

import { AppConfig, Config } from '../config/app-config';
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
      let newInstance = Object.create((this.config.exportServiceType as any).prototype);
      this.config.exportServiceType.apply(newInstance, [this.injector]);
      return newInstance;
    }
  }
}

export function exportServiceFactory(injector: Injector) {
  return new ExportServiceFactory(injector).factory();
}
