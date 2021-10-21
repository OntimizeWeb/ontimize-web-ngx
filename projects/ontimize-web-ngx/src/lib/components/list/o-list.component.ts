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
import { merge, Subscription } from 'rxjs';

import { InputConverter } from '../../decorators/input-converter';
import { IListItem } from '../../interfaces/o-list-item.interface';
import { IList } from '../../interfaces/o-list.interface';
import { OntimizeServiceProvider } from '../../services/factories';
import { AbstractComponentStateService } from '../../services/state/o-component-state.service';
import { OListComponentStateClass } from '../../services/state/o-list-component-state.class';
import { OListComponentStateService } from '../../services/state/o-list-component-state.service';
import { OListInitializationOptions } from '../../types/o-list-initialization-options.type';
import { OQueryDataArgs } from '../../types/query-data-args.type';
import { SQLOrder } from '../../types/sql-order.type';
import { ObservableWrapper } from '../../util/async';
import { Codes } from '../../util/codes';
import { ServiceUtils } from '../../util/service.utils';
import { Util } from '../../util/util';
import { OFormComponent } from '../form/o-form.component';
import { AbstractOServiceComponent, DEFAULT_INPUTS_O_SERVICE_COMPONENT } from '../o-service-component.class';
import { OMatSort } from '../table/extensions/sort/o-mat-sort';
import { OListItemDirective } from './list-item/o-list-item.directive';

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
  'insertButtonFloatable:insert-button-floatable'
];

export const DEFAULT_OUTPUTS_O_LIST = [
  'onClick',
  'onDoubleClick',
  'onInsertButtonClick',
  'onItemDeleted',
  'onDataLoaded',
  'onPaginatedDataLoaded'
];

