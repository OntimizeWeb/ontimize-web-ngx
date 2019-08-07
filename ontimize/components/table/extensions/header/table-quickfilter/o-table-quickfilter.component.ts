import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, Injector, OnDestroy, OnInit, ViewChild, ViewEncapsulation, forwardRef } from '@angular/core';
import { FilterExpressionUtils, IExpression } from '../../../../filter-expression.utils';
import { MatCheckboxChange, MatMenu } from '@angular/material';
import { OColumn, OTableComponent, OTableOptions } from '../../../o-table.component';
import { OInputsOptions, O_INPUTS_OPTIONS } from '../../../../../config/app-config';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { FormControl } from '@angular/forms';
import { OTableCellRendererServiceComponent } from '../../../column/cell-renderer/cell-renderer';
import { SQLTypes } from '../../../../../util/sqltypes';
import { Util } from '../../../../../utils';

export const DEFAULT_INPUTS_O_TABLE_QUICKFILTER = [];

export const DEFAULT_OUTPUTS_O_TABLE_QUICKFILTER = [
  'onChange'
];

@Component({
  moduleId: module.id,
  selector: 'o-table-quickfilter',
  templateUrl: './o-table-quickfilter.component.html',
  styleUrls: ['./o-table-quickfilter.component.scss'],
  inputs: DEFAULT_INPUTS_O_TABLE_QUICKFILTER,
  outputs: DEFAULT_OUTPUTS_O_TABLE_QUICKFILTER,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.o-table-quickfilter]': 'true',
  }
})
export class OTableQuickfilterComponent implements OnInit, AfterViewInit, OnDestroy {

  public static DEFAULT_INPUTS_O_TABLE_QUICKFILTER = DEFAULT_INPUTS_O_TABLE_QUICKFILTER;
  public static DEFAULT_OUTPUTS_O_TABLE_QUICKFILTER = DEFAULT_OUTPUTS_O_TABLE_QUICKFILTER;

  @ViewChild('filter')
  public filter: ElementRef;

  @ViewChild('menu')
  public matMenu: MatMenu;

  public value: string;
  public onChange: EventEmitter<Object> = new EventEmitter<Object>();

  public formControl;

  protected oInputsOptions: OInputsOptions;
  protected quickFilterObservable: Subscription;

  constructor(
    protected injector: Injector,
    protected elRef: ElementRef,
    @Inject(forwardRef(() => OTableComponent)) protected table: OTableComponent
  ) {
    this.formControl = new FormControl();
  }

  public ngOnInit(): void {
    this.table.registerQuickFilter(this);
    // workaround because 'x-position="before"' was not working in the template
    this.matMenu.xPosition = 'before';
  }

  public ngAfterViewInit(): void {
    this.initializeEventFilter();

    try {
      this.oInputsOptions = this.injector.get(O_INPUTS_OPTIONS);
    } catch (e) {
      this.oInputsOptions = {};
    }
    Util.parseOInputsOptions(this.elRef, this.oInputsOptions);
  }

  public ngOnDestroy(): void {
    if (this.quickFilterObservable) {
      this.quickFilterObservable.unsubscribe();
    }
  }

  get oTableOptions(): OTableOptions {
    return this.table.oTableOptions;
  }

  get quickFilterColumns(): OColumn[] {
    return this.table.oTableOptions.columns.filter(oCol => {
      // CHECK: Why columns with renderers are not filtered?
      // return oCol.searchable && oCol.visible && !Util.isDefined(oCol.renderer);
      return oCol.searchable && oCol.visible;
    });
  }

