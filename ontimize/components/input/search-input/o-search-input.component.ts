import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Injector, NgModule, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { O_INPUTS_OPTIONS, OInputsOptions } from '../../../config/app-config';
import { OTranslateService } from '../../../services';
import { OSharedModule } from '../../../shared';
import { Util } from '../../../utils';
import { FloatLabelType } from '@angular/material';

export const DEFAULT_INPUTS_O_SEARCH_INPUT = [
  'placeholder',
  'width',
  'floatLabel: float-label'
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
    '[class.o-search-input]': 'true'
  }
})
export class OSearchInputComponent implements OnInit {

  public static DEFAULT_INPUTS_O_SEARCH_INPUT = DEFAULT_INPUTS_O_SEARCH_INPUT;
  public static DEFAULT_OUTPUTS_O_SEARCH_INPUT = DEFAULT_OUTPUTS_O_SEARCH_INPUT;

  public placeholder: string = 'SEARCH';
  public width: string;

  public onSearch: EventEmitter<any> = new EventEmitter<any>();

  protected formGroup: FormGroup;
  protected term: FormControl;

  protected translateService: OTranslateService;
  protected oInputsOptions: OInputsOptions;
  /* Inputs */
  protected _floatLabel: FloatLabelType;

  constructor(
    protected injector: Injector,
    protected elRef: ElementRef
  ) {
    this.translateService = this.injector.get(OTranslateService);
    this.formGroup = new FormGroup({});
  }

  public ngOnInit(): void {
    this.term = new FormControl();
    this.formGroup.addControl('term', this.term);

    this.term.valueChanges
      .pipe(debounceTime(400))
      .pipe(distinctUntilChanged())
      .subscribe(term => {
        this.onSearch.emit(term);
      });
  }

  public ngAfterViewInit(): void {
    try {
      this.oInputsOptions = this.injector.get(O_INPUTS_OPTIONS);
    } catch (e) {
      this.oInputsOptions = {};
    }
    Util.parseOInputsOptions(this.elRef, this.oInputsOptions);
  }

  public getFormGroup(): FormGroup {
    return this.formGroup;
  }

  public getValue(): string {
    return this.term.value;
  }

  public setValue(val: string): void {
    this.term.setValue(val);
  }

  public getFormControl(): FormControl {
    return this.term;
  }

  get placeHolder(): string {
    if (this.translateService) {
      return this.translateService.get(this.placeholder);
    }
    return this.placeholder;
  }

  set placeHolder(value: string) {
    window.setTimeout(() => this.placeholder = value, 0);
  }

  get hasCustomWidth(): boolean {
    return this.width !== undefined;
  }


  get floatLabel(): FloatLabelType {
    return this._floatLabel;
  }

  set floatLabel(value: FloatLabelType) {
    const values = ['always', 'never', 'auto'];
    if (values.indexOf(value) === -1) {
      value = 'auto';
    }
    this._floatLabel = value;
  }
}

@NgModule({
  declarations: [OSearchInputComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OSearchInputComponent]
})
export class OSearchInputModule { }
