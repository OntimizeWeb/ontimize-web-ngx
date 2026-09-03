import { fakeAsync, tick } from '@angular/core/testing';

import { AbstractSkeletonLoadingService } from './skeleton-loading.service';

class TestSkeletonLoadingService extends AbstractSkeletonLoadingService {
  constructor(threshold: number, minVisible: number) {
    super(threshold, minVisible);
  }
}

describe('AbstractSkeletonLoadingService', () => {
  let service: TestSkeletonLoadingService;
  let values: boolean[];

  beforeEach(() => {
    service = new TestSkeletonLoadingService(300, 300);
    // Mirrors how o-table/o-list/o-grid actually wire this up: they subscribe to their own
    // (BehaviorSubject-backed) loadingSubject right in their constructor, which starts at
    // `false` and so immediately flushes one synchronous `setLoading(false)` before any real
    // query ever runs.
    service.setLoading(false);
    values = [];
    service.showLoading$.subscribe(v => values.push(v));
  });

  afterEach(() => {
    service.ngOnDestroy();
  });

  it('does not show the skeleton for a load that resolves before the threshold', fakeAsync(() => {
    service.setLoading(true);
    tick(200);
    service.setLoading(false);
    tick(500);

    expect(values).not.toContain(true);
  }));

  it('shows the skeleton once the threshold elapses for a slow load, and hides it once loading stops and minVisible has elapsed', fakeAsync(() => {
    service.setLoading(true);
    tick(300);

    expect(values[values.length - 1]).toBe(true);

    service.setLoading(false);
    tick(300);

    expect(values[values.length - 1]).toBe(false);
  }));

  it('keeps the skeleton visible for at least minVisible even if loading stops right after it appears', fakeAsync(() => {
    service.setLoading(true);
    tick(300);
    expect(values[values.length - 1]).toBe(true);

    service.setLoading(false);
    tick(100);
    // minVisible (300ms since it became visible) hasn't elapsed yet
    expect(values[values.length - 1]).toBe(true);

    tick(200);
    expect(values[values.length - 1]).toBe(false);
  }));
});
