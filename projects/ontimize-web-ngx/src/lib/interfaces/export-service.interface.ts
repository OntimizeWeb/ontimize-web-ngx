import { Observable } from 'rxjs';

export interface IExportService {
  getDefaultServiceConfiguration(serviceName?: string): any;
  configureService(config: any): void;
  exportData(format: string): Observable<any>;
}
