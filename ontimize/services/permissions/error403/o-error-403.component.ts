import { Component, ViewEncapsulation, Injector } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Codes } from '../../../utils';
import { NavigationService, ONavigationItem } from '../../navigation.service';

@Component({
  moduleId: module.id,
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
    let extras: NavigationExtras = {};
    let route: string = '';
    if (this.lastPageData) {
      extras[Codes.QUERY_PARAMS] = this.lastPageData.queryParams;
      route = this.lastPageData.url;
    }
    this.router.navigate([route], extras);
  }
}

