import { Injectable } from "@angular/core";

import { AbstractSkeletonLoadingService } from "../../services/skeleton-loading.service";

/**
 * Delays showing o-grid's loading skeleton the same way OTableLoadingService does for o-table,
 * so all three components share the same anti-flicker feel.
 */
@Injectable()
export class OGridLoadingService extends AbstractSkeletonLoadingService {

  constructor() {
    super(300, 300);
  }

}
