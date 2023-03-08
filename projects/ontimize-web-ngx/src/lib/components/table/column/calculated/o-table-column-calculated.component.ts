import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, forwardRef, Inject, Injector } from '@angular/core';

import { OTableColumnCalculated } from '../../../../interfaces/o-table-column-calculated.interface';
import { OperatorFunction } from '../../../../types/operation-function.type';
import { OTableComponent } from '../../o-table.component';
import { OTableColumnComponent } from '../o-table-column.component';

export const DEFAULT_INPUTS_O_TABLE_COLUMN_CALCULATED = [
  // operation [string]: operation .
  'operation',
  // operation-function [funtion]: callback title. Default: no value.
  'functionOperation: operation-function'
];

@Component({
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

export class OTableColumnCalculatedComponent extends OTableColumnComponent implements OTableColumnCalculated {

  public operation: string;
  public functionOperation: OperatorFunction;

  constructor(
    @Inject(forwardRef(() => OTableComponent)) public table: OTableComponent,
    protected resolver: ComponentFactoryResolver,
    protected injector: Injector) {
    super(table, resolver, injector);

  }

}
