import { AfterContentChecked, AfterViewInit, ElementRef, Inject, Injector, OnDestroy, Optional, ViewChild, Directive } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { Util } from '../../util/util';

export const DEFAULT_INPUTS_O_CONTAINER = [
  'oattr: attr',
  'title',
  'layoutAlign: layout-align',
  'elevation',
  'icon',
  'appearance',
  'layoutGap: layout-gap'
];

@Directive({
  inputs: DEFAULT_INPUTS_O_CONTAINER
})
export class OContainerComponent implements AfterViewInit, OnDestroy, AfterContentChecked {

  public static APPEARANCE_OUTLINE = 'outline';

  public oattr: string;

  public title: string;
  protected _elevation: number = 0;
  protected defaultLayoutAlign: string = 'start start';
  protected _layoutAlign: string;
  public icon: string;
  protected _appearance: string;
  protected _layoutGap: string;
  private _outlineGapCalculationNeededImmediately = false;

  protected titleObserver = new MutationObserver(() => this.updateOutlineGap());

  protected _titleEl: ElementRef;
  @ViewChild('containerTitle') set containerTitle(elem: ElementRef) {
    this._titleEl = elem;
    if (this._titleEl) {
      this.registerObserver();
      this.updateOutlineGap(); // This must be triggered when title container is re-registered
    } else {
      this.unRegisterObserver();
    }
  }
  @ViewChild('container', { static: true }) protected _containerRef: ElementRef;

  constructor(
    protected elRef: ElementRef,
    protected injector: Injector,
    @Optional() @Inject(MAT_FORM_FIELD_DEFAULT_OPTIONS) protected matFormDefaultOption
  ) { }

  ngAfterViewInit(): void {
    if (this.elRef) {
      this.elRef.nativeElement.removeAttribute('title');
    }
    this.registerObserver();
  }

  ngAfterContentChecked() {
    if (this._outlineGapCalculationNeededImmediately) {
      this.updateOutlineGap();
    }
  }

  ngOnDestroy(): void {
    this.unRegisterObserver();
  }

  public getAttribute() {
    if (this.oattr) {
      return this.oattr;
    } else if (this.elRef && this.elRef.nativeElement.attributes.attr) {
      return this.elRef.nativeElement.attributes.attr.value;
    }
  }

  get appearance() {
    return this._appearance;
  }

  set appearance(value: string) {
    this._appearance = value;
    setTimeout(() => { this.updateOutlineGap(); }, 0);
  }

  get elevation() {
    return this._elevation;
  }

  set elevation(elevation: number) {
    this._elevation = elevation;
    this.propagateElevationToDOM();
  }

  get layoutAlign() {
    return this._layoutAlign;
  }

  set layoutAlign(align: string) {
    if (!align || align.length === 0) {
      align = this.defaultLayoutAlign;
    }
    this._layoutAlign = align;
  }

  get layoutGap() {
    return this._layoutGap;
  }

  set layoutGap(layoutGap: string) {
    this._layoutGap = layoutGap;
  }

  public hasHeader(): boolean {
    return !!this.title || !!this.icon;
  }

  isAppearanceOutlineSetted(): boolean {
    let isAppearanceSetted = false;
    if (Util.isDefined(this.appearance)) {
      isAppearanceSetted = this.appearance === OContainerComponent.APPEARANCE_OUTLINE;
    }
    return isAppearanceSetted;
  }

  public hasHeaderOrAppearanceOutlineSetted(): boolean {
    return this.isAppearanceOutlineSetted() || this.hasHeader();
  }

  public hasHeaderAndAppearanceOutline(): boolean {
    return this.isAppearanceOutline() && this.hasHeader();
  }

  public isAppearanceOutline(): boolean {
    let isAppearanceOutline = (this.matFormDefaultOption && this.matFormDefaultOption.appearance === OContainerComponent.APPEARANCE_OUTLINE);
    if (Util.isDefined(this.appearance)) {
      isAppearanceOutline = this.appearance === OContainerComponent.APPEARANCE_OUTLINE;
    }
    return isAppearanceOutline;
  }

  public hasTitleInAppearanceOutline(): boolean {
    return this.isAppearanceOutline() && this.hasHeader();
  }

  protected propagateElevationToDOM(): void {
    this.cleanElevationCSSclasses();
    if (this.elevation > 0 && this.elevation <= 12) {
      this.elRef.nativeElement.classList.add('mat-elevation-z' + this.elevation);
    }
  }

  protected cleanElevationCSSclasses(): void {
    const classList = Array.from(this.elRef.nativeElement.classList || []);
    if (classList && classList.length) {
      classList.forEach((item: string) => {
        if (item.startsWith('mat-elevation')) {
          this.elRef.nativeElement.classList.remove(item);
        }
      });
    }
  }

  protected updateOutlineGap(): void {
    if (this.isAppearanceOutline()) {
      const titleEl = this._titleEl ? this._titleEl.nativeElement : null;

      if (!this._containerRef) {
        return;
      }
      if (document.documentElement && !document.documentElement.contains(this.elRef.nativeElement)) {
        this._outlineGapCalculationNeededImmediately = true;
        return;
      }

      const container = this._containerRef.nativeElement;
      const containerRect = container.getBoundingClientRect();
      if (containerRect.width === 0 && containerRect.height === 0) {
        return;
      }

      const containerStart = containerRect.left;
      const labelStart = titleEl.getBoundingClientRect().left;
      const labelWidth = this.hasHeader() ? titleEl.offsetWidth : 0;
      const startWidth = labelStart - containerStart;

      const startEls = container.querySelectorAll('.o-container-outline-start');
      const gapEls = container.querySelectorAll('.o-container-outline-gap');
      gapEls[0].style.width = `${labelWidth}px`;
      startEls[0].style.width = `${startWidth}px`;
      this._outlineGapCalculationNeededImmediately = false;
    }
  }

  protected registerObserver(): void {
    if (this._titleEl) {
      this.titleObserver.observe(this._titleEl.nativeElement, {
        childList: true,
        characterData: true,
        subtree: true
      });
    }
  }

  protected unRegisterObserver(): void {
    if (this.titleObserver) {
      this.titleObserver.disconnect();
    }
  }

}
