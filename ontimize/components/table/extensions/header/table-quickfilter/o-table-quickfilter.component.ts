import { Component, OnInit, Inject, forwardRef, EventEmitter, Injector, ViewEncapsulation, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { OTableComponent } from '../../../o-table.component';
import { IFilterExpression, FilterExpressionUtils } from '../../../../filter-expression.utils';

export const DEFAULT_INPUTS_O_TABLE_QUICKFILTER = [
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
  host: {
    '[class.o-table-quickfilter]': 'true',
  }
})

export class OTableQuickfilterComponent implements OnInit, AfterViewInit, OnDestroy {
  public static DEFAULT_INPUTS_O_TABLE_QUICKFILTER = DEFAULT_INPUTS_O_TABLE_QUICKFILTER;
  public static DEFAULT_OUTPUTS_O_TABLE_QUICKFILTER = DEFAULT_OUTPUTS_O_TABLE_QUICKFILTER;

  @ViewChild('filter') filter: ElementRef;
  protected quickFilterObservable: Subscription;

  public value: string;
  public onChange: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(
    protected injector: Injector,
    @Inject(forwardRef(() => OTableComponent)) protected table: OTableComponent
  ) {
  }

  public ngOnInit() {
    this.table.registerQuickFilter(this);
  }

  ngAfterViewInit() {
    this.initializeEventFilter();
  }

  get filterExpression(): IFilterExpression {
    let result: IFilterExpression = undefined;
    if (this.value && this.value.length > 0) {
      const self = this;
      let queryCols = [];
      this.table.oTableOptions.visibleColumns.forEach(col => {
        const oCol = self.table.getOColumn(col);
        if (oCol && !oCol.renderer) {
          queryCols.push(col);
        }
      });
      result = FilterExpressionUtils.buildArrayExpressionLike(queryCols, this.value);
    }
    return result;
  }

  initializeEventFilter() {
    setTimeout(() => {
      if (this.filter && !this.quickFilterObservable) {
        this.quickFilterObservable = Observable.fromEvent(this.filter.nativeElement, 'keyup')
          .debounceTime(150).distinctUntilChanged().subscribe(() => {
            const filterValue = this.filter.nativeElement.value;
            if (!this.table.dataSource || this.value === filterValue) {
              return;
            }
            this.value = filterValue;
            this.table.dataSource.quickFilter = this.value;
            this.onChange.emit(this.value);
          });

        // if exists filter value in storage then filter result table
        let filterValue = this.value || this.filter.nativeElement.value;
        this.filter.nativeElement.value = filterValue;
        if (this.table.dataSource && filterValue && filterValue.length) {
          this.table.dataSource.quickFilter = filterValue;
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.quickFilterObservable) {
      this.quickFilterObservable.unsubscribe();
    }
  }
}
