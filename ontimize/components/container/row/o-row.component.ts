import {Component, Inject, Injector, forwardRef,
  ElementRef, OnInit, Optional,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation} from '@angular/core';

import {CommonModule } from '@angular/common';

import {OFormComponent} from '../../form/o-form.component';
import {OTranslateService} from '../../../services';
import {OTranslateModule} from '../../../pipes/o-translate.pipe';

export const DEFAULT_INPUTS_O_ROW = [
  'oattr: attr',
  'titleLabel: title-label',
  'layoutAlign: layout-align',
  'layoutFill: layout-fill',
  'flex'


];

@Component({
  selector: 'o-row',
  templateUrl: '/container/row/o-row.component.html',
  styleUrls: ['/container/row/o-row.component.css'],
  inputs: [
    ...DEFAULT_INPUTS_O_ROW
  ],
  encapsulation: ViewEncapsulation.None
})
export class ORowComponent implements OnInit {

  public static DEFAULT_INPUTS_O_ROW = DEFAULT_INPUTS_O_ROW;

  oattr: string;
  titleLabel: string;
  protected layoutAlign: string = 'start start';

  protected translateService: OTranslateService;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) protected form: OFormComponent,
    protected elRef: ElementRef,
    protected injector: Injector) {

    this.translateService = this.injector.get(OTranslateService);
  }

  ngOnInit() {

    let innerRow = this.elRef.nativeElement.querySelectorAll('div#innerRow');
    if (innerRow) {
      innerRow.forEach(element => {
        element.setAttribute('layout-align', this.layoutAlign);
      });
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
  declarations: [ORowComponent],
  imports: [CommonModule, OTranslateModule],
  exports: [ORowComponent],
})
export class ORowModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ORowModule,
      providers: []
    };
  }
}
