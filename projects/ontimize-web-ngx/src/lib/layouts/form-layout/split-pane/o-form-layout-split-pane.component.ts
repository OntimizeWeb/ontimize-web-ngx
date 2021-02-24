import { Component, ComponentFactoryResolver, ElementRef, forwardRef, Inject, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { OFormLayoutSplitPane } from '../../../interfaces/o-form-layout-split-pane.interface';
import { OFormLayoutManagerComponent } from '../../../layouts/form-layout/o-form-layout-manager.component';
import { FormLayoutDetailComponentData } from '../../../types';
import { OFormLayoutManagerContentDirective } from '../directives/o-form-layout-manager-content.directive';


@Component({
  selector: 'o-form-layout-split-pane',
  templateUrl: 'o-form-layout-split-pane.component.html',
  styleUrls: ['o-form-layout-split-pane.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-form-layout-split-pane]': 'true'
  }
})
export class OFormLayoutSplitPaneComponent implements OFormLayoutSplitPane {

  protected data: FormLayoutDetailComponentData;

  @ViewChild(OFormLayoutManagerContentDirective, { static: false })
  contentDirective: OFormLayoutManagerContentDirective;

  constructor(
    protected injector: Injector,
    public elementRef: ElementRef,
    protected componentFactoryResolver: ComponentFactoryResolver,
    @Inject(forwardRef(() => OFormLayoutManagerComponent)) protected formLayoutManager: OFormLayoutManagerComponent
  ) {

  }

  getFormCacheData(): FormLayoutDetailComponentData {
    return this.data;
  }

  setModifiedState(modified: boolean) {
    this.data.modified = modified;
  }

  setDetailComponent(compData: FormLayoutDetailComponentData) {
    this.data = compData;
    this.createComponent();
  }

  protected createComponent() {
    if (!this.data) {
      this.contentDirective.viewContainerRef.clear();
      return;
    }
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.data.component);
    if (this.contentDirective && componentFactory) {
      const viewContainerRef = this.contentDirective.viewContainerRef;
      viewContainerRef.clear();
      viewContainerRef.createComponent(componentFactory);
    }
  }
}
