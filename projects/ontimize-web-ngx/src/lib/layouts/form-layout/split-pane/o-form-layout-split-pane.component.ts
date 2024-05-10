import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  forwardRef,
  Inject,
  Injector,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { ResizeEvent } from 'angular-resizable-element';
import { BehaviorSubject, Observable } from 'rxjs';

import { ILayoutManagerComponent } from '../../../interfaces/layout-manager-component.interface';
import { OFormLayoutManagerMode } from '../../../interfaces/o-form-layout-manager-mode.interface';
import { OFormLayoutManagerComponent } from '../../../layouts/form-layout/o-form-layout-manager.component';
import { DialogService } from '../../../services/dialog.service';
import { OFormLayoutManagerComponentStateClass } from '../../../services/state/o-form-layout-manager-component-state.class';
import { FormLayoutDetailComponentData } from '../../../types/form-layout-detail-component-data.type';
import { Codes } from '../../../util/codes';
import { Util } from '../../../util/util';
import { OFormLayoutManagerContentDirective } from '../directives/o-form-layout-manager-content.directive';

export const DEFAULT_INPUTS_O_FORM_LAYOUT_SPLIT_PANE = [
  'options'
];

export const DEFAULT_OUTPUTS_O_FORM_LAYOUT_SPLIT_PANE = [
];

@Component({
  selector: 'o-form-layout-split-pane',
  templateUrl: './o-form-layout-split-pane.component.html',
  styleUrls: ['./o-form-layout-split-pane.component.scss'],
  inputs: DEFAULT_INPUTS_O_FORM_LAYOUT_SPLIT_PANE,
  outputs: DEFAULT_OUTPUTS_O_FORM_LAYOUT_SPLIT_PANE,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-form-layout-split-pane]': 'true'
  }
})
export class OFormLayoutSplitPaneComponent implements AfterViewInit, OFormLayoutManagerMode {

  data: FormLayoutDetailComponentData;
  public showLoading = new BehaviorSubject<boolean>(false);

  protected router: Router;

  @ViewChild(OFormLayoutManagerContentDirective, { static: false })
  contentDirective: OFormLayoutManagerContentDirective;

  @ViewChild('mainWrapper', { read: ElementRef, static: false })
  protected mainWrapper: ElementRef;

  @ViewChild('detailWrapper', { read: ElementRef, static: false })
  protected detailWrapper: ElementRef;

  protected _options: any;

  public set options(value: any) {
    if (Util.isDefined(value) && Object.keys(value).length !== 0) {
      this._options = value;
    }
  }

  protected dialogService: DialogService;

  constructor(
    protected injector: Injector,
    protected elementRef: ElementRef,
    protected componentFactoryResolver: ComponentFactoryResolver,
    public renderer: Renderer2,
    @Inject(forwardRef(() => OFormLayoutManagerComponent)) public formLayoutManager: OFormLayoutManagerComponent
  ) {
    this.router = this.injector.get(Router);
    this.dialogService = injector.get(DialogService);
  }

  get state(): OFormLayoutManagerComponentStateClass {
    return this.formLayoutManager.state;
  }

  ngAfterViewInit() {
    if (this.mainWrapper && this.mainWrapper.nativeElement) {
      this.setOption(this.mainWrapper.nativeElement, 'mainWidth', 'width');
      this.setOption(this.mainWrapper.nativeElement, 'mainMaxWidth', 'max-width');
      this.setOption(this.mainWrapper.nativeElement, 'mainMinWidth', 'min-width');
    }
    if (this.detailWrapper && this.detailWrapper.nativeElement) {
      this.setOption(this.detailWrapper.nativeElement, 'detailWidth', 'width');
      this.setOption(this.detailWrapper.nativeElement, 'detailMaxWidth', 'max-width');
      this.setOption(this.detailWrapper.nativeElement, 'detailMinWidth', 'min-width');
    }
    this.initializeComponentState();
  }

  protected setOption(el: any, optionName: string, propertyName: string) {
    if (Util.isDefined(this._options[optionName])) {
      this.renderer.setStyle(el, propertyName, this._options[optionName]);
    }
  }

  getFormCacheData(): FormLayoutDetailComponentData {
    return this.data;
  }

