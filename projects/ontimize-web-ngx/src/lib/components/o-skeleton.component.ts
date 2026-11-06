import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, Injector, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';

import { AppearanceService } from '../services/appearance.service';

@Directive({ standalone: true })
export abstract class OSkeletonComponent implements AfterViewInit, OnDestroy {
  isDarkMode: boolean;
  subscription: Subscription;
  appearanceService: AppearanceService;
  rows$: Observable<number[]> = of([1]);
  private readonly cd: ChangeDetectorRef;

  constructor(protected injector: Injector, protected elRef: ElementRef) {
    this.cd = injector.get(ChangeDetectorRef);
    this.appearanceService = this.injector.get<AppearanceService>(AppearanceService);
    this.isDarkMode = this.appearanceService.isDarkMode();
    this.subscription = this.appearanceService.isDarkMode$.subscribe(x => this.isDarkMode = x);;
  }

  ngAfterViewInit(): void {
    this.rows$ = of(this.getRows());
    this.cd.detectChanges();// sure detect changes
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
  // Override in subclasses
  abstract getRows(): number[];
}
