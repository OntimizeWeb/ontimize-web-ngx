import { BehaviorSubject } from 'rxjs';

export abstract class OLoadingService {

  // State global loading
  loading$ = new BehaviorSubject<boolean>(false);

  // public API
  setLoading(value: boolean): void { this.loading$.next(value); }
  getLoading(): boolean { return this.loading$.value; }

}
