import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Injector, NgModule, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FloatLabelType, MatCheckboxChange, MatFormFieldAppearance } from '@angular/material';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { O_INPUTS_OPTIONS, OInputsOptions } from '../../../config/app-config';
import { OTranslateService, SnackBarService } from '../../../services';
import { OSharedModule } from '../../../shared';
import { Util } from '../../../utils';
import { InputConverter } from '../../../decorators/input-converter';

export const DEFAULT_INPUTS_O_SEARCH_INPUT = [
  'placeholder',
  'width',
  'floatLabel: float-label',
  'appearance',
  'columns',
  'filterCaseSensitive: filter-case-sensitive',
  'showCaseSensitiveCheckbox: show-case-sensitive-checkbox',
  'showMenu: show-menu'
];

export const DEFAULT_OUTPUTS_O_SEARCH_INPUT = [
  'onSearch'
];

declare type ColumnObject = {
  column: string;
  checked: boolean;
};

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

  /* Inputs */
  public placeholder: string = 'SEARCH';
  public width: string;
  protected _floatLabel: FloatLabelType;
  protected _appearance: MatFormFieldAppearance;
  public columns: string;
  @InputConverter()
  protected _filterCaseSensitive: boolean = false;
  @InputConverter()
  public showCaseSensitiveCheckbox: boolean = false;
  @InputConverter()
  public showMenu: boolean = true;

  /* parsed inputs variables */
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

  protected colArray: Array<ColumnObject> = [];

  get appearance(): MatFormFieldAppearance {
    return this._appearance;
  }

  set appearance(value: MatFormFieldAppearance) {
    const values = ['legacy', 'standard', 'fill', 'outline'];
    if (values.indexOf(value) === -1) {
      value = undefined;
    }
    this._appearance = value;
  }

  get filterCaseSensitive(): boolean {
    return this._filterCaseSensitive;
  }

  set filterCaseSensitive(value: boolean) {
    this._filterCaseSensitive = value;
  }
  /* end of parsed inputs variables */

  public onSearch: EventEmitter<any> = new EventEmitter<any>();

  protected formGroup: FormGroup;
  protected term: FormControl;
  protected translateService: OTranslateService;
  protected oInputsOptions: OInputsOptions;
  protected snackBarService: SnackBarService;

  constructor(
    protected injector: Injector,
    protected elRef: ElementRef
  ) {
    this.translateService = this.injector.get(OTranslateService);
    this.snackBarService = this.injector.get(SnackBarService);
    this.formGroup = new FormGroup({});
  }

  public ngOnInit(): void {
    this.term = new FormControl();
    this.formGroup.addControl('term', this.term);

    this.term.valueChanges.pipe(debounceTime(400))
      .pipe(distinctUntilChanged()).subscribe(term => {
        if (this.checkActiveColumns()) {
          this.onSearch.emit(term);
        }
      });

    const colArray = Util.parseArray(this.columns, true);
    colArray.forEach((col: string) => {
      this.colArray.push({
        column: col,
        checked: true
      });
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

  get showFilterMenu(): boolean {
    return this.showMenu && this.colArray.length > 0;
  }

  isChecked(column: ColumnObject): boolean {
    return column.checked;
  }

  onCheckboxChange(column: ColumnObject, event: MatCheckboxChange) {
    column.checked = event.checked;
    this.triggerOnSearch();
  }

  onSelectAllChange(event: MatCheckboxChange) {
    this.colArray.forEach((col: ColumnObject) => {
      col.checked = event.checked;
    });
    this.triggerOnSearch();
  }

  areAllColumnsChecked(): boolean {
    let result: boolean = true;
    this.colArray.forEach((col: ColumnObject) => {
      result = result && col.checked;
    });
    return result;
  }

  onFilterCaseSensitiveChange(event: MatCheckboxChange) {
    this.filterCaseSensitive = event.checked;
    this.triggerOnSearch();
  }

  getActiveColumns(): string[] {
    let result = [];
    this.colArray.forEach((col: ColumnObject) => {
      if (col.checked) {
        result.push(col.column);
      }
    });
    return result;
  }

  setActiveColumns(arg: string[]) {
    this.colArray.forEach((c: ColumnObject) => {
      c.checked = arg.indexOf(c.column) !== -1;
    });
  }

  protected checkActiveColumns(): boolean {
    if (this.getActiveColumns().length === 0) {
      this.snackBarService.open('MESSAGES.AVOID_QUERY_WITHOUT_QUICKFILTER_COLUMNS');
      return false;
    }
    return true;
  }

  protected triggerOnSearch() {
    const term = this.term.value;
    if (this.checkActiveColumns() && Util.isDefined(term) && term.length > 0) {
      this.onSearch.emit(term);
    }
  }
}

@NgModule({
  declarations: [OSearchInputComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OSearchInputComponent]
})
export class OSearchInputModule { }
