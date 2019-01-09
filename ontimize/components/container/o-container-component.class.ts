import { ElementRef, forwardRef, Inject, Injector, Optional } from '@angular/core';

import { InputConverter } from '../../decorators/input-converter';
import { OFormComponent } from '../form/form-components';

export const DEFAULT_INPUTS_O_CONTAINER = [
  'oattr: attr',
  'titleLabel: title-label',
  'layoutAlign: layout-align',
  'layoutFill: layout-fill',
  'elevation',
  'icon'
];

export class OContainerComponent {

  public static DEFAULT_INPUTS_O_CONTAINER = DEFAULT_INPUTS_O_CONTAINER;

  public oattr: string;

  public titleLabel: string;
  protected _elevation: number = 0;
  protected defaultLayoutAlign: string = 'start start';
  protected _layoutAlign: string;
  @InputConverter()
  layoutFill: boolean = false;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) protected form: OFormComponent,
    protected elRef: ElementRef,
    protected injector: Injector
  ) { }

  getAttribute() {
    if (this.oattr) {
      return this.oattr;
    } else if (this.elRef && this.elRef.nativeElement.attributes['attr']) {
      return this.elRef.nativeElement.attributes['attr'].value;
    }
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
    return !!this.titleLabel;
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

}
