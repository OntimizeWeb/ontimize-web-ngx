import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatMenu } from '@angular/material/menu';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { O_INPUTS_OPTIONS } from '../../../../../config/app-config';
import type { OTableOptions } from '../../../../../interfaces/o-table-options.interface';
import type { OTableQuickfilter } from '../../../../../interfaces/o-table-quickfilter.interface';
import type { Expression } from '../../../../../types/expression.type';
import type { OInputsOptions } from '../../../../../types/o-inputs-options.type';
import { FilterExpressionUtils } from '../../../../../util/filter-expression.utils';
import { Util } from '../../../../../util/util';
import type { OColumn } from '../../../column/o-column.class';
import { OTableBase } from '../../../o-table-base.class';

export const DEFAULT_INPUTS_O_TABLE_QUICKFILTER = [
  'placeholder'
];

export const DEFAULT_OUTPUTS_O_TABLE_QUICKFILTER = [
  'onChange'
];

@Component({
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
export class OTableQuickfilterComponent implements OTableQuickfilter, OnInit, AfterViewInit, OnDestroy {

  protected _placeholder: string = 'TABLE.FILTER';

  get placeholder(): string {
    return this._placeholder;
  }

  set placeholder(value: string) {
    if (Util.isDefined(value)) {
      this._placeholder = value;
    }
  }

  @ViewChild('filter')
  public filter: ElementRef;

  @ViewChild('menu', { static: true })
  public matMenu: MatMenu;

  public value: string;
  public onChange: EventEmitter<string> = new EventEmitter<string>();

  public formControl;

  protected oInputsOptions: OInputsOptions;
  protected quickFilterObservable: Subscription;
  constructor(
    protected injector: Injector,
    protected elRef: ElementRef,
    @Inject(forwardRef(() => OTableBase)) protected table: OTableBase
  ) {
    this.formControl = new UntypedFormControl();
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

  get filterExpression(): Expression {
    let result: Expression = this.getUserFilter();
    if (!Util.isDefined(result) && Util.isDefined(this.value) && this.value.length > 0) {
      const expressions: Expression[] = [];

      const searchingCols = this.oTableOptions.columns.filter(oCol => oCol.searching && oCol.visible && oCol.searchable && this.isFilterableColumn(oCol));
      expressions.push(...this.getColumnsWithoutRendererExpressions(searchingCols));

      const renderersExpr = this.getColumnsRendererExpressions(searchingCols);

      const notNullExpressions = renderersExpr.filter(expr => Util.isDefined(expr));
      if (expressions.length === 0 && notNullExpressions.length === 0) {
        // All filters in the renderer are empty and there are no other filters configured,
        // so we already know that the table should not have any information but
        // it would make a query with empty filters and retrieve information not consistent with the configured quickfilter value,
        // so we force to stop the query and set an empty array on the table
        this.table.abortQuery.next(true);
      }
      expressions.push(...notNullExpressions);

      if (expressions.length > 0) {
        result = expressions.reduce((a, b) => FilterExpressionUtils.buildComplexExpression(a, b, FilterExpressionUtils.OP_OR));
      }
    }
    return result;
  }

  public getUserFilter(): Expression {
    let result: Expression;
    if (this.table.quickFilterCallback instanceof Function) {
      const userFilter = this.table.quickFilterCallback(this.value);
      if (Util.isDefined(userFilter) && FilterExpressionUtils.instanceofExpression(userFilter)) {
        result = (userFilter as Expression);
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
      this.formControl.setValue(filterValue);
    }
  }

  public setValue(value: any, trigger: boolean = true): void {
    this.value = value;
    this.formControl.setValue(this.value);
    if (trigger && this.table && !this.table.pageable && this.table.dataSource) {
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
    return this.quickFilterColumns.every((col: OColumn) => col.searching);
  }

  public getCountColumnsChecked(): number {
    let count = 0;
    this.quickFilterColumns.forEach((col: OColumn) => {
      if (col.searching) {
        count++;
      }
    });
    return count;
  }

  public onSelectAllChange(event: MatCheckboxChange): void {
    this.quickFilterColumns.forEach((col: OColumn) => col.searching = event.checked);
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

  protected getColumnsWithoutRendererExpressions(columns: OColumn[]): Expression[] {
    return columns
      .filter(oCol => !Util.isDefined(oCol.renderer))
      .map(oCol => {
        if (Util.isDefined(oCol.filterExpressionFunction)) {
          return oCol.filterExpressionFunction(oCol.attr, this.value);
        } else {
          // Default behaviour
          return FilterExpressionUtils.buildExpressionLike(oCol.attr, this.value);
        }
      });
  }

  protected getColumnsRendererExpressions(columns: OColumn[]) {
    return columns
      .filter(oCol => Util.isDefined(oCol.renderer) && !Util.isDefined(oCol.filterExpressionFunction))
      .map(oCol => {
        if (Util.isDefined(oCol.renderer.getFilterExpression)) {
          return oCol.renderer.getFilterExpression(this.value);
        }
        // Default behaviour
        return FilterExpressionUtils.buildExpressionLike(oCol.attr, this.value);
      });
  }

}
