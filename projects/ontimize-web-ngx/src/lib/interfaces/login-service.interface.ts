import { Observable } from 'rxjs';

export interface ILoginService {
  login(user: string, password: string): Observable<any>;
  logout(): void;
  sessionExpired(): void;
  isLoggedIn(): boolean;
}
