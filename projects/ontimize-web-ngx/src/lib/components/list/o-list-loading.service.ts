import { Injectable } from "@angular/core";

import { AbstractSkeletonLoadingService } from "../../services/skeleton-loading.service";

/**
 * Delays showing o-list's loading skeleton the same way OTableLoadingService does for o-table,
 * so both components share the same anti-flicker feel.
 */
@Injectable()
export class OListLoadingService extends AbstractSkeletonLoadingService {

  constructor() {
    super(300, 300);
  }

}
