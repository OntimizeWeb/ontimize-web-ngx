import { AfterViewInit, Component, ElementRef, EventEmitter, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FloatLabelType, MatFormFieldAppearance } from '@angular/material/form-field';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { O_INPUTS_OPTIONS } from '../../../config/app-config';
import { InputConverter } from '../../../decorators/input-converter';
import { SnackBarService } from '../../../services/snackbar.service';
import { OTranslateService } from '../../../services/translate/o-translate.service';
import { Expression } from '../../../types/expression.type';
import { FormValueOptions } from '../../../types/form-value-options.type';
import { OInputsOptions } from '../../../types/o-inputs-options.type';
import { FilterExpressionUtils } from '../../../util/filter-expression.utils';
import { Util } from '../../../util/util';

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
export class OSearchInputComponent implements OnInit, AfterViewInit {

  public onSearch: EventEmitter<any> = new EventEmitter<any>();

  public colArray: ColumnObject[] = [];
  public _placeholder: string = 'SEARCH';

  get placeholder(): string {
    return this._placeholder;
  }

  set placeholder(value: string) {
    if (Util.isDefined(value)) {
      this._placeholder = value;
    }
  }

  public width: string;
  public columns: string;
  @InputConverter()
  public showCaseSensitiveCheckbox: boolean = false;
  @InputConverter()
  public showMenu: boolean = true;
  @InputConverter()
  protected _filterCaseSensitive: boolean = false;
  protected _floatLabel: FloatLabelType;
  protected _appearance: MatFormFieldAppearance;

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

  public getFormGroup(): FormGroup {
    return this.formGroup;
  }

  public getValue(): string {
    return this.term.value;
  }

  public setValue(val: string, options?: FormValueOptions): void {
    this.term.setValue(val, options);
  }

  public getFormControl(): FormControl {
    return this.term;
  }

  get hasCustomWidth(): boolean {
    return this.width !== undefined;
  }

  get showFilterMenu(): boolean {
    return this.showMenu && this.colArray.length > 0;
  }

  public isChecked(column: ColumnObject): boolean {
    return column.checked;
  }

  public onCheckboxChange(column: ColumnObject, event: MatCheckboxChange): void {
    column.checked = event.checked;
    // triggerOnSearch if we want to trigger search on each change
  }

  public onSelectAllChange(event: MatCheckboxChange): void {
    this.colArray.forEach((col: ColumnObject) => {
      col.checked = event.checked;
    });
    // triggerOnSearch if we want to trigger search on each change
  }

  public areAllColumnsChecked(): boolean {
    let result: boolean = true;
    this.colArray.forEach((col: ColumnObject) => {
      result = result && col.checked;
    });
    return result;
  }

  public getCountColumnsChecked(): number {
    let count = 0;
    this.colArray.forEach((col: ColumnObject) => {
      if (col.checked) {
        count++;
      }
    });
    return count;
  }
  public onFilterCaseSensitiveChange(event: MatCheckboxChange): void {
    this.filterCaseSensitive = event.checked;
    // triggerOnSearch if we want to trigger search on each change
  }

  public getActiveColumns(): string[] {
    return this.colArray.filter(col => col.checked).map(col => col.column);
  }

  public setActiveColumns(arg: string[]): void {
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

  protected triggerOnSearch(): void {
    const term = this.term.value;
    if (this.checkActiveColumns() && Util.isDefined(term) && term.length > 0) {
      this.onSearch.emit(term);
    }
  }

  public onMenuClosed(): void {
    this.triggerOnSearch();
  }

  get filterExpression(): Expression {
    const termValue = this.getValue();
    if (Util.isDefined(termValue) && termValue.length > 0) {
      const filterCols = this.getActiveColumns();
      if (filterCols.length > 0) {
        return FilterExpressionUtils.buildArrayExpressionLike(filterCols, termValue);
      }
    }
    return undefined;
  }
}
