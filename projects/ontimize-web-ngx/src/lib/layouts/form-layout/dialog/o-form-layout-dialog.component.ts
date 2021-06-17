import {
  AfterViewInit,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  Inject,
  Injector,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { ILayoutManagerComponent } from '../../../interfaces/layout-manager-component.interface';
import { OFormLayoutManagerMode } from '../../../interfaces/o-form-layout-manager-mode.interface';
import { OFormLayoutManagerComponent } from '../../../layouts/form-layout/o-form-layout-manager.component';
import { OFormLayoutManagerContentDirective } from '../directives/o-form-layout-manager-content.directive';

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
  formLayoutManager: OFormLayoutManagerComponent;
  queryParams: any;
  params: object;
  urlSegments: any[];
  label: string;
  title: string;
  data: any;

  protected componentFactory: ComponentFactory<any>;

  @ViewChild(OFormLayoutManagerContentDirective, { static: false }) contentDirective: OFormLayoutManagerContentDirective;

  constructor(
    public dialogRef: MatDialogRef<OFormLayoutDialogComponent>,
    protected injector: Injector,
    protected componentFactoryResolver: ComponentFactoryResolver,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    if (data.title) {
      this.title = data.title;
    }
    if (data.data) {
      this.data = data.data;
      const component = data.data.component;
      this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
      this.params = data.data.params;
      this.queryParams = data.data.queryParams;
      this.urlSegments = data.data.urlSegments;
    }
    if (data.layoutManagerComponent) {
      this.formLayoutManager = data.layoutManagerComponent;
    }
  }

  ngAfterViewInit() {
    if (this.contentDirective && this.componentFactory) {
      const viewContainerRef = this.contentDirective.viewContainerRef;
      viewContainerRef.clear();
      viewContainerRef.createComponent(this.componentFactory);
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

  closeDialog() {
    this.dialogRef.close();
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

  closeDetail() {
    this.dialogRef.close();
  }

  getDataToStore() {
    return null;
  }

  setModifiedState(modified: boolean) {

  }
}
