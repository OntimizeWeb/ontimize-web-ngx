import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Injector, OnDestroy, OnInit, TemplateRef, Type, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { BooleanInputConverter } from '../../../../../decorators/input-converter';
import { ServiceResponse } from '../../../../../interfaces/service-response.interface';
import { ITranslatePipeArgument, OTranslatePipe } from '../../../../../pipes/o-translate.pipe';
import { DialogService } from '../../../../../services/dialog.service';
import { OntimizeServiceProvider } from '../../../../../services/factories';
import { OntimizeService } from '../../../../../services/ontimize/ontimize.service';
import { OConfigureServiceArgs } from '../../../../../types/configure-service-args.type';
import { Expression } from '../../../../../types/expression.type';
import { Codes } from '../../../../../util/codes';
import { FilterExpressionUtils } from '../../../../../util/filter-expression.utils';
import { ServiceUtils } from '../../../../../util/service.utils';
import { SQLTypes } from '../../../../../util/sqltypes';
import { Util } from '../../../../../util/util';
import type { OColumn } from '../../o-column.class';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';

export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_SERVICE = [
  'entity',
  'service',
  'columns',
  'translate',
  'valueColumn: value-column',
  'valueColumnType: value-column-type',
  'parentKeys: parent-keys',
  'queryMethod: query-method',
  'serviceType : service-type',
  'translateArgsFn: translate-params'
];

export const DEFAULT_OUTPUTS_O_TABLE_CELL_RENDERER_SERVICE = [
  'onDataLoaded'
];

@Component({
  selector: 'o-table-cell-renderer-service',
  templateUrl: './o-table-cell-renderer-service.component.html',
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_SERVICE,
  outputs: DEFAULT_OUTPUTS_O_TABLE_CELL_RENDERER_SERVICE,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    // Service renderer must have its own service instance in order to avoid overriding table service configuration
    OntimizeServiceProvider
  ]
})
export class OTableCellRendererServiceComponent extends OBaseTableCellRenderer implements OnInit, AfterViewInit, OnDestroy {

  public static DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_SERVICE = DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_SERVICE;

  @ViewChild('templateref', { read: TemplateRef, static: true }) public templateref: TemplateRef<any>;

  public rowData: any;
  public cellValues = [];
  public renderValue: any;
  public responseMap = {};

  /* Inputs */
  protected entity: string;
  protected service: string;
  protected columns: string;
  @BooleanInputConverter()
  protected translate: boolean = false;
  protected valueColumn: string;
  public valueColumnType: string = Codes.TYPE_INT;
  protected parentKeys: string;
  protected queryMethod: string = Codes.QUERY_METHOD;
  protected serviceType: string;

  /* Outputs */
  public onDataLoaded: EventEmitter<any> = new EventEmitter();
  /* Internal variables */
  protected colArray: string[] = [];
  protected dataService: any;
  protected _pKeysEquiv = {};
  protected dialogService: DialogService;

  public translateArgsFn: (rowData: any) => any[];
  protected componentPipe: OTranslatePipe;
  protected pipeArguments: ITranslatePipeArgument = {};

  protected subscritpions: Subscription = new Subscription();

  constructor(protected injector: Injector) {
    super(injector);
    this.tableColumn.type = 'service';
    this.dialogService = injector.get<DialogService>(DialogService as Type<DialogService>);
    this.setComponentPipe();
  }

  public initialize(): void {
    super.initialize();
    if (this.table) {
      const oCol: OColumn = this.table.getOColumn(this.column);
      oCol.definition.contentAlign = oCol.definition.contentAlign ? oCol.definition.contentAlign : 'start';
    }

    this.colArray = Util.parseArray(this.columns, true);
    const pkArray = Util.parseArray(this.parentKeys);
    this._pKeysEquiv = Util.parseParentKeysEquivalences(pkArray);
    this.configureService();
  }

  public ngAfterViewInit(): void {
    const oCol: OColumn = this.table.getOColumn(this.column);
    if (Util.isDefined(oCol.editor)) {
      this.subscritpions.add(oCol.editor.onPostUpdateRecord.subscribe((data: any) => {
        this.queryData(data[this.tableColumn.attr], data);
      }));
    }
  }

  public ngOnDestroy(): void {
    if (this.subscritpions) {
      this.subscritpions.unsubscribe();
    }
  }

  public getDescriptionValue(cellvalue: any, rowValue: any): string {
    if (Util.isDefined(cellvalue) && this.cellValues.indexOf(cellvalue) === -1) {
      this.queryData(cellvalue, rowValue);
      this.cellValues.push(cellvalue);
    }
    return '';
  }

