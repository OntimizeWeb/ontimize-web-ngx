import {
  AfterViewInit,
  Component,
  Inject,
  Injector,
  Input,
  ViewChild,
  ViewEncapsulation,
  forwardRef
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

import { ILayoutManagerComponent } from '../../../interfaces/layout-manager-component.interface';
import { OFormLayoutManagerMode } from '../../../interfaces/o-form-layout-manager-mode.interface';
import { DialogService } from '../../../services/dialog.service';
import { Util } from '../../../util/util';
import { OFormLayoutManagerContentDirective } from '../directives/o-form-layout-manager-content.directive';
import { OFormLayoutManagerBase } from '../o-form-layout-manager-base.class';
import { OFormLayoutManagerService } from '../../../services/o-form-layout-manager.service';
import { FormLayoutCloseDetailOptions, FormLayoutDetailComponentData } from '../../../types';

@Component({
  standalone: true,
  imports: [MatIconModule, MatSidenavModule, FlexLayoutModule, OFormLayoutManagerContentDirective],
  selector: 'o-form-layout-sidenav',
  templateUrl: './o-form-layout-sidenav.component.html',
  styleUrls: ['./o-form-layout-sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-form-layout-sidenav]': 'true',
    '[style.--sidenav-width]': 'width'

  }
})
export class OFormLayoutSidenavComponent
  implements OFormLayoutManagerMode, AfterViewInit {

  /* ===============================
     Inputs (options directive)
     =============================== */

  @Input() position: 'start' | 'end' = 'end';
  @Input() width: string = '60%';


  @ViewChild(MatSidenav)
  sidenav: MatSidenav;

  @ViewChild(OFormLayoutManagerContentDirective)
  contentDirective: OFormLayoutManagerContentDirective;

  component: any;
  data: any;
  params: object;
  queryParams: any;
  urlSegments: any[];
  label: string;

  protected dialogService: DialogService;

  constructor(
    protected injector: Injector,
    @Inject(forwardRef(() => OFormLayoutManagerBase))
    public formLayoutManager: OFormLayoutManagerBase
  ) {
    this.dialogService = injector.get(DialogService);
  }


  ngAfterViewInit(): void {
    if (this.contentDirective && this.component) {
      const viewContainerRef = this.contentDirective.viewContainerRef;
      viewContainerRef.clear();
      viewContainerRef.createComponent(this.component);
    }
  }

  /* ===============================
     OFormLayoutManagerMode API
     =============================== */

  openDetail(detail: FormLayoutDetailComponentData): void {
    this.data = detail;
    this.component = detail.component;
    this.params = detail.params;
    this.queryParams = detail.queryParams;
    this.urlSegments = detail.urlSegments;

    this.sidenav.open();

    if (this.contentDirective && this.component) {
      const viewContainerRef = this.contentDirective.viewContainerRef;
      viewContainerRef.clear();
      viewContainerRef.createComponent(this.component);
    }

    this.updateNavigation(this.data);

    detail.rendered = true;
    detail.rendererSubject.next(true);
  }


  closeDetail(options?: FormLayoutCloseDetailOptions): void {

    if (Util.isDefined(options) && Util.isDefined(options?.exitWithoutConfirmation) && options.exitWithoutConfirmation) {
      this.sidenav.close();
      return;
    }

    if (this.formLayoutManager.hasToConfirmExit(this.data)) {
      this.dialogService
        .confirm('CONFIRM', 'MESSAGES.FORM_CHANGES_WILL_BE_LOST')
        .then(res => {
          if (res) {
            this.sidenav.close();
          }
        });
    } else {
      this.sidenav.close();
    }
  }

  updateNavigation(data: any): void {
    const service = this.injector.get(OFormLayoutManagerService);
    const context = service.context;

    this.label = context?.label
      || this.formLayoutManager.getLabelFromData(data);
  }

  updateActiveData(data: any): void {
    this.data = Object.assign(this.data, data);
  }

  getRouteOfActiveItem(): any[] {
    const parentRoute =
      this.formLayoutManager.parentFormLayoutManager?.getRouteOfActiveItem() || [];

    const segments = this.urlSegments || [];
    const route = [];

    segments.forEach((segment, index) => {
      if (parentRoute[index] !== segment.path) {
        route.push(segment.path);
      }
    });

    return route;
  }

  getParams(): any {
    return this.params;
  }

  getFormCacheData(): any {
    return this.data;
  }

  isMainComponent(comp: ILayoutManagerComponent): boolean {
    return !comp.oFormLayoutDialog;
  }

  getDataToStore(): any {
    return {
      opened: this.sidenav?.opened
    };
  }

  setModifiedState(formAttr: string, modified: boolean, confirmExit: boolean): void {
    this.data.innerFormsInfo[formAttr] = {
      modified,
      confirmOnExit: confirmExit
    };
  }

  canAddDetailComponent(): boolean {
    return !this.sidenav?.opened;
  }

  getIdOfActiveItem(): string {
    return 'sidenav';
  }
}

