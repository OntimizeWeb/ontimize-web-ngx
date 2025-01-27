import { Observable } from 'rxjs';

export interface IExportService {
  getDefaultServiceConfiguration(serviceName?: string): any;
  configureService(config: any): void;
  exportData(format: string, columns?: string[], landscape?:boolean, filename?:string): Observable<any>;
}
