import { AfterViewInit, Component, forwardRef, Inject, Injector, NgModule, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { Codes, Util } from '../../utils';
import { OSharedModule } from '../../shared';
import { InputConverter } from '../../decorators';
import { OFilterBuilderClearDirective } from './o-filter-builder-clear.directive';
import { OFilterBuilderQueryDirective } from './o-filter-builder-query.directive';
import { OFormComponent, OFormDataComponent, OServiceComponent } from '../../components';
import { FilterExpressionUtils, IExpression, IBasicExpression } from '../filter-expression.utils';

export const DEFAULT_INPUTS_O_FILTER_BUILDER = [
  // filters: [string] List of pairs of form component attributes and target component colums (componentAttr1:targetColumn1;componentAttr2:targetColumn2;...). Separated by ';'.
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

export interface IFilterBuilderCmpTarget {
  formComponentAttr: string;
  targetAttr: string;
}

@Component({
  selector: 'o-filter-builder',
  templateUrl: './o-filter-builder.component.html',
  inputs: DEFAULT_INPUTS_O_FILTER_BUILDER
})
/**
 * The OFilterBuilderComponent.
 */
export class OFilterBuilderComponent implements AfterViewInit, OnDestroy, OnInit {

  protected filters: string;
  protected targetCmp: OServiceComponent;
  protected expressionBuilder: (values: Array<{ attr, value }>) => IExpression;
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
      filterArray.map(filter => {
        let filterElms = filter.split(Codes.COLUMNS_ALIAS_SEPARATOR);
        this.filterComponents.push({
          formComponentAttr: filterElms[0],
          targetAttr: filterElms[1] ? filterElms[1] : filterElms[0]
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
        let formComponent: OFormDataComponent = this.form.getComponents()[filterComponent.formComponentAttr];
        if (formComponent) {
          this.subscriptions.add(formComponent.getFormControl().valueChanges
            .debounceTime(this.queryOnChangeDelay)
            .subscribe(a => this.triggerReload()));
        }
      });
    }
  }

  /**
   * Returns a 'IExpression' object with the filter.
   */
  getExpression(): IExpression {
    // Prepare form filter values [... { attr, value }]
    let formComponents = this.form.getComponents();
    let params: Array<{ attr, value }> = [];
    this.filterComponents.forEach((filterComponent: IFilterBuilderCmpTarget) => {
      let formComponent: OFormDataComponent = formComponents[filterComponent.formComponentAttr];
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
   * Returns a 'IBasicExpression' object with the filter.
   */
  getBasicExpression(): IBasicExpression {
    return FilterExpressionUtils.buildBasicExpression(this.getExpression());
  }

  getTargetComponent(): OServiceComponent {
    return this.targetCmp;
  }

  /**
   * Returns an array with the attributes of the filterable components
   */
  getFilterAttrs(): Array<string> {
    return this.filterComponents.map((elem: IFilterBuilderCmpTarget) => elem.formComponentAttr);
  }

  triggerReload(): void {
    this.getTargetComponent().reloadData();
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
