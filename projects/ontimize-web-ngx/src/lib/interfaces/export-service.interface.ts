import { Observable } from 'rxjs';

export interface IExportService {
  getDefaultServiceConfiguration(serviceName?: string): any;
  configureService(config: any, modeAll?: boolean): void;
  exportData(data: any, format: string): Observable<any>;
}
