import { Directive, Injector, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { AppearanceService } from "../services/appearance.service";

@Directive({})
export class OSkeletonComponent implements OnDestroy {
  isDarkMode: boolean;
  subscription: Subscription;
  appearanceService: AppearanceService;

  constructor(protected injector: Injector) {
    this.appearanceService = this.injector.get<AppearanceService>(AppearanceService);
    this.isDarkMode = this.appearanceService.isDarkMode();
    this.subscription = this.appearanceService.isDarkMode$.subscribe(x => this.isDarkMode = x);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}