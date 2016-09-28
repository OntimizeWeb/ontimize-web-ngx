import {Observable} from 'rxjs/Observable';

export interface ILoginService {

  login(user, password): Observable<any>;

  logout(): void;

  sessionExpired();

  isLoggedIn(): boolean;

}


