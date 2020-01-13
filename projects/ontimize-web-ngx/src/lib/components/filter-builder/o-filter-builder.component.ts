import { AfterViewInit, Component, EventEmitter, forwardRef, Inject, Injector, NgModule, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Codes, Util } from '../../utils';
import { OSharedModule } from '../../shared';
import { InputConverter } from '../../decorators';
import { OFilterBuilderClearDirective } from './o-filter-builder-clear.directive';
import { OFilterBuilderQueryDirective } from './o-filter-builder-query.directive';
import { OFormComponent, OServiceComponent } from '../../components';
import { FilterExpressionUtils, IExpression, IBasicExpression } from '../filter-expression.utils';
import { IFormDataComponent } from '../o-form-data-component.class';

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
  'queryOnChangeDelay: query-on-change-delay'
];

export const DEFAULT_OUTPUTS_O_FILTER_BUILDER = [
  // Event triggered when the filter action is executed.
  'onFilter',

  // Event triggered when the clear action is excuted.
  'onClear'
];

export interface IFilterBuilderCmpTarget {
  formComponentAttr: string;
  targetAttr: string;
}

@Component({
  moduleId: module.id,
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
  public targetCmp: OServiceComponent;
  public expressionBuilder: (values: Array<{ attr, value }>) => IExpression;
  @InputConverter()
  public queryOnChange: boolean = false;
  @InputConverter()
  public queryOnChangeDelay: number = 0;

  protected filterComponents: Array<IFilterBuilderCmpTarget> = [];

  protected subscriptions: Subscription = new Subscription();

  constructor(
    @Inject(forwardRef(() => OFormComponent)) public form: OFormComponent,
    injector: Injector
  ) { }

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
    // Parse filters
    if (this.filters) {
      let filterArray: Array<string> = Util.parseArray(this.filters);
      filterArray.forEach(filter => {
        let filterElms = filter.split(Codes.COLUMNS_ALIAS_SEPARATOR);
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
        let formComponent: IFormDataComponent = this.form.getComponents()[filterComponent.formComponentAttr];
        if (formComponent) {
          this.subscriptions.add(
            formComponent.getFormControl().valueChanges
              .pipe(debounceTime(this.queryOnChangeDelay))
              .subscribe(a => this.triggerReload()));
        }
      });
    }
  }

  /**
   * Returns an `IExpression` object with the filter.
   * @returns the `IExpression` object with the filter.
   */
  getExpression(): IExpression {
    // Prepare form filter values [... { attr, value }]
    let formComponents = this.form.getComponents();
    let params: Array<{ attr, value }> = [];
    this.filterComponents.forEach((filterComponent: IFilterBuilderCmpTarget) => {
      let formComponent: IFormDataComponent = formComponents[filterComponent.formComponentAttr];
      let value = formComponent.getValue();
      params.push({
        attr: filterComponent.targetAttr,
        value: value
      });
    });

    // Trigger the function provided by the user
    if (this.expressionBuilder) {
      return this.expressionBuilder(params);
    }

    // Generate desfault expression
    let expressions: Array<IExpression> = [];
    params.forEach(elem => {
      if (Util.isDefined(elem.value)) {
        expressions.push(FilterExpressionUtils.buildExpressionEquals(elem.attr, elem.value));
      }
    });

    return expressions.length ? expressions.reduce((fe1, fe2) => FilterExpressionUtils.buildComplexExpression(fe1, fe2, FilterExpressionUtils.OP_OR)) : undefined;
  }

  /**
   * Returns an `IBasicExpression` object with the filter.
   * @returns the `IBasicExpression` object with the filter.
   */
  getBasicExpression(): IBasicExpression {
    return FilterExpressionUtils.buildBasicExpression(this.getExpression());
  }

  /**
   * Returns the filter builder target component.
   * @returns the target component.
   */
  getTargetComponent(): OServiceComponent {
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
    let formComponents = this.form.getComponents();
    this.getFilterAttrs().forEach((attr: string) => {
      formComponents[attr].setValue(void 0);
    });
    this.onClear.emit();
  }

  /**
   * Returns an array with the attributes of the filterable components
   */
  protected getFilterAttrs(): Array<string> {
    return this.filterComponents.map((elem: IFilterBuilderCmpTarget) => elem.formComponentAttr);
  }

}

@NgModule({
  imports: [
    OSharedModule,
    CommonModule
  ],
  declarations: [
    OFilterBuilderComponent,
    OFilterBuilderClearDirective,
    OFilterBuilderQueryDirective
  ],
  exports: [
    OFilterBuilderComponent,
    OFilterBuilderClearDirective,
    OFilterBuilderQueryDirective
  ]
})
export class OFilterBuilderModule { }
