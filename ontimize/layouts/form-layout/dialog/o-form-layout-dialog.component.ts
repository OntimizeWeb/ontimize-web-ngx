import { Component, Inject, ViewEncapsulation, OnInit, AfterViewInit, ComponentFactoryResolver, ViewChild, ComponentFactory, Injector } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
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

export class OFormLayoutDialogComponent implements OnInit, AfterViewInit {
  formLayoutManager: OFormLayoutManagerComponent;
  queryParams: any;
  urlParams: Object;
  urlSegments: any[];

  protected componentFactory: ComponentFactory<any>;
  mode: string = 'dialog';

  @ViewChild(OFormLayoutManagerContentDirective) contentDirective: OFormLayoutManagerContentDirective;

  constructor(
    public dialogRef: MdDialogRef<OFormLayoutDialogComponent>,
    protected injector: Injector,
    protected componentFactoryResolver: ComponentFactoryResolver,
    @Inject(MD_DIALOG_DATA) data: any
  ) {
    if (data.childRoute) {
      const component = data.childRoute.routeConfig.component;
      this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
      this.urlParams = data.childRoute.params;
      this.queryParams = data.childRoute.queryParams;
      this.urlSegments = data.childRoute.url;
    }
    if (data.layoutManagerComponent) {
      this.formLayoutManager = data.layoutManagerComponent;
    }
  }

  ngOnInit() {
    // TODO
  }

  ngAfterViewInit() {
    if (this.contentDirective && this.componentFactory) {
      let viewContainerRef = this.contentDirective.viewContainerRef;
      viewContainerRef.clear();
      viewContainerRef.createComponent(this.componentFactory);
    }
  }

}
