import { Observable } from "rxjs";

export interface IPreferencesService {
  saveAsPreferences(preferencesparams?: object): Observable<any>;
  savePreferences(id: number, preferencesparams?: object): Observable<any>;
  getPreferences(entity?: string, service?: string): Observable<any>;
  deletePreferences(id?: number): Observable<any>;
}
