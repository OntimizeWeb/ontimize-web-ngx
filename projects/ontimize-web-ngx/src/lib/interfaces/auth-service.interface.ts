import { Observable } from 'rxjs';

export interface IAuthService {
  startsession(user: string, password: string): Observable<any>;
  endsession(user: string, sessionId: number): Observable<any>;
  redirectLogin?(sessionExpired?: boolean);
}
