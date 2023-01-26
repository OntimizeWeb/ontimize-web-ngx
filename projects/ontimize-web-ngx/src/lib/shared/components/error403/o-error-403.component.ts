import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { NavigationService, ONavigationItem } from '../../../services/navigation.service';
import { Codes } from '../../../util/codes';

@Component({
  selector: 'o-error-403',
  templateUrl: './o-error-403.component.html',
  styleUrls: ['./o-error-403.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-error-403]': 'true'
  }
})
export class Error403Component {

  protected router: Router;
  protected navigationService: NavigationService;
  protected lastPageData: ONavigationItem;

  constructor(protected injector: Injector) {
    this.router = this.injector.get(Router);
    this.navigationService = this.injector.get(NavigationService);
    this.lastPageData = this.navigationService.getLastItem();
  }

  onNavigateBackClick() {
    const extras: NavigationExtras = {};
    let route: string = '';
    if (this.lastPageData) {
      extras[Codes.QUERY_PARAMS] = this.lastPageData.queryParams;
      route = this.lastPageData.url;
    }
    this.router.navigate([route], extras);
  }
}

