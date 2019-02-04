import { Component, EventEmitter, Injector, NgModule, OnInit, ViewEncapsulation, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { OTranslateService } from '../../../services';
import { OSharedModule } from '../../../shared';
import { OInputsOptions, O_INPUTS_OPTIONS } from '../../../config/app-config';
import { Util } from '../../../utils';

export const DEFAULT_INPUTS_O_SEARCH_INPUT = [
  'placeholder',
  'width'
];

export const DEFAULT_OUTPUTS_O_SEARCH_INPUT = [
  'onSearch'
];

@Component({
  moduleId: module.id,
  selector: 'o-search-input',
  templateUrl: './o-search-input.component.html',
  styleUrls: ['./o-search-input.component.scss'],
  inputs: DEFAULT_INPUTS_O_SEARCH_INPUT,
  outputs: DEFAULT_OUTPUTS_O_SEARCH_INPUT,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class.o-search-input': 'true'
  }
})
export class OSearchInputComponent implements OnInit {

  public static DEFAULT_INPUTS_O_SEARCH_INPUT = DEFAULT_INPUTS_O_SEARCH_INPUT;
  public static DEFAULT_OUTPUTS_O_SEARCH_INPUT = DEFAULT_OUTPUTS_O_SEARCH_INPUT;

  placeholder: string = 'SEARCH';
  width: string;

  onSearch: EventEmitter<any> = new EventEmitter<any>();

  protected formGroup: FormGroup;
  protected term: FormControl;

  protected translateService: OTranslateService;
  protected oInputsOptions: OInputsOptions;

  constructor(protected injector: Injector,
    protected elRef: ElementRef) {
    this.translateService = this.injector.get(OTranslateService);
    this.formGroup = new FormGroup({});
  }

  ngOnInit() {
    this.term = new FormControl();
    this.formGroup.addControl('term', this.term);

    this.term.valueChanges
      .pipe(debounceTime(400))
      .pipe(distinctUntilChanged())
      .subscribe(term => {
        this.onSearch.emit(term);
      });
  }

  ngAfterViewInit() {
    try {
      this.oInputsOptions = this.injector.get(O_INPUTS_OPTIONS);
    } catch (e) {
      this.oInputsOptions = {};
    }
    Util.parseOInputsOptions(this.elRef, this.oInputsOptions);
  }

  getFormGroup(): FormGroup {
    return this.formGroup;
  }

  getValue(): string {
    return this.term.value;
  }

  setValue(val: string) {
    this.term.setValue(val);
  }

  getFormControl(): FormControl {
    return this.term;
  }

  get placeHolder(): string {
    if (this.translateService) {
      return this.translateService.get(this.placeholder);
    }
    return this.placeholder;
  }

  set placeHolder(value: string) {
    var self = this;
    window.setTimeout(() => {
      self.placeholder = value;
    }, 0);
  }

  get hasCustomWidth(): boolean {
    return this.width !== undefined;
  }

}

@NgModule({
  declarations: [OSearchInputComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OSearchInputComponent]
})
export class OSearchInputModule { }
