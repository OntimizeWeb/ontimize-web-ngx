import {
  Component, Inject, Injector, forwardRef,
  ElementRef, OnInit, Optional,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { OFormComponent } from '../../form/o-form.component';
import { InputConverter } from '../../../decorators';
import { OTranslateService } from '../../../services';
import { OTranslateModule } from '../../../pipes/o-translate.pipe';

export const DEFAULT_INPUTS_O_COLUMN = [
  'oattr: attr',
  'titleLabel: title-label',
  'layoutAlign: layout-align',
  'layoutFill: layout-fill',
  'elevation'
];

@Component({
  selector: 'o-column',
  templateUrl: '/container/column/o-column.component.html',
  styleUrls: ['/container/column/o-column.component.css'],
  inputs: [
    ...DEFAULT_INPUTS_O_COLUMN
  ],
  encapsulation: ViewEncapsulation.None
})
export class OColumnComponent implements OnInit {

  public static DEFAULT_INPUTS_O_COLUMN = DEFAULT_INPUTS_O_COLUMN;

  oattr: string;
  titleLabel: string;
  protected layoutAlign: string = 'start start';
  @InputConverter()
  protected elevation: number = 0;

  protected translateService: OTranslateService;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) protected form: OFormComponent,
    protected elRef: ElementRef,
    protected injector: Injector) {

    this.translateService = this.injector.get(OTranslateService);
  }

  ngOnInit() {
    this.elRef.nativeElement.classList.add('o-column');
    if (this.elevation > 0) {
      let clazz = 'md-whiteframe-' + this.elevation + 'dp';
      this.elRef.nativeElement.classList.add(clazz);
      this.elRef.nativeElement.classList.add('margin-top-bottom');
    }

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

  getAttribute() {
    if (this.oattr) {
      return this.oattr;
    } else if (this.elRef && this.elRef.nativeElement.attributes['attr']) {
      return this.elRef.nativeElement.attributes['attr'].value;
    }
  }

  hasTitle(): boolean {
    return this.titleLabel && this.titleLabel.length > 0;
  }

  get title(): string {
    if (this.translateService) {
      return this.translateService.get(this.titleLabel);
    }
    return this.titleLabel;
  }

  set title(value: string) {
    var self = this;
    window.setTimeout(() => {
      self.titleLabel = value;
    }, 0);
  }

  getLayoutAlign() {
    return this.layoutAlign;
  }


}

@NgModule({
  declarations: [OColumnComponent],
  imports: [CommonModule, OTranslateModule],
  exports: [OColumnComponent],
})
export class OColumnModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OColumnModule,
      providers: []
    };
  }
}
