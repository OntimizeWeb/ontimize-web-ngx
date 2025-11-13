import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';
import { OLoadingService } from '../../services/loading.service';

@Injectable()
export class OTableLoadingService extends OLoadingService {
  constructor() {
    super();
  }
  private loadingSorting$ = new BehaviorSubject<boolean>(false);
  private loadingScroll$ = new BehaviorSubject<boolean>(false);
  private loadingLocal$ = new BehaviorSubject<boolean>(false);

  // observable combination that the component can use directly
  readonly showLoading$: Observable<boolean> = combineLatest([
    this.loading$.pipe(debounceTime(200)),
    this.loadingSorting$,
    this.loadingScroll$
  ]).pipe(
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    map(values => values.some(v => v))
  );


  // public API
  setLoadingSorting(value: boolean): void { this.loadingSorting$.next(value); }
  setLoadingScroll(value: boolean): void { this.loadingScroll$.next(value); }
  setLoadingLocal(value: boolean): void { this.loadingLocal$.next(value); }

}
