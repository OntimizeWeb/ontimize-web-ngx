import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { OBreadcrumb } from '../types/o-breadcrumb-item.type';

@Injectable({ providedIn: 'root' })
export class OBreadcrumbService {

  public breadcrumbs$: BehaviorSubject<OBreadcrumb[]> = new BehaviorSubject([]);

  constructor(protected injector: Injector) { }

}
