import { Observable } from 'rxjs';

export interface IFileService {
  getDefaultServiceConfiguration(serviceName?: string): any;
  configureService(config: any, modeAll?: boolean): void;
  upload(files: any[], entity: string, data?: object): Observable<any>;
}
