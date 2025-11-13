import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class OLoadingService {

  // State global loading
  loading$ = new BehaviorSubject<boolean>(false);

  // public API
  setLoading(value: boolean): void { this.loading$.next(value); }
  getLoading(): boolean { return this.loading$.value; }

}