@Component({
  selector: 'o-list',
  providers: [
    OntimizeServiceProvider,
    { provide: AbstractComponentStateService, useClass: OListComponentStateService, deps: [Injector] }
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

  public listItemComponents: IListItem[] = [];

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
  public quickFilterColumns: string;
  public route: string;
  public sortColumns: string;
  /* End Inputs */

  public sortColArray: SQLOrder[] = [];

  public onClick: EventEmitter<any> = new EventEmitter();
  public onDoubleClick: EventEmitter<any> = new EventEmitter();
  public onInsertButtonClick: EventEmitter<any> = new EventEmitter();
  public onItemDeleted: EventEmitter<any> = new EventEmitter();

  public selection = new SelectionModel<Element>(true, []);
  public enabledDeleteButton: boolean = false;
  public insertButtonPosition: 'top' | 'bottom' = 'bottom';
  public storePaginationState: boolean = false;
  protected subscription: Subscription = new Subscription();

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
    this.listItemDirectives.changes.subscribe(() => this.setListItemDirectivesData());
  }

  public ngOnDestroy(): void {
    this.destroy();
    this.subscription.unsubscribe();
  }

  public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    if (changes.staticData !== undefined) {
      this.dataResponseArray = changes.staticData.currentValue;
      this.onDataLoaded.emit(this.dataResponseArray);
      /* if the static data changes after registering the quick filter,
      the filterData method is called else when registering the quickfilter
      or when a change occurs */
      if (this.quickFilterComponent) {
        this.filterData();
      }
    }
  }

  public getComponentKey(): string {
    return 'OListComponent_' + this.oattr;
  }

  public initialize(): void {
    super.initialize();
    if (!Util.isDefined(this.quickFilterColumns)) {
      this.quickFilterColumns = this.columns;
    }
    this.quickFilterColArray = Util.parseArray(this.quickFilterColumns, true);
    this.state.queryRecordOffset = 0;
    if (!Util.isDefined(this.state.totalQueryRecordsNumber)) {
      this.state.totalQueryRecordsNumber = 0;
    }
    if (Util.isDefined(this.state.queryRows)) {
      this.queryRows = this.state.queryRows;
    }
  }

  public reinitialize(options: OListInitializationOptions): void {
    super.reinitialize(options);
  }

  public registerListItemDirective(item: OListItemDirective): void {
    if (item) {
      item.onClick(directiveItem => this.onItemDetailClick(directiveItem));
      item.onDoubleClick(directiveItem => this.onItemDetailDoubleClick(directiveItem));
    }
  }

  public getDense(): boolean {
    return this.odense;
  }

  public onListItemClicked(onNext: (item: OListItemDirective) => void): object {
    return ObservableWrapper.subscribe(this.onClick, onNext);
  }

  public onItemDetailClick(item: OListItemDirective | IListItem): void {
    const data = item.getItemData();
    if (this.oenabled && this.detailMode === Codes.DETAIL_MODE_CLICK) {
      this.saveDataNavigationInLocalStorage();
      this.viewDetail(data);
    }
    ObservableWrapper.callEmit(this.onClick, data);
  }

  public onItemDetailDoubleClick(item: OListItemDirective | IListItem): void {
    const data = item.getItemData();
    if (this.oenabled && Codes.isDoubleClickMode(this.detailMode)) {
      this.saveDataNavigationInLocalStorage();
      this.viewDetail(data);
    }
    ObservableWrapper.callEmit(this.onDoubleClick, data);
  }

  getDataToStore() {
    return this.componentStateService.getDataToStore();
  }

  public reloadData(): void {
    let queryArgs: OQueryDataArgs = {};
    if (this.pageable) {
      this.state.queryRecordOffset = 0;
      queryArgs = {
        length: Math.max(this.queryRows, this.dataResponseArray.length),
        replace: true
      };
    }
    if (this.selectable) {
      // this.selectedItems = [];
      this.clearSelection();
      this.state.selectedIndexes = [];
    }
    this.queryData(void 0, queryArgs);
  }

  public reloadPaginatedDataFromStart(): void {
    this.dataResponseArray = [];
    this.reloadData();
  }

  protected getSortedDataFromArray(dataArray: any[]): any[] {
    return this.oMatSort.getSortedDataBySQLOrder(dataArray, this.sortColArray);
  }

  public isItemSelected(item: any): boolean {
    return this.selection.isSelected(item);
  }

  public updateSelectedState(item: object, isSelected: boolean): void {
    const selectedIndexes = this.state.selectedIndexes || [];
    const itemIndex = this.dataResponseArray.indexOf(item);
    if (isSelected && selectedIndexes.indexOf(itemIndex) === -1) {
      selectedIndexes.push(itemIndex);
    } else if (!isSelected) {
      selectedIndexes.splice(selectedIndexes.indexOf(itemIndex), 1);
    }
    this.state.selectedIndexes = selectedIndexes;
  }

  public onScroll(e: Event): void {
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
    if (selectedItems.length > 0) {
      this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DELETE').then(res => {
        if (res === true) {
          if (this.dataService && (this.deleteMethod in this.dataService) && this.entity && (this.keysArray.length > 0)) {
            const filters = ServiceUtils.getArrayProperties(selectedItems, this.keysArray);
            merge(filters.map((kv => this.dataService[this.deleteMethod](kv, this.entity)))).subscribe(obs => obs.subscribe(() => {
              ObservableWrapper.callEmit(this.onItemDeleted, selectedItems);
            }, error => {
              this.dialogService.alert('ERROR', 'MESSAGES.ERROR_DELETE');
            }, () => {
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

  registerItem(item: IListItem): void {
    this.listItemComponents.push(item);
    if (this.dataResponseArray.length > 0) {
      item.setItemData(this.dataResponseArray[this.listItemComponents.length - 1]);
    }
  }

  protected setListItemDirectivesData(): void {
    this.listItemDirectives.forEach((element: OListItemDirective, index) => {
      element.setItemData(this.dataResponseArray[index]);
      element.setListComponent(this);
      this.registerListItemDirective(element);
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
    const selectedIndexes = this.state.selectedIndexes || [];
    for (const selIndex of selectedIndexes) {
      if (selIndex < this.dataResponseArray.length) {
        this.selection.select(this.dataResponseArray[selIndex]);
      }
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
}
