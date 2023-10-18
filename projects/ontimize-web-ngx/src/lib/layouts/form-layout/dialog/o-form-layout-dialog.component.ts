import {
  AfterViewInit,
  Component,
  Inject,
  Injector,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ILayoutManagerComponent } from '../../../interfaces/layout-manager-component.interface';
import { OFormLayoutManagerMode } from '../../../interfaces/o-form-layout-manager-mode.interface';
import { DialogService } from '../../../services/dialog.service';
import { Util } from '../../../util/util';
import { OFormLayoutManagerContentDirective } from '../directives/o-form-layout-manager-content.directive';
import { OFormLayoutManagerBase } from '../o-form-layout-manager-base.class';

@Component({
  selector: 'o-form-layout-dialog',
  templateUrl: './o-form-layout-dialog.component.html',
  styleUrls: ['./o-form-layout-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-form-layout-dialog]': 'true'
  }
})
export class OFormLayoutDialogComponent implements OFormLayoutManagerMode, AfterViewInit {
  formLayoutManager: OFormLayoutManagerBase;
  queryParams: any;
  params: object;
  urlSegments: any[];
  label: string;
  title: string;
  data: any;

  protected component;
  protected dialogService: DialogService;

  @ViewChild(OFormLayoutManagerContentDirective) contentDirective: OFormLayoutManagerContentDirective;

  constructor(
    public dialogRef: MatDialogRef<OFormLayoutDialogComponent>,
    protected injector: Injector,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.dialogService = injector.get(DialogService);
    if (data.title) {
      this.title = data.title;
    }
    if (data.data) {
      this.data = data.data;
      this.component = data.data.component;;
      this.params = data.data.params;
      this.queryParams = data.data.queryParams;
      this.urlSegments = data.data.urlSegments;
    }
    if (data.layoutManagerComponent) {
      this.formLayoutManager = data.layoutManagerComponent;
    }
  }

  ngAfterViewInit() {
    if (this.contentDirective && this.component) {
      const viewContainerRef = this.contentDirective.viewContainerRef;
      viewContainerRef.clear();
      viewContainerRef.createComponent(this.component);
    }
  }

  updateNavigation(data: any) {
    let label = this.formLayoutManager.getLabelFromData(data);
    if (label && label.length) {
      label = ': ' + label;
    }
    this.label = label;
  }

  updateActiveData(data: any) {
    this.data = Object.assign(this.data, data);
  }

  closeDialog(options?: any) {
    if (Util.isDefined(options) && Util.isDefined(options.exitWithoutConfirmation) && options.exitWithoutConfirmation) {
      this.dialogRef.close();
    } else {
      if (this.formLayoutManager.hasToConfirmExit(this.data)) {
        this.dialogService.confirm('CONFIRM', 'MESSAGES.FORM_CHANGES_WILL_BE_LOST').then(res => {
          if (res) {
            this.dialogRef.close();
          }
        });
      } else {
        this.dialogRef.close();
      }
    }
  }

  getRouteOfActiveItem(): any[] {
    const parentRoute = this.formLayoutManager.parentFormLayoutManager.getRouteOfActiveItem();
    const segments = (this.urlSegments || []);
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

  getFormCacheData() {
    return this.data;
  }

  isMainComponent(comp: ILayoutManagerComponent): boolean {
    return !comp.oFormLayoutDialog;
  }

  closeDetail(options) {
    this.closeDialog(options);
  }

  getDataToStore(): any {
    return null;
  }

  setModifiedState(formAttr: string, modified: boolean, confirmExit: boolean) {
    this.data.innerFormsInfo[formAttr] = {
      modified: modified,
      confirmOnExit: confirmExit
    };
  }

  canAddDetailComponent(): boolean {
    return true;
  }

  getIdOfActiveItem(): string {
    return 'dialog';
  }
}
