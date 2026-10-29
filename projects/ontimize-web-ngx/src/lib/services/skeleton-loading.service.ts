import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Observable, timer, tap, shareReplay, distinctUntilChanged, filter, map, Subject, takeUntil } from "rxjs";

/**
 * Reactive skeleton-visibility state machine shared by o-table's and o-list's loading services:
 * delays showing the skeleton by `threshold` ms (skipped on the very first load, so the initial
 * render isn't held back) to avoid flicker on fast responses, and keeps it visible for at least
 * `minVisible` ms once shown so it doesn't disappear too abruptly.
 */
@Injectable()
export abstract class AbstractSkeletonLoadingService implements OnDestroy {

  /**
   * Tracks the raw loading state.
   * - `true`: an async operation is in progress.
   * - `false`: no loading is occurring.
   */
  private readonly loading$ = new BehaviorSubject(true);

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
   * Emits when the service is destroyed, used to clean up subscriptions.
   */
  private readonly destroy$ = new Subject<void>();

  private readonly isInitialLoad$ = new BehaviorSubject<boolean>(true);

  /**
   * @param threshold Minimum delay (ms) required before the skeleton can be displayed. Prevents
   * flickering when operations resolve quickly.
   * @param minVisible Minimum amount of time (ms) the skeleton must remain visible once shown.
   * Ensures consistent UX when operations finish quickly.
   */
  constructor(
    private readonly threshold: number,
    private readonly minVisible: number
  ) {
    this.handleShow$
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    this.handleHide$
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  protected readonly isLoading$ = this.loading$.pipe(
    distinctUntilChanged(),
    map(loading => ({ loading, shouldShow: loading })),
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
      const threshold = this.isInitialLoad$.value ? 0 : this.threshold;

      timer(threshold).subscribe(() => {
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

      if (this.isInitialLoad$.value) {
        this.isInitialLoad$.next(false);
      }

      // Only enforce delay if the skeleton was actually shown
      if (this.visibleSince !== null) {
        const elapsed = now - this.visibleSince;
        if (elapsed < this.minVisible) {
          const remaining = this.minVisible - elapsed;
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
   * Public observable exposing whether the skeleton should be visible. Reads directly off
   * `showSkeleton$` — that's the only place the threshold/minVisible timers actually write to,
   * including from their own deferred callbacks (which `handleShow$`/`handleHide$` themselves
   * don't re-emit for, since those only fire on a raw loading transition). Deriving this from
   * `handleShow$`/`handleHide$` instead (e.g. via `merge`) would only resample `showSkeleton$` at
   * the moment loading starts/stops — missing every delayed show/hide the timers make afterwards,
   * and leaving this stuck at a stale value until the next raw loading transition happened to
   * come along and resample it.
   */
  readonly showLoading$: Observable<boolean> = this.showSkeleton$.pipe(
    distinctUntilChanged(),
    shareReplay(1)
  );

  /**
   * Updates the internal loading state.
   *
   * @param value Whether loading is active.
   */
  setLoading(value: boolean): void {
    if (this.loading$.value !== value) {
      this.loading$.next(value);
    }
  }

  /**
   * Cleans up all internal subscriptions and completes streams.
   */
  ngOnDestroy(): void {
    this.destroy$.next(void 0);
    this.destroy$.complete();

    this.loading$.complete();
    this.showSkeleton$.complete();
    this.isInitialLoad$.complete();
  }

}