  setModifiedState(formAttr: string, modified: boolean, confirmExit: boolean) {
    this.data.innerFormsInfo[formAttr] = {
      modified: modified,
      confirmOnExit: confirmExit
    };
  }

  setDetailComponent(compData: FormLayoutDetailComponentData) {
    this.data = compData;
    this.createComponent();
  }

  onResizeEnd(property: string, event: ResizeEvent, el: any): void {
    this.renderer.addClass(el, 'resized');
    this.renderer.setStyle(el, property, `${event.rectangle[property]}px`);
  }

  onValidateResize(event: ResizeEvent): boolean {
    if (event.rectangle.width) {
      return this.validateOption('detailMinWidth', this.detailWrapper, event.rectangle.width)
        && this.validateOption('detailMaxWidth', this.detailWrapper, event.rectangle.width)
        && this.validateOption('mainMaxWidth', this.mainWrapper, event.rectangle.width)
        && this.validateOption('mainMinWidth', this.mainWrapper, event.rectangle.width);
    }
    return true;
  }

  protected validateOption(option: string, wrapper: ElementRef, width: number): boolean {
    if (this._options[option]) {
      if (option.indexOf('main') > -1) {
        width = wrapper.nativeElement.parentNode.clientWidth - width;
      }

      let optionValueParsedToNumber: number;
      try {
        optionValueParsedToNumber = this.parseOptionValue(option, wrapper);
      } catch (e) {
        console.warn('o-form-layout-split-pane: Input ' + option + ' has a incorrect value ' + this._options[option]);
        return true;
      }

      if (option.indexOf('Min') > -1 && optionValueParsedToNumber > width) {
        return false;
      }
      if (option.indexOf('Max') > -1 && width > optionValueParsedToNumber) {
        return false;
      }
    }
    return true;
  }

  protected parseOptionValue(option: string, wrapper: ElementRef): number {
    return Util.checkPixelsValueString(this._options[option]) ?
      this.getPixelNumberValue(option) :
      this.calculatePercentage(wrapper, option);
  }

  protected getPixelNumberValue(option: string): number {
    const pixelValueString = this._options[option];
    const widthValueInPixels = parseFloat(pixelValueString.substr(0, pixelValueString.length - 'px'.length));
    if (isNaN(widthValueInPixels)) {
      throw new Error('Error parsed ' + option);
    } else {
      return widthValueInPixels;
    }
  }

  protected calculatePercentage(element: ElementRef, option: string): number {
    const percentageValueString = this._options[option];
    const widthValue = element.nativeElement.parentNode.clientWidth * parseFloat(percentageValueString) / 100;

    if (isNaN(widthValue)) {
      throw new Error('Error parsed ' + option);
    } else {
      return widthValue;
    }
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

  getDataToStore(): any {
    return this.data;
  }

  getParams(): any {
    return Util.isDefined(this.data) ? this.data.params : undefined;
  }

  initializeComponentState() {
    if (!Util.isDefined(this.state) || !Util.isDefined(this.state.url)) {
      return;
    }

    this.showLoading.next(true);
    const extras = {};
    extras[Codes.QUERY_PARAMS] = this.state.queryParams;

    if (this.formLayoutManager) {
      this.formLayoutManager.setAsActiveFormLayoutManager();
    }

    this.router.navigate([this.state.url], extras).then(() => {
      this.showLoading.next(false);
    });

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

  isMainComponent(comp: ILayoutManagerComponent): boolean {
    return this.mainWrapper && this.mainWrapper.nativeElement
      && comp.elementRef && this.mainWrapper.nativeElement.contains(comp.elementRef.nativeElement);
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

  canAddDetailComponent(): boolean | Observable<boolean> {
    if (!Util.isDefined(this.data) || !this.formLayoutManager.hasToConfirmExit(this.data)) {
      return true;
    }

    return new Observable(observer => {
      this.dialogService.confirm('CONFIRM', 'MESSAGES.FORM_CHANGES_WILL_BE_LOST').then(res => {
        observer.next(res);
        observer.complete()
      });
    });
  }

  getIdOfActiveItem(): string {
    return 'split-pane';
  }
}
