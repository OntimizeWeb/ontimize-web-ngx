import {
  Component, Inject, Injector, forwardRef,
  ElementRef, OnInit, Optional,
  NgModule,
  ViewEncapsulation
} from '@angular/core';

import { OFormComponent } from '../../form/o-form.component';
import { OTranslateService } from '../../../services';
import { OSharedModule } from '../../../shared';

export const DEFAULT_INPUTS_O_COLUMN = [
  'oattr: attr',
  'titleLabel: title-label',
  'layoutAlign: layout-align',
  'layoutFill: layout-fill',
  'elevation'
];

@Component({
  selector: 'o-column',
  template: require('./o-column.component.html'),
  styles: [require('./o-column.component.scss')],
  inputs: [
    ...DEFAULT_INPUTS_O_COLUMN
  ],
  encapsulation: ViewEncapsulation.None
})
export class OColumnComponent implements OnInit {

  public static DEFAULT_INPUTS_O_COLUMN = DEFAULT_INPUTS_O_COLUMN;

  oattr: string;

  protected _titleLabel: string;
  protected _elevation: number = 0;
  protected defaultLayoutAlign: string = 'start start';
  protected _layoutAlign: string;
  protected translateService: OTranslateService;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) protected form: OFormComponent,
    protected elRef: ElementRef,
    protected injector: Injector) {

    this.translateService = this.injector.get(OTranslateService);
  }

  ngOnInit() {
    this.elRef.nativeElement.classList.add('o-row');
    if (this.layoutAlign === undefined) {
      this.propagateLayoutAligmentToDOM();
    }
  }

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
    this.propagatePaddingToDOM();
  }

  get layoutAlign() {
    return this._layoutAlign;
  }

  set layoutAlign(align: string) {
    if (!align || align.length === 0) {
      align = this.defaultLayoutAlign;
    }
    this._layoutAlign = align;
    this.propagateLayoutAligmentToDOM();
  }

  hasTitle(): boolean {
    return this._titleLabel && this._titleLabel.length > 0;
  }

  get titleLabel(): string {
    if (this.translateService) {
      return this.translateService.get(this._titleLabel);
    }
    return this._titleLabel;
  }

  set titleLabel(value: string) {
    this._titleLabel = value;
    this.propagatePaddingToDOM();
  }

  propagatePaddingToDOM() {
    let innerCol = this.elRef.nativeElement.querySelectorAll('div#innerCol');
    if (innerCol.length) {
      var self = this;
      let element = innerCol[0]; // Take only first, nested element does not matter.
      if (self.hasTitle()
        || (self.elevation > 0 && self.elevation <= 12)) {
        element.classList.add('container-content');
      } else {
        element.classList.remove('container-content');
      }
    }
  }

  propagateLayoutAligmentToDOM() {
    let innerCol = this.elRef.nativeElement.querySelectorAll('div#innerCol');
    if (innerCol.length) {
      var self = this;
      let element = innerCol[0]; // Take only first, nested element does not matter.
      element.setAttribute('layout-align', this.layoutAlign);
      if (self.hasTitle()) {
        element.classList.add('container-content');
      }
    }
  }

  propagateElevationToDOM() {
    this.cleanElevationCSSclasses();
    if (this.elevation > 0 && this.elevation <= 12) {
      let clazz = 'mat-elevation-z' + this.elevation;
      this.elRef.nativeElement.classList.add(clazz);
      this.elRef.nativeElement.classList.add('margin-top-bottom');
    }
  }

  cleanElevationCSSclasses() {
    let arr_ = this.elRef.nativeElement.classList;
    if (arr_ && arr_.length) {
      var self = this;
      arr_.forEach((item, index) => {
        if (item.startsWith('mat-elevation')) {
          self.elRef.nativeElement.classList.remove(item);
        }
      });
    }
  }


}

@NgModule({
  declarations: [OColumnComponent],
  imports: [OSharedModule],
  exports: [OColumnComponent],
})
export class OColumnModule {
}
