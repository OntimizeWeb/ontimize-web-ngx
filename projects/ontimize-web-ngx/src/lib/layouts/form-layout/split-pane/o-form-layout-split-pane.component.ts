import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  forwardRef,
  Inject,
  Injector,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { ResizeEvent } from 'angular-resizable-element';
import { BehaviorSubject } from 'rxjs';

import { OServiceComponent } from '../../../components/o-service-component.class';
import { OFormLayoutManagerMode } from '../../../interfaces/o-form-layout-manager-mode.interface';
import { OFormLayoutManagerComponent } from '../../../layouts/form-layout/o-form-layout-manager.component';
import { FormLayoutDetailComponentData } from '../../../types';
import { Codes } from '../../../util/codes';
import { Util } from '../../../util/util';
import { OFormLayoutManagerContentDirective } from '../directives/o-form-layout-manager-content.directive';

@Component({
  selector: 'o-form-layout-split-pane',
  templateUrl: './o-form-layout-split-pane.component.html',
  styleUrls: ['./o-form-layout-split-pane.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-form-layout-split-pane]': 'true'
  }
})
export class OFormLayoutSplitPaneComponent implements OFormLayoutManagerMode {

  data: FormLayoutDetailComponentData;
  public showLoading = new BehaviorSubject<boolean>(false);
  protected _state: any;

  protected router: Router;

  @ViewChild(OFormLayoutManagerContentDirective, { static: false })
  contentDirective: OFormLayoutManagerContentDirective;

  constructor(
    protected injector: Injector,
    protected elementRef: ElementRef,
    protected componentFactoryResolver: ComponentFactoryResolver,
    public renderer: Renderer2,
    @Inject(forwardRef(() => OFormLayoutManagerComponent)) public formLayoutManager: OFormLayoutManagerComponent
  ) {
    this.router = this.injector.get(Router);
  }

  set state(arg: any) {
    this._state = arg;
    if (Util.isDefined(arg)) {
      this.showLoading.next(true);
    } else {
      this.showLoading.next(false);
    }
  }

  get state(): any {
    return this._state;
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

  onResizeEnd(property: string, event: ResizeEvent, el: any): void {
    this.renderer.addClass(el, 'resized');
    this.renderer.setStyle(el, property, `${event.rectangle[property]}px`);
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

  getDataToStore(): object {
    return this.data;
  }

  getParams(): any {
    return Util.isDefined(this.data) ? this.data.params : undefined;
  }

  initializeComponentState(state: any) {
    if (Util.isDefined(state) && Object.keys(state).length > 0) {
      this.state = state;
      const extras = {};
      extras[Codes.QUERY_PARAMS] = state.queryParams;
      if (this.formLayoutManager) {
        this.formLayoutManager.setAsActiveFormLayoutManager();
      }
      this.router.navigate([state.url], extras);
    }
  }

  updateActiveData(data: any) {
    if (Util.isDefined(this.data)) {
      this.data = Object.assign(this.data, data);
    }
  }

  getRouteOfActiveItem(): any[] {
    const route = [];
    if (Util.isDefined(this.data)) {
      const urlSegments = this.data.urlSegments || [];
      urlSegments.forEach((segment) => {
        route.push(segment.path);
      });
      return route;
    }
    return route;
  }

  isMainComponent(comp: OServiceComponent): boolean {
    const mainContent = this.elementRef.nativeElement.getElementsByClassName('main-content')[0];
    return mainContent && comp.elementRef && mainContent.contains(comp.elementRef.nativeElement);
  }

  openDetail(detail: FormLayoutDetailComponentData) {
    this.setDetailComponent(detail);
  }

  closeDetail() {
    this.setDetailComponent(null);
  }

  updateNavigation(data: any, keysValues: any, insertionMode?: boolean) {
    // Nothing to do
  }
}
