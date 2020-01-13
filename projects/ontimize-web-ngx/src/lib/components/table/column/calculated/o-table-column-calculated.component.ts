import { Component, Inject, forwardRef, Injector, ComponentFactoryResolver, ChangeDetectionStrategy } from '@angular/core';
import { OTableComponent } from '../../o-table.component';
import { OTableColumnComponent, DEFAULT_INPUTS_O_TABLE_COLUMN } from '../o-table-column.component';

export const DEFAULT_INPUTS_O_TABLE_COLUMN_CALCULATED = [
  ...DEFAULT_INPUTS_O_TABLE_COLUMN,
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
  moduleId: module.id,
  selector: 'o-table-column-calculated',
  templateUrl: './o-table-column-calculated.component.html',
  inputs: DEFAULT_INPUTS_O_TABLE_COLUMN_CALCULATED,
  providers: [
    {
      provide: OTableColumnComponent,
      useExisting: forwardRef(() => OTableColumnCalculatedComponent)
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class OTableColumnCalculatedComponent extends OTableColumnComponent {

  public operation: string;
  public functionOperation: OperatorFunction;

  constructor(
    @Inject(forwardRef(() => OTableComponent)) public table: OTableComponent,
    protected resolver: ComponentFactoryResolver,
    protected injector: Injector) {
    super(table, resolver, injector);

  }

}
