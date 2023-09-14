import { AfterViewInit, Component, EventEmitter, forwardRef, Inject, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { OFormComponent } from '../../components/form/o-form.component';
import { BooleanInputConverter, NumberInputConverter } from '../../decorators/input-converter';
import { IFilterBuilderCmpTarget } from '../../interfaces/filter-builder-component-target.interface';
import { IFormDataComponent } from '../../interfaces/form-data-component.interface';
import { IServiceDataComponent } from '../../interfaces/service-data-component.interface';
import { LocalStorageService } from '../../services/local-storage.service';
import { OFilterBuilderComponentStateClass } from '../../services/state/o-filter-builder-component-state.class';
import { OFilterBuilderComponentStateService } from '../../services/state/o-filter-builder-component-state.service';
import { OFilterDefinition } from '../../types';
import { BasicExpression } from '../../types/basic-expression.type';
import { Expression } from '../../types/expression.type';
import { OFilterBuilderValues } from '../../types/o-filter-builder-values.type';
import { CHANGE_EVENTS, Codes } from '../../util/codes';
import { FilterExpressionUtils } from '../../util/filter-expression.utils';
import { Util } from '../../util/util';

export const DEFAULT_INPUTS_O_FILTER_BUILDER = [
  // filters: [string] List of pairs of form component attributes and target component colums (targetColumn1:componentAttr1;targetColumn2:componentAttr2;...). Separated by ';'.
  'filters',

  // target [`OServiceComponent` instance]: Component whose data will be filtered.
  'targetCmp: target',

  // expression-builder [funtion]: Funtion called for creating the expression.
  'expressionBuilder: expression-builder',

  // query-on-change [yes|no|true|false]: Indicates whether or not to trigger the target component refresh when a filter component `onChange` event is fired. Default: no.
  'queryOnChange: query-on-change',

  // query-on-change-delay [number]: Delay time in milliseconds `query-on-change` method is triggered. Default: 0.
  'queryOnChangeDelay: query-on-change-delay',

  //query-on-change-event: [change| onValueChange] Type of event that emit when query-on-change=`yes`
  'queryOnChangeEventType: query-on-change-event-type',

  // attr [string]: filter builder identifier. It is mandatory if data are provided through the data attribute. Default: target (if set).
  'oattr: attr',
]

export const DEFAULT_OUTPUTS_O_FILTER_BUILDER = [
  // Event triggered when the filter action is executed.
  'onFilter',

  // Event triggered when the clear action is excuted.
  'onClear'
];

@Component({
  selector: 'o-filter-builder',
  templateUrl: './o-filter-builder.component.html',
  inputs: DEFAULT_INPUTS_O_FILTER_BUILDER,
  outputs: DEFAULT_OUTPUTS_O_FILTER_BUILDER
})

/**
 * The OFilterBuilderComponent.
 */

export class OFilterBuilderComponent implements AfterViewInit, OnDestroy, OnInit {

  public onFilter: EventEmitter<any> = new EventEmitter<any>();
  public onClear: EventEmitter<any> = new EventEmitter<any>();

  public filters: string;
  public targetCmp: IServiceDataComponent;
  public expressionBuilder: (values: Array<{ attr, value }>) => Expression;
  @BooleanInputConverter()
  public queryOnChange: boolean = false;
  @NumberInputConverter()
  public queryOnChangeDelay: number = 0;
  @BooleanInputConverter()
  public queryOnChangeEventType: CHANGE_EVENTS = Codes.DEFAULT_CHANGE_EVENT;

  protected filterComponents: Array<IFilterBuilderCmpTarget> = [];

  protected subscriptions: Subscription = new Subscription();
  public oattr: string;
  protected componentStateService: OFilterBuilderComponentStateService;
  protected localStorageService: LocalStorageService;
  protected router: Router;
  protected actRoute: ActivatedRoute;
  constructor(
    protected injector: Injector,
    @Inject(forwardRef(() => OFormComponent)) public form: OFormComponent
  ) {
    this.localStorageService = this.injector.get(LocalStorageService);
    this.componentStateService = this.injector.get<OFilterBuilderComponentStateService>(OFilterBuilderComponentStateService);
    this.router = this.injector.get<Router>(Router);
    this.actRoute = this.injector.get<ActivatedRoute>(ActivatedRoute);
  }

  ngOnInit(): void {
    this.initialize();
  }

  ngAfterViewInit(): void {
    this.initializeListeners();
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  initialize(): void {
    this.componentStateService.initialize(this);
    // Parse filters
    if (this.filters) {
      const filterArray: Array<string> = Util.parseArray(this.filters);
      filterArray.forEach(filter => {
        const filterElms = filter.split(Codes.COLUMNS_ALIAS_SEPARATOR);
        this.filterComponents.push({
          targetAttr: filterElms[0],
          formComponentAttr: filterElms[1] ? filterElms[1] : filterElms[0]
        });
      });
    }

    if (Util.isDefined(this.targetCmp)) {
      this.targetCmp.setFilterBuilder(this);
    }
  }

  initializeListeners(): void {
    if (this.queryOnChange) {
      this.filterComponents.forEach((filterComponent: IFilterBuilderCmpTarget) => {
        const formComponent: IFormDataComponent = this.form.getComponents()[filterComponent.formComponentAttr];
        if (formComponent) {
          this.subscriptions.add(
            this.getEventFromFormComponent(formComponent)
              .pipe(debounceTime(this.queryOnChangeDelay))
              .subscribe(() => this.triggerReload()));
        }
      });
    }
  }

  private getEventFromFormComponent(formComponent: any): Observable<any> {
    return this.queryOnChangeEventType === Codes.DEFAULT_CHANGE_EVENT ?
      formComponent.onValueChange :
      formComponent.getFormControl().valueChanges;
  }

  /**
   * Returns an `Expression` object with the filter.
   * @returns the `Expression` object with the filter.
   */
  getExpression(): Expression {
    // Prepare form filter values [... { attr, value }]
    const formComponents = this.form.getComponents();
    const params: Array<{ attr, value }> = [];
    this.filterComponents.forEach((filterComponent: IFilterBuilderCmpTarget) => {
      const formComponent: IFormDataComponent = formComponents[filterComponent.formComponentAttr];
      if (formComponent) {
        const value = formComponent.getValue();
        params.push({
          attr: filterComponent.targetAttr,
          value: value
        });
      }
    });

    // Trigger the function provided by the user
    if (this.expressionBuilder) {
      return this.expressionBuilder(params);
    }

    // Generate desfault expression
    const expressions: Array<Expression> = [];
    params.forEach(elem => {
      if (Util.isDefined(elem.value)) {
        expressions.push(FilterExpressionUtils.buildExpressionEquals(elem.attr, elem.value));
      }
    });

    return expressions.length ? expressions.reduce((fe1, fe2) => FilterExpressionUtils.buildComplexExpression(fe1, fe2, FilterExpressionUtils.OP_OR)) : undefined;
  }

  /**
   * Returns an `BasicExpression` object with the filter.
   * @returns the `BasicExpression` object with the filter.
   */
  getBasicExpression(): BasicExpression {
    return FilterExpressionUtils.buildBasicExpression(this.getExpression());
  }

  /**
   * Returns the filter builder target component.
   * @returns the target component.
   */
  getTargetComponent(): IServiceDataComponent {
    return this.targetCmp;
  }

  /**
   * Trigger the `reloadData` method from the target component.
   */
  triggerReload(): void {
    if (!this.targetCmp) {
      return;
    }
    if (this.targetCmp.pageable) {
      this.targetCmp.reloadPaginatedDataFromStart();
    } else {
      this.targetCmp.reloadData();
    }
    this.onFilter.emit();
  }

  /**
   * Clear the form components used for the filter.
   */
  clearFilter(): void {
    const formComponents = this.form.getComponents();
    this.getFilterAttrs().forEach((attr: string) => {
      formComponents[attr].clearValue();
    });
    this.onClear.emit();
  }

  /**
   * Gets filter values
   * @returns filter values
   */
  getFilterValues(): OFilterBuilderValues[] {
    const result: OFilterBuilderValues[] = [];

    this.filterComponents.
      forEach((filterComponent: IFilterBuilderCmpTarget) => {
        if (Util.isDefined(this.form.getComponents()[filterComponent.formComponentAttr])) {
          result.push({ attr: filterComponent.formComponentAttr, value: this.form.getComponents()[filterComponent.formComponentAttr].getValue() });
        }
      });
    return result;

  }

  /**
   * Sets filter values
   * @param filterBuilderValues
   */
  setFilterValues(filterBuilderValues: OFilterBuilderValues[]) {
    filterBuilderValues.forEach((filterBuilderValue: OFilterBuilderValues) => {
      if (this.form.getComponents()[filterBuilderValue.attr]) {
        this.form.getComponents()[filterBuilderValue.attr].setValue(filterBuilderValue.value)
      } else {
        console.warn('The filter with attr ' + filterBuilderValue.attr + ' cannot be set ' + filterBuilderValue.value + ' because it does not exist .');
      }
    })
  }

  /**
   * Returns an array with the attributes of the filterable components
   */
  protected getFilterAttrs(): Array<string> {
    return this.filterComponents.map((elem: IFilterBuilderCmpTarget) => elem.formComponentAttr);
  }
  /**
   * Gets state
   */
  get state(): OFilterBuilderComponentStateClass {
    return this.componentStateService.state;
  }


  getDataToStore() {
    return this.componentStateService.state;
  }

  getComponentKey(): string {
    if (!Util.isDefined(this.oattr)) {
      console.error('Your o-filter-builder component must have an \'attr\'. Otherwise, your filter builder state will not set in localstorage.');
      return 'OFilterBuilderComponent_';
    }

    return 'OFilterBuilderComponent_' + this.oattr;
  }

  /**
   * Stores filter in state
   * @param arg
   */
  storeFilterInState(arg: OFilterDefinition) {
    this.componentStateService.storeFilter(arg);
    this.updateStateStorage();
  }
  /**
   * Method update store localstorage, call of the ILocalStorage
   */
  protected updateStateStorage(): void {
    if (this.localStorageService) {
      this.localStorageService.updateComponentStorage(this, this.getRouteKey());
    }
  }

  public getRouteKey(): string {
    let route = this.router.url;
    this.actRoute.params.subscribe(params => {
      Object.keys(params).forEach(key => {
        route = route.replace(params[key], key);
      });
    });
    return route;
  }
}
