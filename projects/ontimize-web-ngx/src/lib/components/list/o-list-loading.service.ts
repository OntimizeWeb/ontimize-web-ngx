import { Inject, Injectable, Optional } from "@angular/core";

import { AbstractSkeletonLoadingService } from "../../services/skeleton-loading.service";
import { OListGlobalConfig } from "../../types/o-list-global-config.type";
import { O_LIST_GLOBAL_CONFIG } from "./o-list.tokens";

/**
 * Delays showing o-list's loading skeleton the same way OTableLoadingService does for o-table,
 * so both components share the same anti-flicker feel.
 */
@Injectable()
export class OListLoadingService extends AbstractSkeletonLoadingService {

  constructor(
    @Optional() @Inject(O_LIST_GLOBAL_CONFIG) config: OListGlobalConfig
  ) {
    super(config?.loading?.threshold ?? 300, config?.loading?.minVisible ?? 300);
  }

}