  public queryData(cellvalue, parentItem?: any): void {
    if (!this.dataService || !(this.queryMethod in this.dataService) || !this.entity) {
      console.warn('Service not properly configured! aborting query');
      return;
    }
    const filter = ServiceUtils.getFilterUsingParentKeys(parentItem, this._pKeysEquiv);
    const tableColAlias = Object.keys(this._pKeysEquiv).find(key => this._pKeysEquiv[key] === this.column);
    if (Util.isDefined(tableColAlias)) {
      if (!filter[tableColAlias]) {
        filter[tableColAlias] = cellvalue;
      }
    } else {
      filter[this.column] = cellvalue;
    }
    const sqlTypes = this.getSqlTypesForFilter(filter);
    this.dataService[this.queryMethod](filter, this.colArray, this.entity, sqlTypes)
      .subscribe((resp: ServiceResponse) => {
        if (resp.isSuccessful()) {
          this.responseMap[cellvalue] = resp.data[0][this.valueColumn];
          this.onDataLoaded.emit(this.responseMap[cellvalue]);
        }
      }, err => {
        console.error(err);
        if (err && typeof err !== 'object') {
          this.dialogService.alert('ERROR', err);
        } else {
          this.dialogService.alert('ERROR', 'MESSAGES.ERROR_QUERY');
        }
      });
  }

  getSqlTypesForFilter(filter: Object) {
    const sqlType = {};
    const tableSqlTypes = this.table.getSqlTypes();

    Object.keys(filter).forEach(filterKey => {
      const pKeyEquiv = Object.keys(this._pKeysEquiv).find(keyEquiv => keyEquiv === filterKey);
      const keyEquiv = Util.isDefined(pKeyEquiv) ? this._pKeysEquiv[pKeyEquiv] : filterKey;
      sqlType[filterKey] = tableSqlTypes[keyEquiv]
    });

    return sqlType;
  }
  public configureService(): void {
    const configureServiceArgs: OConfigureServiceArgs = { injector: this.injector, baseService: OntimizeService, entity: this.entity, service: this.service, serviceType: this.serviceType }
    this.dataService = Util.configureService(configureServiceArgs);
  }

  public getCellData(cellvalue: any, rowvalue?: any): string {
    return this.responseMap[cellvalue];
  }

  public getFilterExpression(quickFilter: string): Expression {
    const oCol: OColumn = this.table.getOColumn(this.column);
    let result: Expression;
    let cacheValue = Object.keys(this.responseMap).find(key => Util.normalizeString(this.responseMap[key]).indexOf(Util.normalizeString(quickFilter)) !== -1);
    if (cacheValue) {
      cacheValue = this.parseByValueColumnType(cacheValue);
      result = FilterExpressionUtils.buildExpressionEquals(this.column, SQLTypes.parseUsingSQLType(cacheValue, SQLTypes.getSQLTypeKey(oCol.sqlType)));
    }
    return result;
  }

  public setComponentPipe(): void {
    this.componentPipe = new OTranslatePipe(this.injector);
  }

  public responseValue(cellvalue: any, rowvalue?: any): string {
    if (this.translate) {
      this.pipeArguments = this.translateArgsFn ? { values: this.translateArgsFn(rowvalue) } : {};
      return super.getCellData(cellvalue, rowvalue);
    } else {
      return cellvalue;
    }
  }

  protected parseByValueColumnType(val: any) {
    let value = val;

    if (this.valueColumnType === Codes.TYPE_INT) {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed)) {
        value = parsed;
      }
    }
    return value;
  }

  /** Querying all entity records to have the responseMap fully filled */
  queryAllData(): Observable<any> {
    return new Observable(observer => {
      if (!this.dataService || !(this.queryMethod in this.dataService) || !this.entity) {
        console.warn('Service not properly configured! aborting query');
        observer.next();
      }
      this.dataService[this.queryMethod]({}, this.colArray, this.entity)
        .subscribe((resp: ServiceResponse) => {
          if (resp.isSuccessful()) {
            (resp.data || []).forEach(item => {
              if (Util.isDefined(item[this.column])) {
                this.cellValues.push(item[this.column]);
                this.responseMap[item[this.column]] = item[this.valueColumn];
              }
            });
            this.onDataLoaded.emit(this.responseMap);
          }
          observer.next();
        }, err => {
          console.error(err);
          observer.next();
        });
    });
  }
}
