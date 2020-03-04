import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, forwardRef, Inject, Injector } from '@angular/core';

import { OTableComponent } from '../../o-table.component';
import { OTableColumnComponent } from '../o-table-column.component';

const INPUTS_ARRAY = [
  ...OTableColumnComponent.INPUTS_ARRAY,
  // operation [string]: operation .
  'operation',
  // operation-function [funtion]: callback title. Default: no value.
  'functionOperation: operation-function'
];

export type OperatorFunction = (value: any[]) => number;

export class OColumnCalculated {
  operator: string | OperatorFunction;
}

@Component({
  selector: 'o-table-column-calculated',
  templateUrl: './o-table-column-calculated.component.html',
  inputs: INPUTS_ARRAY,
  providers: [
    {
      provide: OTableColumnComponent,
      useExisting: forwardRef(() => OTableColumnCalculatedComponent)
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class OTableColumnCalculatedComponent extends OTableColumnComponent {

  public static INPUTS_ARRAY = INPUTS_ARRAY;
  public operation: string;
  public functionOperation: OperatorFunction;

  constructor(
    @Inject(forwardRef(() => OTableComponent)) public table: OTableComponent,
    protected resolver: ComponentFactoryResolver,
    protected injector: Injector) {
    super(table, resolver, injector);

  }

}
