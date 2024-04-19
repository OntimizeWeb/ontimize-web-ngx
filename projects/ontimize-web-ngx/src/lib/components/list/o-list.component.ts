import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Injector,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  QueryList,
  SimpleChange,
  ViewEncapsulation
} from '@angular/core';
import { MatFormFieldAppearance } from '@angular/material';
import { merge, Subscription } from 'rxjs';

import { InputConverter } from '../../decorators/input-converter';
import { IListItem } from '../../interfaces/o-list-item.interface';
import { IList } from '../../interfaces/o-list.interface';
import { ComponentStateServiceProvider, O_COMPONENT_STATE_SERVICE, OntimizeServiceProvider } from '../../services/factories';
import { OListComponentStateClass } from '../../services/state/o-list-component-state.class';
import { OListComponentStateService } from '../../services/state/o-list-component-state.service';
import { OListInitializationOptions } from '../../types/o-list-initialization-options.type';
import { OQueryDataArgs } from '../../types/query-data-args.type';
import { SQLOrder } from '../../types/sql-order.type';
import { ObservableWrapper } from '../../util/async';
import { ServiceUtils } from '../../util/service.utils';
import { Util } from '../../util/util';
import { OFormComponent } from '../form/o-form.component';
import {
  AbstractOServiceComponent,
  DEFAULT_INPUTS_O_SERVICE_COMPONENT,
  DEFAULT_OUTPUTS_O_SERVICE_COMPONENT
} from '../o-service-component.class';
import { OMatSort } from '../table/extensions/sort/o-mat-sort';
import { OListItemDirective } from './list-item/o-list-item.directive';
import { SQLTypes } from '../../util/sqltypes';

export const DEFAULT_INPUTS_O_LIST = [
  ...DEFAULT_INPUTS_O_SERVICE_COMPONENT,

  // quick-filter-columns [string]: columns of the filter, separated by ';'. Default: no value.
  'quickFilterColumns: quick-filter-columns',

  // refresh-button [no|yes]: show refresh button. Default: yes.
  'refreshButton: refresh-button',

  'route',

  'selectable',

  'odense : dense',

  // delete-button [no|yes]: show delete button when user select items. Default: yes.
  'deleteButton: delete-button',

  // sort-columns [string]: initial sorting, with the format column:[ASC|DESC], separated by ';'. Default: no value.
  'sortColumns: sort-columns',

  // insert-button-position [ top | bottom ]: position of the insert button. Default: 'bottom'
  'insertButtonPosition:insert-button-position',

  // insert-button-floatable [no|yes]: Indicates whether or not to position of the insert button is floating . Default: 'yes'
  'insertButtonFloatable:insert-button-floatable',

  // show-buttons-text [yes|no|true|false]: show text of buttons. Default: no.
  'showButtonsText: show-buttons-text',
  // keys-sql-types [string]: entity keys types, separated by ';'. Default: no value.
  'keysSqlTypes: keys-sql-types',
];

export const DEFAULT_OUTPUTS_O_LIST = [
  ...DEFAULT_OUTPUTS_O_SERVICE_COMPONENT,
  'onInsertButtonClick',
  'onItemDeleted'
];
@Component({
  selector: 'o-list',
  providers: [
    OntimizeServiceProvider,
    ComponentStateServiceProvider,
    { provide: O_COMPONENT_STATE_SERVICE, useClass: OListComponentStateService },
  ],
  inputs: DEFAULT_INPUTS_O_LIST,
  outputs: DEFAULT_OUTPUTS_O_LIST,
  templateUrl: './o-list.component.html',
  styleUrls: ['./o-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-list]': 'true'
  }
})
export class OListComponent extends AbstractOServiceComponent<OListComponentStateService> implements IList, AfterContentInit, AfterViewInit, OnDestroy, OnInit, OnChanges {

  @ContentChildren(OListItemDirective)
  public listItemDirectives: QueryList<OListItemDirective>;

  /* Inputs */
  @InputConverter()
  public refreshButton: boolean = true;
  @InputConverter()
  public selectable: boolean = false;
  @InputConverter()
  public odense: boolean = false;
  @InputConverter()
  public deleteButton: boolean = true;
  @InputConverter()
  public insertButtonFloatable: boolean = true;
  @InputConverter()
  showButtonsText: boolean = false;

