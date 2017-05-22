import {
  Component, OnInit, Inject, Injector, Optional, NgZone, ElementRef, forwardRef,
  NgModule,
  ViewEncapsulation
} from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeAll';

import { MdCheckboxModule, MdListModule, MdToolbarModule } from '@angular/material';

import { OLightTableButtonPanelModule } from './o-light-table-button-panel.component';
import { OLightTableColumnModule, OLightTableColumnComponent } from './o-light-table-column.component';
import { OntimizeService, DialogService } from '../../services';
import { OFormComponent } from '../form/o-form.component';
import { InputConverter } from '../../decorators';
import { Util } from '../../util/util';

import { ObservableWrapper } from '../../util/async';
import { OSharedModule } from '../../shared';

export const DEFAULT_INPUTS_O_LIGHT_TABLE = [
  'refreshButton: refresh-button',
  'queryOnInit: query-on-init',
  'columns',
  'parentKeys: parent-keys',
  'entity',
  'service',
  'key',
  'route',
  //static-data [Array<any>] : way to populate with static data. Default: no value.
  'staticData: static-data'
];

export const DEFAULT_OUTPUTS_O_LIGHT_TABLE = [
  'onRowClick'
];

@Component({
  selector: 'o-light-table',
  template: require('./o-light-table.component.html'),
  styles: [require('./o-light-table.component.scss')],
  providers: [OntimizeService],
  inputs: [
    ...DEFAULT_INPUTS_O_LIGHT_TABLE
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_LIGHT_TABLE
  ],
  encapsulation: ViewEncapsulation.None
})
export class OLightTableComponent implements OnInit {

  public static DEFAULT_INPUTS_O_LIGHT_TABLE = DEFAULT_INPUTS_O_LIGHT_TABLE;
  public static DEFAULT_OUTPUTS_O_LIGHT_TABLE = DEFAULT_OUTPUTS_O_LIGHT_TABLE;

  /* Inputs */
  columns: string;
  parentKeys: string;
  entity: string;
  service: string;
  key: string;
  route: string;
  @InputConverter()
  queryOnInit: boolean = true;
  @InputConverter()
  refreshButton: boolean = true;
  @InputConverter()
  showControls: boolean = true;

  staticData: Array<any>;

  /*End inputs */

  markAll: boolean = false;
  selected: any[] = [];
  deleting: boolean = false;
  dataArray: any[] = [];
  serviceData: any[] = [];
  colArray: string[] = [];
  oColumns: Object = {};

  public onRowClick: EventEmitter<any> = new EventEmitter();

  protected dataService: any;

  private _injector;
  private _dialogService: DialogService;
  private _router: Router;
  private _actRoute: ActivatedRoute;
  private elRef: ElementRef;

  private _pKeysEquiv = {};

  constructor(
    router: Router,
    actRoute: ActivatedRoute,
    el: ElementRef,
    zone: NgZone,
    injector: Injector,
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent) {
    this._router = router;
    this._actRoute = actRoute;
    this.elRef = el;
    this._injector = injector;

    this._dialogService = injector.get(DialogService);
  }

  registerColumn(col: OLightTableColumnComponent) {
    if (col) {
      this.oColumns[col.id] = col;
      this.colArray.push(col.id);
    }
  }

  ngOnInit(): any {
    this.colArray = Util.parseArray(this.columns);

    //TODO Move to ParseUtils to be used on table, combo, etc....
    let pkArray = Util.parseArray(this.parentKeys);
    if (pkArray && pkArray.length > 0) {
      pkArray.forEach(item => {
        let aux = item.split(':');
        if (aux && aux.length === 2) {
          this._pKeysEquiv[aux[0]] = aux[1];
        } else if (aux && aux.length === 1) {
          this._pKeysEquiv[item] = item;
        }
      });
    }

    if (this.staticData) {
      this.dataArray = this.staticData;
    } else {
      this.configureService();
    }

  }

  configureService() {
    this.dataService = this._injector.get(OntimizeService);

    if (Util.isDataService(this.dataService)) {
      let serviceCfg = this.dataService.getDefaultServiceConfiguration(this.service);
      if (this.entity) {
        serviceCfg['entity'] = this.entity;
      }
      this.dataService.configureService(serviceCfg);
    }

  }

