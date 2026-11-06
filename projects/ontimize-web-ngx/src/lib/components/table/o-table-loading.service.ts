import { Inject, Injectable, Optional } from "@angular/core";
import { BehaviorSubject, distinctUntilChanged, shareReplay } from "rxjs";

import { O_TABLE_GLOBAL_CONFIG } from "./utils/o-table.tokens";
import { OTableGlobalConfig } from "../../types/table/o-table-global-config.type";
import { AbstractSkeletonLoadingService } from "../../services/skeleton-loading.service";

@Injectable()
export class OTableLoadingService extends AbstractSkeletonLoadingService {

  /**
   * Indicates whether UI interaction is blocked during processing.
   */
  private readonly processingBlocked$ = new BehaviorSubject<boolean>(false);

  /**
   * Public observable indicating whether the UI is currently blocked.
   * Prevents users from interacting during protected operations.
   */
  readonly isProcessing$ = this.processingBlocked$.pipe(
    distinctUntilChanged(),
    shareReplay(1)
  );

  constructor(
    @Optional() @Inject(O_TABLE_GLOBAL_CONFIG) config: OTableGlobalConfig
  ) {
    super(config?.loading?.threshold ?? 300, config?.loading?.minVisible ?? 300);
  }

  // ---------------------------------------------------------
  // PUBLIC API METHODS
  // ---------------------------------------------------------

  /**
   * Updates the internal loading state.
   * Prevents enabling loading while a processing block is active.
   *
   * @param value Whether loading is active.
   */
  override setLoading(value: boolean): void {
    if (value && this.isBlocked()) {
      return;
    }
    super.setLoading(value);

    if (this.processingBlocked$.value !== value) {
      this.processingBlocked$.next(value);
    }
  }

  /**
   * Returns whether the UI is currently blocked.
   */
  isBlocked(): boolean {
    return this.processingBlocked$.value;
  }

  /**
   * Manually toggles the UI processing-block state.
   *
   * @param value Whether the UI should be blocked.
   */
  setProcessingBlock(value: boolean): void {
    if (this.processingBlocked$.value !== value) {
      this.processingBlocked$.next(value);
    }
  }


  // ---------------------------------------------------------
  // CLICK PROTECTION
  // ---------------------------------------------------------

  /**
   * Protects user interactions (clicks) from firing while a protected
   * operation is already in progress.
   *
   * @param event Optional mouse event to stop propagation.
   * @returns `true` if the click should be processed, otherwise `false`.
   */
  handleProtected(event?: MouseEvent): boolean {
    if (this.isBlocked()) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      return false;
    }

    this.setLoading(true);
    return true;
  }


  // ---------------------------------------------------------
  // LIFECYCLE
  // ---------------------------------------------------------

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.processingBlocked$.complete();
  }

}