  paginationControls: boolean = false;

  public quickFilterColumns: string;
  public route: string;
  public sortColumns: string;
  /* End Inputs */

  public sortColArray: SQLOrder[] = [];

  public onInsertButtonClick: EventEmitter<any> = new EventEmitter();
  public onItemDeleted: EventEmitter<any> = new EventEmitter();

  public selection = new SelectionModel<Element>(true, []);
  public enabledDeleteButton: boolean = false;
  public insertButtonPosition: 'top' | 'bottom' = 'bottom';
  public storePaginationState: boolean = false;
  protected subscription: Subscription = new Subscription();
  protected _quickFilterAppearance: MatFormFieldAppearance = 'outline';
  protected keysSqlTypes: string;
  keysSqlTypesArray: Array<string> = [];

  protected oMatSort: OMatSort;

  constructor(
    injector: Injector,
    elRef: ElementRef,
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent
  ) {
    super(injector, elRef, form);
    this.oMatSort = new OMatSort();
  }

  get state(): OListComponentStateClass {
    return this.componentStateService.state;
  }

  public ngOnInit(): void {
    this.initialize();
    this.subscription.add(this.selection.changed.subscribe(() => this.enabledDeleteButton = !this.selection.isEmpty()));
  }

  public ngAfterViewInit(): void {
    super.afterViewInit();
    this.filterCaseSensitive = Util.isDefined(this.state.filterCaseSensitive) ?
      this.state.filterCaseSensitive :
      this.filterCaseSensitive;
    this.parseSortColumns();
    this.registerQuickFilter(this.searchInputComponent);
    if (this.queryOnInit) {
      this.queryData();
    }
  }

  public ngAfterContentInit(): void {
    this.setListItemDirectivesData();
    this.subscription.add(this.listItemDirectives.changes.subscribe(() => this.setListItemDirectivesData()));
  }

  public ngOnDestroy(): void {
    this.destroy();
    this.subscription.unsubscribe();
  }


  public getComponentKey(): string {
    return 'OListComponent_' + this.oattr;
  }

  public initialize(): void {
    super.initialize();
    this.keysSqlTypesArray = Util.parseArray(this.keysSqlTypes);
    if (!Util.isDefined(this.quickFilterColumns)) {
      this.quickFilterColumns = this.columns;
    }
    this.quickFilterColArray = Util.parseArray(this.quickFilterColumns, true);
    this.state.queryRecordOffset = 0;
    if (!Util.isDefined(this.state.totalQueryRecordsNumber)) {
      this.state.totalQueryRecordsNumber = 0;
    }
  }

  public reinitialize(options: OListInitializationOptions): void {
    super.reinitialize(options);
  }

  public getDense(): boolean {
    return this.odense;
  }

  public onListItemClicked(onNext: (item: OListItemDirective) => void): object {
    return ObservableWrapper.subscribe(this.onClick, onNext);
  }

  public onItemDetailClick(item: OListItemDirective | IListItem): void {
    this.handleItemClick(item);
  }

  public onItemDetailDoubleClick(item: OListItemDirective | IListItem): void {
    this.handleItemDblClick(item);
  }

  getDataToStore() {
    return this.componentStateService.getDataToStore();
  }

  public reloadData(clearSelectedItems: boolean = true): void {
    this.componentStateService.refreshSelection();
    if (clearSelectedItems && this.selectable) {
      this.clearSelection();
    }
    let queryArgs: OQueryDataArgs = {};
    if (this.pageable) {
      this.state.queryRecordOffset = 0;
      queryArgs = {
        length: Math.max(this.queryRows, this.dataResponseArray.length),
        replace: true
      };
    }

    this.queryData(void 0, queryArgs);
  }

  public reloadPaginatedDataFromStart(clearSelectedItems: boolean = true): void {
    if (this.pageable) {
      this.dataResponseArray = [];
      this.reloadData(clearSelectedItems);
    }
  }

  protected getSortedDataFromArray(dataArray: any[]): any[] {
    return this.oMatSort.getSortedDataBySQLOrder(dataArray, this.sortColArray);
  }

  public isItemSelected(item: any): boolean {
    return this.selectable && this.selection.isSelected(item);
  }

