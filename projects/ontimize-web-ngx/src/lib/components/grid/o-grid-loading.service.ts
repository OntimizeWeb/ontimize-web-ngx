import { Inject, Injectable, Optional } from "@angular/core";

import { AbstractSkeletonLoadingService } from "../../services/skeleton-loading.service";
import { OGridGlobalConfig } from "../../types/o-grid-global-config.type";
import { O_GRID_GLOBAL_CONFIG } from "./o-grid.tokens";

/**
 * Delays showing o-grid's loading skeleton the same way OTableLoadingService does for o-table,
 * so all three components share the same anti-flicker feel.
 */
@Injectable()
export class OGridLoadingService extends AbstractSkeletonLoadingService {

  constructor(
    @Optional() @Inject(O_GRID_GLOBAL_CONFIG) config: OGridGlobalConfig
  ) {
    super(config?.loading?.threshold ?? 300, config?.loading?.minVisible ?? 300);
  }

}
