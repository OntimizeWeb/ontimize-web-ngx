import {EventEmitter} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {FormControl} from '@angular/forms';


export interface SessionInfo {
  id:number;
  user:string;
}

export interface IDataService {
  getDefaultServiceConfiguration(serviceName?: string): Object;
  configureService(config: any): void;
  query(kv?: Object, av?: Array<string>, entity?: string, sqltypes?: Object): Observable<any>;
  advancedQuery(kv?: Object, av?: Array<string>, entity?: string, sqltypes?: Object,
    offset?: number, pagesize?: number, orderby?: Array<Object>): Observable<any>;
  insert(av: Object, entity?: string, sqltypes?: Object): Observable<any>;
  update(kv: Object, av: Object, entity?: string, sqltypes?: Object): Observable<any>;
  'delete'(kv: Object, entity?: string, sqltypes?: Object): Observable<any>;
}

export interface IAuthService {
  startsession(user: string, password: string): Observable<any>;
  endsession(user: string, sessionId: number): Observable<any>;
}

export interface IOntimizeServiceConf {
  urlBase?: string;
  session: SessionInfo;
  entity?: string;
  kv?: Object;
  av?: Array<string>;
  sqltypes?: Object;
  pagesize?: number;
  offset?: number;
  orderby?: Array<Object>;
  totalsize?: number;
}

export interface IComponent {
  getAttribute(): string;
}

export interface IFormDataTypeComponent extends IComponent {
  getSQLType(): number;
}

export interface IFormControlComponent extends IComponent {
  getControl(): FormControl;
}

export interface IFormDataComponent {
  data(value: any);
  isAutomaticBinding(): Boolean;
}

export interface IProfileService {
  isRestricted(route: string): Promise<boolean>;
  getPermissions(route: string, attr: string): Promise<any>;
}

export interface ITableCellRenderer {
  init(parameters: any);
  render(cellData: any, rowData: any): string;
  handleCreatedCell(cellElement: any, rowData: any);
}

export interface ITableCellEditor {
  onFocus: EventEmitter<any>;
  onBlur: EventEmitter<any>;
  onSubmit: EventEmitter<any>;
  init(parameters: any);
  getHtml(data: any): string;
  handleCellFocus(cellElement: any, data: any);
  handleCellBlur(cellElement: any);
  create(cellElement: any, data: any);
  destroy(cellElement: any);
  performInsertion(cellElement: any);
  createEditorForInsertTable(cellElement: any, data: any);
  getInsertTableValue(): any;
}
