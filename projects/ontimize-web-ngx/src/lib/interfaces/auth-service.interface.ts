import { Observable } from 'rxjs';

export interface IAuthService {
  startsession(user: string, password: string): Observable<string | number>;
  endsession(user: string, sessionId: string | number): Observable<number>;
  hassession(user: string, sessionId: string | number): Observable<boolean>;
}
