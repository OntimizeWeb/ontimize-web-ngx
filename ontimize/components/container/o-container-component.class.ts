import { AfterViewInit, ElementRef, forwardRef, Inject, Injector, Optional, ViewChild } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material';

import { OFormComponent } from '../form/form-components';

export const DEFAULT_INPUTS_O_CONTAINER = [
  'oattr: attr',
  'title',
  'layoutAlign: layout-align',
  'elevation',
  'icon',
  'appearance'
];

export class OContainerComponent implements AfterViewInit {

  public static APPEARANCE_OUTLINE = 'outline';
  public static DEFAULT_INPUTS_O_CONTAINER = DEFAULT_INPUTS_O_CONTAINER;

  public oattr: string;

  public title: string;
  protected _elevation: number = 0;
  protected defaultLayoutAlign: string = 'start start';
  protected _layoutAlign: string;
  public icon: string;
  protected _appearance: string;

  @ViewChild('containerTitle') protected _titleEl: ElementRef;
  @ViewChild('container') protected _containerRef: ElementRef;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) protected form: OFormComponent,
    protected elRef: ElementRef,
    protected injector: Injector,
    @Optional() @Inject(MAT_FORM_FIELD_DEFAULT_OPTIONS) protected matFormDefaultOption
  ) { }

  ngAfterViewInit(): void {
    if (this.elRef) {
      this.elRef.nativeElement.removeAttribute('title');
    }
    if (this.getAppearanceOutline()) {
      this.updateOutlineGap();
    }
  }

  getAttribute() {
    if (this.oattr) {
      return this.oattr;
    } else if (this.elRef && this.elRef.nativeElement.attributes['attr']) {
      return this.elRef.nativeElement.attributes['attr'].value;
    }
  }

  get appearance() {
    return this._appearance;
  }

  set appearance(value: string) {
    this._appearance = value;
    setTimeout(() => { this.updateOutlineGap(); });
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

  hasHeader(): boolean {
    return !!this.title || !!this.icon;
  }

  propagateElevationToDOM() {
    this.cleanElevationCSSclasses();
    if (this.elevation > 0 && this.elevation <= 12) {
      this.elRef.nativeElement.classList.add('mat-elevation-z' + this.elevation);
    }
  }

  cleanElevationCSSclasses() {
    const classList = this.elRef.nativeElement.classList;
    if (classList && classList.length) {
      classList.forEach((item: string) => {
        if (item.startsWith('mat-elevation')) {
          this.elRef.nativeElement.classList.remove(item);
        }
      });
    }
  }

  getAppearanceOutline() {
    if (this.appearance === OContainerComponent.APPEARANCE_OUTLINE && this.hasHeader()) {
      return true;
    }
    if (!this.matFormDefaultOption) {
      return false;
    }
    return this.matFormDefaultOption.appearance === OContainerComponent.APPEARANCE_OUTLINE && this.hasHeader();
  }

  updateOutlineGap() {
    if (this.getAppearanceOutline()) {
      const titleEl = this._titleEl ? this._titleEl.nativeElement : null;

      const container = this._containerRef.nativeElement;
      if (titleEl && titleEl.children.length) {
        const containerRect = container.getBoundingClientRect();
        if (containerRect.width === 0 && containerRect.height === 0) {
          return;
        }

        const containerStart = containerRect.left;
        const labelStart = titleEl.getBoundingClientRect().left;
        const labelWidth = titleEl.offsetWidth;
        const startWidth = labelStart - containerStart;

        const startEls = container.querySelectorAll('.o-container-outline-start');
        const gapEls = container.querySelectorAll('.o-container-outline-gap');
        gapEls[0].style.width = `${labelWidth}px`;
        startEls[0].style.width = `${startWidth}px`;
      }
    }
  }

}
