import { Observable } from 'rxjs';

export interface IExportService {
  getDefaultServiceConfiguration(serviceName?: string): any;
  configureService(config: any): void;
  exportData(format: string, columns?: string[], landscape?:Boolean, filename?:string): Observable<any>;
}
