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
import { FormControl } from '@angular/forms';
import { MatCheckboxChange, MatMenu } from '@angular/material';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { O_INPUTS_OPTIONS } from '../../../../../config/app-config';
import { OTableOptions } from '../../../../../interfaces/o-table-options.interface';
import { OTableQuickfilter } from '../../../../../interfaces/o-table-quickfilter.interface';
import { Expression } from '../../../../../types/expression.type';
import { OInputsOptions } from '../../../../../types/o-inputs-options.type';
import { FilterExpressionUtils } from '../../../../../util/filter-expression.utils';
import { Util } from '../../../../../util/util';
import {
  OTableCellRendererServiceComponent
} from '../../../column/cell-renderer/service/o-table-cell-renderer-service.component';
import { OColumn } from '../../../column/o-column.class';
import { OTableComponent } from '../../../o-table.component';

export const DEFAULT_INPUTS_O_TABLE_QUICKFILTER = [];

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

  @ViewChild('filter', { static: true })
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

  get filterExpression(): Expression {
    let result: Expression = this.getUserFilter();
    if (!Util.isDefined(result) && Util.isDefined(this.value) && this.value.length > 0) {
      const expressions: Expression[] = [];
      this.oTableOptions.columns
        .filter((oCol: OColumn) => oCol.searching && oCol.visible && this.isFilterableColumn(oCol))
        .forEach((oCol: OColumn) => {
          // CHECK: Why columns with renderers are not filtered?
          // if (!oCol.renderer) {
          if (oCol.filterExpressionFunction) {
            expressions.push(oCol.filterExpressionFunction(oCol.attr, this.value));
          } else if (oCol.renderer instanceof OTableCellRendererServiceComponent) {
            // Filter column with service renderer. Look for the value in the renderer cache
            const expr = oCol.renderer.getFilterExpression(this.value);
            if (expr) {
              expressions.push(expr);
            }
            // }
            //  else if (SQLTypes.isNumericSQLType(oCol.sqlType)) {
            //   // Filter numeric column
            //   const numValue: any = SQLTypes.parseUsingSQLType(this.value, SQLTypes.getSQLTypeKey(oCol.sqlType));
            //   if (numValue) {
            //     expressions.push(FilterExpressionUtils.buildExpressionEquals(oCol.attr, numValue));
            //   }
          } else {
            // Default
            expressions.push(FilterExpressionUtils.buildExpressionLike(oCol.attr, this.value));
          }
        });
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
      // this.filter.nativeElement.value = filterValue;
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