  public onScroll(e: Event): void {
    if (this.matpaginator) return;
    if (this.pageable) {
      const pendingRegistries = this.dataResponseArray.length < this.state.totalQueryRecordsNumber;
      if (!this.loadingSubject.value && pendingRegistries) {
        const element = e.target as any;
        if (element.offsetHeight + element.scrollTop + 5 >= element.scrollHeight) {
          const queryArgs: OQueryDataArgs = {
            offset: this.state.queryRecordOffset,
            length: this.queryRows
          };
          this.queryData(void 0, queryArgs);
        }
      }
    }
  }

  public remove(clearSelectedItems: boolean = false): void {
    const selectedItems = this.getSelectedItems();
    if (selectedItems.length === 0) {
      return;
    }
    this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DELETE').then(res => {
      if (res === true) {
        if (this.dataService && (this.deleteMethod in this.dataService) && this.entity && (this.keysArray.length > 0)) {
          const filters = ServiceUtils.getArrayProperties(selectedItems, this.keysArray);
          const sqlTypesArg = this.getSqlTypesOfKeys();
          merge(filters.map((kv => this.dataService[this.deleteMethod](kv, this.entity, sqlTypesArg)))).subscribe(obs => obs.subscribe(() => {
            ObservableWrapper.callEmit(this.onItemDeleted, selectedItems);
          }, error => {
            this.dialogService.alert('ERROR', 'MESSAGES.ERROR_DELETE');
          }, () => {
            // Ensuring that the deleted items will not longer be part of the selectionModel
            this.clearSelection();
            this.reloadData();
          }));
        } else {
          this.deleteLocalItems();
        }
      } else if (clearSelectedItems) {
        this.clearSelection();
      }
    });
  }

  public add(e?: Event): void {
    this.onInsertButtonClick.emit(e);
    super.insertDetail();
  }

  public parseSortColumns(): void {
    const sortColumnsParam = this.state.sortColumns || this.sortColumns;
    this.sortColArray = ServiceUtils.parseSortColumns(sortColumnsParam);
  }

  public getQueryArguments(filter: object, ovrrArgs?: OQueryDataArgs): any[] {
    const queryArguments = super.getQueryArguments(filter, ovrrArgs);
    if (this.pageable) {
      queryArguments[6] = this.sortColArray;
    }
    return queryArguments;
  }

  protected setListItemDirectivesData(): void {
    this.listItemDirectives.forEach((element: OListItemDirective, index) => {
      element.setItemData(this.dataArray[index]);
      element.setListComponent(this);
    });
  }

  protected saveDataNavigationInLocalStorage(): void {
    super.saveDataNavigationInLocalStorage();
    this.storePaginationState = true;
  }

  protected parseResponseArray(data: any[], replace?: boolean) {
    let result = data;
    if (this.pageable && !replace) {
      result = (this.dataResponseArray || []).concat(data);
    }
    return result;
  }

  public registerQuickFilter(arg: any): void {
    super.registerQuickFilter(arg);
    if (Util.isDefined(this.quickFilterComponent) && Util.isDefined(this.state.quickFilterActiveColumns)) {
      const parsedArr = Util.parseArray(this.state.quickFilterActiveColumns, true);
      this.quickFilterComponent.setActiveColumns(parsedArr);
    }
  }

  setDataArray(data: any): void {
    super.setDataArray(data);
    this.updateSelectedItems();
    this.cd.detectChanges();
  }

  public setSelected(item: any): void {
    super.setSelected(item);
    this.componentStateService.refreshSelection();
  }

  public updateSelectedItems() {
    if (!this.selectable || !Util.isDefined(this.state.selection) || this.getSelectedItems().length > 0) {
      return;
    }
    this.state.selection.forEach(selectedItem => {
      const itemKeys = Object.keys(selectedItem);
      const foundItem = this.dataArray.find(data => itemKeys.every(key => data[key] === selectedItem[key]));
      if (Util.isDefined(foundItem)) {
        this.selection.select(foundItem);
      }
    });
  }

  public getSqlTypes() {
    const sqlTypes = this.sqlTypes;
    this.keysSqlTypesArray.forEach((kst, i) => sqlTypes[this.keysArray[i]] = SQLTypes.getSQLTypeValue(kst));
    return sqlTypes;
  }
}
