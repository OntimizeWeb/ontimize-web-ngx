import { Inject, Injectable, NgZone, OnDestroy, Optional } from "@angular/core";
import { BehaviorSubject, timer, tap, shareReplay, distinctUntilChanged, filter, map, merge, Subject, takeUntil } from "rxjs";
import { OTableGlobalConfig } from "../../types";
import { O_TABLE_GLOBAL_CONFIG } from "./utils/o-table.tokens";

@Injectable()
export class OTableLoadingService implements OnDestroy  {

  /**
     * Tracks the raw loading state.
     * - `true`: an async operation is in progress.
     * - `false`: no loading is occurring.
     */
  private readonly loading$ = new BehaviorSubject(false);

  /**
   * Minimum delay (ms) required before the skeleton can be displayed.
   * Prevents flickering when operations resolve quickly.
   */
  private readonly THRESHOLD: number = 300;

  /**
   * Minimum amount of time (ms) the skeleton must remain visible once shown.
   * Ensures consistent UX when operations finish quickly.
   */
  private readonly MIN_VISIBLE: number = 300;

  /**
   * Timestamp indicating when the skeleton was made visible.
   * Used to enforce the minimum visible duration.
   */
  private visibleSince: number | null = null;

  /**
   * Tracks the actual skeleton visibility state.
   */
  private readonly showSkeleton$ = new BehaviorSubject<boolean>(false);

  /**
   * Indicates whether UI interaction is blocked during processing.
   */
  private readonly processingBlocked$ = new BehaviorSubject<boolean>(false);

  /**
   * Emits when the service is destroyed, used to clean up subscriptions.
   */
  private readonly destroy$ = new Subject<void>();

  constructor(
    @Optional() @Inject(O_TABLE_GLOBAL_CONFIG) private readonly config: OTableGlobalConfig,
    private readonly ngZone: NgZone
  ) {

    // Load configurable defaults if provided
    this.THRESHOLD = config?.loading?.threshold ?? this.THRESHOLD;
    this.MIN_VISIBLE = config?.loading?.minVisible ?? this.MIN_VISIBLE;

    this.handleProcessingBlock$
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    this.handleShow$
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    this.handleHide$
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    /**
    * Public observable exposing whether the skeleton should be visible.
    */
    this.showLoading$ = this.showSkeleton$.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(),
      shareReplay(1)
    );
  }

  private readonly isLoading$ = this.loading$.pipe(
    distinctUntilChanged(),
    map(loading => ({ loading, shouldShow: loading })),
    shareReplay(1)
  );



  /**
  * Internal stream that handles immediate UI blocking whenever loading starts.
  */
  private readonly handleProcessingBlock$ = this.isLoading$.pipe(
    tap(state => {
      const shouldBlock = state.shouldShow;

      if (this.processingBlocked$.value !== shouldBlock) {
        this.processingBlocked$.next(shouldBlock);
      }
    })
  );

  /**
 * Public observable indicating whether the UI is currently blocked.
 * Prevents users from interacting during protected operations.
 */
  readonly isProcessing$ = this.processingBlocked$.pipe(
    distinctUntilChanged(),
    shareReplay(1)
  );

  /**
     * Internal stream that manages displaying the skeleton using
     * a non-cancelable threshold timer.
     *
     * If loading is still active once the threshold expires,
     * the skeleton becomes visible.
     */
  private readonly handleShow$ = this.isLoading$.pipe(
    filter(state => state.shouldShow),
    tap(() => {
      timer(this.THRESHOLD).subscribe(() => {
        if (this.loading$.value) {
          this.visibleSince = performance.now();
          this.showSkeleton$.next(true);
        }
      });
    })
  );
  /**
     * Internal stream that manages hiding the skeleton while enforcing
     * the minimum visible duration.
     */
  private readonly handleHide$ = this.isLoading$.pipe(
    filter(state => !state.shouldShow),
    tap(() => {
      const now = performance.now();

      // Only enforce delay if the skeleton was actually shown
      if (this.visibleSince !== null) {
        const elapsed = now - this.visibleSince;

        if (elapsed < this.MIN_VISIBLE) {
          const remaining = this.MIN_VISIBLE - elapsed;
          timer(remaining).subscribe(() => {
            this.visibleSince = null;
            this.showSkeleton$.next(false);
          });
        } else {
          this.visibleSince = null;
          this.showSkeleton$.next(false);
        }
      }
    })
  );
  /**
    * Combined observable for activating reactive flows.
    * The *actual* skeleton state is controlled by `showSkeleton$`.
    */
  readonly showLoading$ = merge(
    this.handleShow$,
    this.handleHide$
  ).pipe(
    map(() => this.showSkeleton$.value),
    distinctUntilChanged(),
    shareReplay(1)
  );

  // ---------------------------------------------------------
  // PUBLIC API METHODS
  // ---------------------------------------------------------

  /**
   * Updates the internal loading state.
   * Prevents enabling loading while a processing block is active.
   *
   * @param value Whether loading is active.
   */
  setLoading(value: boolean): void {
    if (value && this.isBlocked()) {
      return;
    }
    if (this.loading$.value !== value) {
      this.loading$.next(value);
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
   * @param operation Optional name of the operation for debugging/logs.
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

  /**
   * Cleans up all internal subscriptions and completes streams.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.loading$.complete();
    this.showSkeleton$.complete();
    this.processingBlocked$.complete();
  }

}