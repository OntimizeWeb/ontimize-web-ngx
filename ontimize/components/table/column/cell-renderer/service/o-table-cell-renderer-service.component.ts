import { Component, Injector, OnInit, TemplateRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';

import { DialogService, OntimizeService } from '../../../../../services';
import { dataServiceFactory } from '../../../../../services/data-service.provider';
import { Codes, Util } from '../../../../../utils';
import { ServiceUtils } from '../../../../service.utils';
import { OColumn } from '../../../o-table.component';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';

export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_SERVICE = [
  'entity',
  'service',
  'columns',
  'valueColumn: value-column',
  'parentKeys: parent-keys',
  'queryMethod: query-method',
  'serviceType : service-type'
];

@Component({
  moduleId: module.id,
  selector: 'o-table-cell-renderer-service',
  templateUrl: './o-table-cell-renderer-service.component.html',
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_SERVICE,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    // Service renderer must have its own service instance in order to avoid overriding table service configuration
    { provide: OntimizeService, useFactory: dataServiceFactory, deps: [Injector] }
  ]
})
export class OTableCellRendererServiceComponent extends OBaseTableCellRenderer implements OnInit {

  public static DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_SERVICE = DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_SERVICE;

  @ViewChild('templateref', { read: TemplateRef }) public templateref: TemplateRef<any>;

  /* Inputs */
  protected entity: string;
  protected service: string;
  protected columns: string;
  protected valueColumn: string;
  protected parentKeys: string;
  protected queryMethod: string = Codes.QUERY_METHOD;
  protected serviceType: string;

  /* Internal variables */
  protected colArray: string[] = [];
  protected dataService: any;
  protected _pKeysEquiv = {};
  protected querySubscription: Subscription;
  protected dialogService: DialogService;

  rowData: any;
  cellValues = [];
  renderValue: any;

  responseMap = {};

  constructor(protected injector: Injector) {
    super(injector);
    this.dialogService = injector.get(DialogService);
  }

  ngOnInit() {
    if (this.table) {
      const oCol: OColumn = this.table.getOColumn(this.tableColumn.attr);
      oCol.definition.contentAlign = oCol.definition.contentAlign ? oCol.definition.contentAlign : 'center';
    }

    this.colArray = Util.parseArray(this.columns, true);
    const pkArray = Util.parseArray(this.parentKeys);
    this._pKeysEquiv = Util.parseParentKeysEquivalences(pkArray);
    this.configureService();
  }

  getDescriptionValue(cellvalue: any, rowValue: any): String {
    // let keyValue = rowValue[this.column];
    if (cellvalue !== undefined && this.cellValues.indexOf(cellvalue) === -1) {
      this.queryData(cellvalue, rowValue);
      this.cellValues.push(cellvalue);
    }
    return '';
  }

  queryData(cellvalue, parentItem?: any) {
    const self = this;

    if (!this.dataService || !(this.queryMethod in this.dataService) || !this.entity) {
      console.warn('Service not properly configured! aborting query');
      return;
    }
    const filter = ServiceUtils.getFilterUsingParentKeys(parentItem, this._pKeysEquiv);
    const tableColAlias = Object.keys(this._pKeysEquiv).find(key => this._pKeysEquiv[key] === this.column);
    if (Util.isDefined(tableColAlias) && !filter[tableColAlias]) {
      filter[tableColAlias] = cellvalue;
    } else {
      filter[this.column] = cellvalue;
    }
    this.querySubscription = this.dataService[this.queryMethod](filter, this.colArray, this.entity).subscribe(resp => {
      if (resp.code === Codes.ONTIMIZE_SUCCESSFUL_CODE) {
        self.responseMap[cellvalue] = resp.data[0][self.valueColumn];
      } else {
        console.log('error');
      }
    }, err => {
      console.log(err);
      if (err && typeof err !== 'object') {
        this.dialogService.alert('ERROR', err);
      } else {
        this.dialogService.alert('ERROR', 'MESSAGES.ERROR_QUERY');
      }
    });
  }

  configureService() {
    let loadingService: any = OntimizeService;
    if (this.serviceType) {
      loadingService = this.serviceType;
    }
    try {
      this.dataService = this.injector.get(loadingService);
      if (Util.isDataService(this.dataService)) {
        const serviceCfg = this.dataService.getDefaultServiceConfiguration(this.service);
        if (this.entity) {
          serviceCfg['entity'] = this.entity;
        }
        this.dataService.configureService(serviceCfg);
      }
    } catch (e) {
      console.error(e);
    }
  }

}