  get filterExpression(): IExpression {
    let result: IExpression = this.getUserFilter();
    if (!Util.isDefined(result) && Util.isDefined(this.value) && this.value.length > 0) {
      const expressions: IExpression[] = [];
      // const queryCols: string[] = [];
      this.oTableOptions.columns.forEach((oCol: OColumn) => {
        // CHECK: Why columns with renderers are not filtered?
        // if (oCol.searching && oCol.visible && !oCol.renderer) {
        if (oCol.searching && oCol.visible && this.isFilterableColumn(oCol)) {
          if (oCol.renderer instanceof OTableCellRendererServiceComponent) { // Filter column with service renderer
            // Look for the value in the renderer cache
            const cacheValue = Object.keys(oCol.renderer.responseMap).find(key => Util.normalizeString(oCol.renderer['responseMap'][key]).indexOf(Util.normalizeString(this.value)) !== -1);
            if (cacheValue) {
              expressions.push(FilterExpressionUtils.buildExpressionEquals(oCol.attr, SQLTypes.parseUsingSQLType(cacheValue, SQLTypes.getSQLTypeKey(oCol.sqlType))));
            }
          } else if (SQLTypes.isNumericSQLType(oCol.sqlType)) { // Filter numeric column
            const numValue: any = SQLTypes.parseUsingSQLType(this.value, SQLTypes.getSQLTypeKey(oCol.sqlType));
            if (numValue) {
              expressions.push(FilterExpressionUtils.buildExpressionEquals(oCol.attr, numValue));
            }
          } else { // Default
            expressions.push(FilterExpressionUtils.buildExpressionLike(oCol.attr, this.value));
          }
          // queryCols.push(oCol.attr);
        }
      });
      if (expressions.length > 0) {
        result = expressions.reduce((a, b) => FilterExpressionUtils.buildComplexExpression(a, b, FilterExpressionUtils.OP_OR));
      }
      // result = FilterExpressionUtils.buildArrayExpressionLike(queryCols, this.value);
    }
    return result;
  }

  public getUserFilter(): IExpression {
    let result: IExpression;
    if (this.table.quickFilterCallback instanceof Function) {
      const userFilter = this.table.quickFilterCallback(this.value);
      if (Util.isDefined(userFilter) && FilterExpressionUtils.instanceofExpression(userFilter)) {
        result = (userFilter as IExpression);
      } else if (Util.isDefined(userFilter)) {
        result = FilterExpressionUtils.buildExpressionFromObject(userFilter);
      }
    }
    return result;
  }

  public initializeEventFilter(): void {
    if (this.filter && !this.quickFilterObservable) {
      this.quickFilterObservable = fromEvent(this.filter.nativeElement, 'keyup')
        .pipe(debounceTime(150))
        .pipe(distinctUntilChanged())
        .subscribe(() => {
          const filterVal = this.filter.nativeElement.value;
          if (!this.table.dataSource || this.value === filterVal) {
            return;
          }
          this.setValue(filterVal);
          this.onChange.emit(this.value);
        });

      // if exists filter value in storage then filter result table
      const filterValue = this.value || this.filter.nativeElement.value;
      //this.filter.nativeElement.value = filterValue;
      this.formControl.setValue(filterValue);
      if (this.table.dataSource && filterValue && filterValue.length) {
        this.table.dataSource.quickFilter = filterValue;
      }
    }
  }

  public setValue(value: any, trigger: boolean = true): void {
    this.value = value;
    if (trigger && this.table && this.table.dataSource) {
      this.table.dataSource.quickFilter = this.value;
    }
  }

  public onMenuClosed(): void {
    this.setValue(this.value);
    this.onChange.emit(this.value);
  }

  public isChecked(column: OColumn): boolean {
    return column.searching;
  }

  public onCheckboxChange(column: OColumn, event: MatCheckboxChange): void {
    column.searching = event.checked;
  }

  public showCaseSensitiveCheckbox(): boolean {
    return this.table.showCaseSensitiveCheckbox();
  }

  public areAllColumnsChecked(): boolean {
    let result: boolean = true;
    this.quickFilterColumns.forEach((col: OColumn) => {
      result = result && col.searching;
    });
    return result;
  }

  public onSelectAllChange(event: MatCheckboxChange): void {
    this.quickFilterColumns.forEach((col: OColumn) => {
      col.searching = event.checked;
    });
  }

  protected isFilterableColumn(column: OColumn): boolean {
    return !column.renderer || (
      column.type === 'string' ||
      column.type === 'translate' ||
      column.type === 'integer' ||
      column.type === 'real' ||
      column.type === 'percentage' ||
      column.type === 'currency' ||
      column.type === 'service'
    );
  }

}
