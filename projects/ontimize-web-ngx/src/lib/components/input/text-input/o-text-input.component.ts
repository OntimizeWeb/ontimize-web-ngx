import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  forwardRef,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  Optional,
  QueryList,
  ViewEncapsulation
} from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { NumberConverter } from '../../../decorators/input-converter';
import { OMatPrefix } from '../../../directives/o-mat-prefix.directive';
import { OMatSuffix } from '../../../directives/o-mat-suffix.directive';
import { Util } from '../../../util/util';
import { OFormComponent } from '../../form/o-form.component';
import { OFormDataComponent } from '../../o-form-data-component.class';

export const DEFAULT_INPUTS_O_TEXT_INPUT = [
  'minLength: min-length',
  'maxLength: max-length',
  //uppercase | lowercase | default
  'stringCase: string-case'
];


@Component({
  selector: 'o-text-input',
  templateUrl: './o-text-input.component.html',
  styleUrls: ['./o-text-input.component.scss'],
  inputs: DEFAULT_INPUTS_O_TEXT_INPUT,
  encapsulation: ViewEncapsulation.None
})

export class OTextInputComponent extends OFormDataComponent implements OnInit, OnDestroy, AfterViewInit {

  @ContentChildren(OMatPrefix) _prefixChildren: QueryList<OMatPrefix>;
  @ContentChildren(OMatSuffix) _suffixChildren: QueryList<OMatSuffix>;

  public stringCase: string;

  protected _minLength: number = -1;
  protected _maxLength: number = -1;
  protected upperSubscription: Subscription;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.initializeStringCase();
  }

  protected initializeStringCase() {
    const stringCaseVariant = this.stringCase || this.oInputsOptions?.stringCase;
    if (Util.isDefined(stringCaseVariant) && stringCaseVariant !== 'default') {
      this.upperSubscription = this.getFormControl().valueChanges.subscribe((x: string) => {
        if (Util.isDefined(x)) {
          const value = stringCaseVariant === 'lowercase' ? x.toLowerCase() : x.toUpperCase();
          this.setFormValue(value, { emitEvent: false })
        }
      })
    }
  }


  resolveValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = super.resolveValidators();

    if (this.minLength >= 0) {
      validators.push(Validators.minLength(this.minLength));
    }
    if (this.maxLength >= 0) {
      validators.push(Validators.maxLength(this.maxLength));
    }

    return validators;
  }

  set minLength(val: number) {
    const old = this._minLength;
    this._minLength = NumberConverter(val);
    if (val !== old) {
      this.updateValidators();
    }
  }

  get minLength(): number {
    return this._minLength;
  }

  set maxLength(val: number) {
    const old = this._maxLength;
    this._maxLength = NumberConverter(val);
    if (val !== old) {
      this.updateValidators();
    }
  }

  get maxLength(): number {
    return this._maxLength;
  }

  public ngOnDestroy(): void {
    if (this.upperSubscription) {
      this.upperSubscription.unsubscribe();
    }
  }


}