  ngAfterViewInit() {
    if (this.queryOnInit) {
      this.queryData();
    }
  }

  setData(data: any) {
    this.dataArray = data;
  }

  renderColumn(rowIdx: number, colIdx: number, col: string, value: any, wrapperEL: any) {
    let oColumn = this.oColumns[col];
    if (oColumn) {
      return oColumn.getRenderedValue(value);
    }
    return value;
  }

  getPipe(col: string) {
    let oColum = this.oColumns[col];
    return oColum.pipe ? oColum.pipe : '';
  }

  getFlex(col: string) {
    let oColum = this.oColumns[col];
    return oColum.flex ? oColum.flex : 'auto';
  }

  queryData(filter: Object = {}) {
    var self = this;
    this.dataService.query(filter, [], this.entity)//this.colArray
      .subscribe(resp => {
        if (resp.code === 0) {
          self.setData(resp.data);
          self.serviceData = resp.data;
        } else {
          console.log('error');
        }
      }, err => {
        console.log(err);
      });
  }

  handleMarkAll(event, selected) {
    if (this.dataArray && this.dataArray.length > 0) {
      for (let i = 0; i < this.dataArray.length; ++i) {
        let idx = this.selected.indexOf(this.dataArray[i]);
        if (!selected && idx < 0) {
          this.selected.push(this.dataArray[i]);
        } else if (selected && idx > -1) {
          this.selected.splice(idx, 1);
        }
      }
    }
  }

  syncSelected(item) {
    let idx = this.selected.indexOf(item);
    if (idx > -1) {
      this.selected.splice(idx, 1);
    } else {
      this.selected.push(item);
    }
  }

  isItemSelected(item) {
    return this.selected.indexOf(item) > -1;
  }

  onListItemClick(item, event) {

    if (!this.deleting) {
      if (this.route && this.route.length > 0) {
        let params = {};
        params[this.key] = item[this.key];
        params['isdetail'] = true;
        this._router.navigate(['/' + this.route, params]);
      }
    } else {
      this.syncSelected(item);
      if (this.markAll) {
        this.markAll = false;
      }
    }

    ObservableWrapper.callEmit(this.onRowClick, item);
  }

  public onRowClicked(onNext: (item: any) => void): Object {
    return ObservableWrapper.subscribe(this.onRowClick, onNext);
  }

  cancelRemove(event) {
    this.selected = [];
    this.markAll = false;
    this.deleting = false;
  }

  filter(event) {
    //TODO Abrir dialogo flotante para filtrar
    //-> construir formulario dinamico a partir de las columns?????
  }

  remove(event) {
    if (this.deleting) {
      this.showConfirmDelete(event);
    } else {
      this.deleting = true;
    }
  }

  add(event) {
    let params = {};
    this._router.navigate(['/New' + this.route, params]);
  }

  showConfirmDelete(evt) {
    this._dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DELETE')
      .then(
      res => {
        if (res === true) {
          this.executeMassiveRemove();
        }
      }
      );
  }

  executeMassiveRemove() {
    if (this.selected && this.selected.length > 0) {
      let massiveFilters = [];
      this.selected.map(item => {
        let filter = {};
        filter[this.key] = item[this.key];
        massiveFilters.push(filter);
      });
      this.removeRegister(massiveFilters);
    }
  }

  removeRegister(filter): void {

    let obs = (Observable as any).fromArray(filter)
      .map(item => this.dataService.delete(item, this.entity)).mergeAll();

    obs.subscribe(resp => {
      console.log();
    }, error => {
      this._dialogService.alert('ERROR', 'MESSAGES.ERROR_DELETE');
    }, () => {
      this._dialogService.alert('INFO', 'MESSAGES.SUCCESS_DELETE')
        .then(
        res => {
          this.deleting = false;
          this.queryData();
        }
        );
    });


  }


}

@NgModule({
  declarations: [OLightTableComponent],
  imports: [OSharedModule, MdCheckboxModule, MdListModule, MdToolbarModule, OLightTableColumnModule, OLightTableButtonPanelModule],
  exports: [OLightTableComponent],
})
export class OLightTableModule {
}
