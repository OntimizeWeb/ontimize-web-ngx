import { Component, Inject, ViewEncapsulation, AfterViewInit, ComponentFactoryResolver, ViewChild, ComponentFactory, Injector, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OFormLayoutManagerContentDirective } from '../directives/o-form-layout-manager-content.directive';
import { OFormLayoutManagerComponent } from '../../../layouts/form-layout/o-form-layout-manager.component';

@Component({
  selector: 'o-form-layout-dialog',
  templateUrl: 'o-form-layout-dialog.component.html',
  styleUrls: ['o-form-layout-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-form-layout-dialog]': 'true'
  }
})
export class OFormLayoutDialogComponent implements AfterViewInit {
  formLayoutManager: OFormLayoutManagerComponent;
  queryParams: any;
  urlParams: Object;
  urlSegments: any[];
  label: string;
  title: string;
  data: any;

  protected componentFactory: ComponentFactory<any>;

  @ViewChild(OFormLayoutManagerContentDirective) contentDirective: OFormLayoutManagerContentDirective;

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
      this.urlParams = data.data.urlParams;
      this.queryParams = data.data.queryParams;
      this.urlSegments = data.data.urlSegments;
    }
    if (data.layoutManagerComponent) {
      this.formLayoutManager = data.layoutManagerComponent;
    }
  }

  @HostListener('window:keyup.esc')
  onEscKeyUp() {
    this.closeDialog();
  }

  ngAfterViewInit() {
    if (this.contentDirective && this.componentFactory) {
      let viewContainerRef = this.contentDirective.viewContainerRef;
      viewContainerRef.clear();
      viewContainerRef.createComponent(this.componentFactory);
    }
  }

  setLabel(val: string) {
    let label = val.length ? val : this.formLayoutManager.getLabelFromUrlParams(this.urlParams);
    if (label && label.length) {
      label = ': ' + label;
    }
    this.label = label;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
