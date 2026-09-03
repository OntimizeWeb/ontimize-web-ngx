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
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { AsyncPipe, NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';

import { OTranslatePipe } from '../../pipes/o-translate.pipe';
import { ODataToolbarComponent } from '../o-data-toolbar/o-data-toolbar.component';
import { OSearchInputComponent } from '../input/search-input/o-search-input.component';
import { OListSkeletonComponent } from './skeleton/o-list-skeleton.component';
import { merge, Subscription } from 'rxjs';

import { BooleanInputConverter } from '../../decorators/input-converter';
import { IList } from '../../interfaces/o-list.interface';
import { ComponentStateServiceProvider, OntimizeServiceProvider } from '../../services/factories';
import { OListComponentStateClass } from '../../services/state/o-list-component-state.class';
import { OListComponentStateService } from '../../services/state/o-list-component-state.service';
import { OActionStyleProvider } from '../../types/o-action-style.type';
import { OListInitializationOptions } from '../../types/o-list-initialization-options.type';
import { OListPermissions } from '../../types/o-list-permissions.type';
import { OPermissions } from '../../types/o-permissions.type';
import { OQueryDataArgs } from '../../types/query-data-args.type';
import { SQLOrder } from '../../types/sql-order.type';
import { ObservableWrapper } from '../../util/async';
import { ServiceUtils } from '../../util/service.utils';
import { SQLTypes } from '../../util/sqltypes';
import { Util } from '../../util/util';
import { OFormComponent } from '../form/o-form.component';
import { AbstractOServiceComponent } from '../o-service-component.class';
import { OActionStyle } from '../../types';
import { OMatSort } from '../table/extensions/sort/o-mat-sort';
import { ListItem } from './list-item/o-list-item';
import { OListItemDirective } from './list-item/o-list-item.directive';
import { OQueryParams } from '../../types/query-params.type';
import { SelectionChange } from '@angular/cdk/collections';
import { O_COMPONENT_STATE_SERVICE } from '../../injection-tokens';
import { Observable } from 'rxjs';
import { OListLoadingService } from './o-list-loading.service';

export const DEFAULT_INPUTS_O_LIST = [
  // quick-filter-columns [string]: columns of the filter, separated by ';'. Default: no value.
  'quickFilterColumns: quick-filter-columns',

  // refresh-button [no|yes]: show refresh button. Default: yes.
  'refreshButton: refresh-button',

  'route',

  'selectable',

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
  // scroll-to-top-button [no|yes]: show a floating button to scroll back to the top of the list
  // once scrolled past a threshold. Only applies to the scrollable list itself (never window/body),
  // and has no effect when `mat-paginator` is active (pagination-controls=yes takes priority; the
  // list is not scrollable in that mode). Default: no.
  'scrollToTopButton: scroll-to-top-button',
];

export const DEFAULT_OUTPUTS_O_LIST = [
  'onInsertButtonClick',
  'onItemDeleted',
  'onItemSelected',
  'onItemDeselected'
];

@Component({
  standalone: true,
  imports: [AsyncPipe, NgClass, NgStyle, NgTemplateOutlet, MatButtonModule, MatIconModule, MatListModule, MatPaginatorModule, OTranslatePipe, ODataToolbarComponent, OSearchInputComponent, OListSkeletonComponent],
  selector: 'o-list',
  providers: [
    OntimizeServiceProvider,
    ComponentStateServiceProvider,
    { provide: O_COMPONENT_STATE_SERVICE, useClass: OListComponentStateService },
    { provide: OActionStyleProvider, useExisting: forwardRef(() => OListComponent) },
    OListLoadingService
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

  /** Adds this list's historic default labels to the inherited importance auto-rules. */
  protected override getActionStyleAutoRules(): Record<string, OActionStyle> {
    return {
      ...super.getActionStyleAutoRules(),
      insert: { ...super.getActionStyleAutoRules().insert, label: 'ADD' },
      refresh: { label: 'REFRESH' },
      delete: { label: 'DELETE' }
    };
  }

  @ContentChildren(OListItemDirective)
  public listItemDirectives: QueryList<OListItemDirective>;
  @ViewChild('toolbar', { read: ElementRef })
  toolbarEl: ElementRef;
  /** The actual scroll container (mat-list has `overflow: auto`) — same element `onScroll` already receives via its event target. */
  @ViewChild('scrollContainer', { read: ElementRef })
  protected scrollContainerEl: ElementRef<HTMLElement>;

  /* Inputs */
  @BooleanInputConverter()
  public refreshButton: boolean = true;
  @BooleanInputConverter()
  public selectable: boolean = false;
  @BooleanInputConverter()
  public deleteButton: boolean = true;
  @BooleanInputConverter()
  public insertButtonFloatable: boolean = true;
  @BooleanInputConverter()
  showButtonsText: boolean = false;
  @BooleanInputConverter()
  public scrollToTopButton: boolean = false;

  paginationControls: boolean = false;

  public quickFilterColumns: string;
  public route: string;
  public sortColumns: string;
  protected permissions: OListPermissions;
  /* End Inputs */

  public sortColArray: SQLOrder[] = [];

  public onInsertButtonClick: EventEmitter<any> = new EventEmitter();
  public onItemDeleted: EventEmitter<any> = new EventEmitter();

  public enabledDeleteButton: boolean = false;
  /** Whether the scroll-to-top button is currently shown — driven purely by scroll position, never by viewport/breakpoint. */
  public showScrollToTopButton: boolean = false;
  /** Scroll distance (px) past which the scroll-to-top button appears. Not configurable — no equivalent existing convention to follow, and the request doesn't call for one. */
  protected static readonly SCROLL_TO_TOP_THRESHOLD = 200;
  public insertButtonPosition: 'top' | 'bottom' = 'bottom';
  public storePaginationState: boolean = false;
  protected subscription: Subscription = new Subscription();
  protected _quickFilterAppearance: MatFormFieldAppearance = 'outline';
  protected keysSqlTypes: string;
  keysSqlTypesArray: Array<string> = [];

  protected oMatSort: OMatSort;
  protected actionsPermissions: OPermissions[];

  public onItemSelected: EventEmitter<any[]> = new EventEmitter();
  public onItemDeselected: EventEmitter<any[]> = new EventEmitter();

  protected loadingService: OListLoadingService;
  /** Same threshold/minimum-visible delay as o-table's skeleton — avoids flicker on fast responses. */
  public showLoading: Observable<boolean>;

  constructor(
    injector: Injector,
    elRef: ElementRef,
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent
  ) {
    super(injector, elRef, form);
    this.oMatSort = new OMatSort();
    this.loadingService = this.injector.get(OListLoadingService);
    this.subscription.add(
      this.loadingSubject.subscribe((loading: boolean) => this.loadingService.setLoading(loading))
    );
    this.showLoading = this.loadingService.showLoading$;
  }

  get toolBarHeight() {
    let height = 0;

    if (this.toolbarEl?.nativeElement) {
      height += this.toolbarEl.nativeElement.offsetHeight;
    }
    return height;
  }

  get state(): OListComponentStateClass {
    return this.componentStateService.state;
  }

  public ngOnInit(): void {
    this.initialize();
    this.loadPermissions();
    this.setupDeleteButtonSubscription();
  }

  private loadPermissions(): void {
    this.permissions = this.permissionsService.getListPermissions(this.oattr, this.actRoute);
    this.actionsPermissions = this.getActionsPermissions(this.permissions);
    this.setButtonPermissions(this.actionsPermissions);
  }

  private setupDeleteButtonSubscription(): void {
    const deletePermission = this.getPermissionByAttr('delete', this.actionsPermissions);
    const shouldSubscribe =
      !Util.isDefined(deletePermission) || (deletePermission.visible && deletePermission.enabled);

    if (shouldSubscribe) {
      const subscription = this.selection.changed.subscribe(() => {
        this.enabledDeleteButton = !this.selection.isEmpty();
      });

      this.subscription.add(subscription);
    }

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
    this.manageCustomPermissions(this.actionsPermissions, '[o-list-toolbar]');
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
    this.permissions = this.permissionsService.getListPermissions(this.oattr, this.actRoute);

    const selectionSubscription = this.selection.changed.subscribe(({ added, removed }: SelectionChange<any>) => {
      if (added?.length) {
        ObservableWrapper.callEmit(this.onItemSelected, added);
      }
      if (removed?.length) {
        ObservableWrapper.callEmit(this.onItemDeselected, removed);
      }
    });
    this.subscription.add(selectionSubscription)
  }

  public reinitialize(options: OListInitializationOptions): void {
    super.reinitialize(options);
  }

  public onListItemClicked(onNext: (item: OListItemDirective) => void): object {
    return ObservableWrapper.subscribe(this.onClick, onNext);
  }

  public onItemDetailClick(item: OListItemDirective | ListItem): void {
    this.handleItemClick(item);
  }

  public onItemDetailDoubleClick(item: OListItemDirective | ListItem): void {
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
    this.updateScrollToTopVisibility(e.target as HTMLElement);
    if (this.matpaginator) return;
    if (this.pageable) {
      const pendingRegistries = this.dataResponseArray.length < this.state.totalQueryRecordsNumber;
      if (!this.loadingSubject.value && pendingRegistries) {
        const element = e.target as any;
        if (element.offsetHeight + element.scrollTop + 5 >= element.scrollHeight) {
          // Computed fresh from the already-loaded records, like o-table's onChangePage does with
          // currentPage * queryRows, rather than trusting state.queryRecordOffset directly — that
          // field is written by updatePaginationInfo() from the service response and can end up
          // NaN (e.g. a non-array response data), which this scroll handler would otherwise resend
          // as-is on every subsequent scroll.
          const queryArgs: OQueryDataArgs = {
            offset: this.dataResponseArray.length,
            length: this.queryRows
          };
          this.dataService?.setPaginationContext({ pageNumber: this.dataService?.getPaginationContext().pageNumber + 1 });
          this.queryData(void 0, queryArgs);
        }
      }
    }
  }

  /**
   * `mat-paginator` always takes priority: the list isn't scrolled in that mode (it's not
   * infinite-scroll), so the button is forced hidden whenever `this.matpaginator` is set —
   * regardless of `scroll-to-top-button`, and regardless of viewport/breakpoint.
   */
  protected updateScrollToTopVisibility(element: HTMLElement): void {
    if (!this.scrollToTopButton) {
      return;
    }
    const shouldShow = !this.matpaginator && element.scrollTop > OListComponent.SCROLL_TO_TOP_THRESHOLD;
    if (shouldShow !== this.showScrollToTopButton) {
      this.showScrollToTopButton = shouldShow;
    }
  }

  /** Only moves the scroll position of this list's own scroll container — never touches data, filters, pagination or loading state. */
  public scrollToTop(): void {
    this.scrollContainerEl?.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
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

  public getQueryArguments(filter: object, ovrrArgs?: OQueryDataArgs): OQueryParams {
    const queryArguments = super.getQueryArguments(filter, ovrrArgs);
    if (this.pageable) {
      queryArguments.sort = this.sortColArray;
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
