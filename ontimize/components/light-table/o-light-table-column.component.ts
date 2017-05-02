import {Component, OnInit, Inject, Injector, forwardRef,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation} from '@angular/core';

import {OLightTableComponent} from './o-light-table.component';
import {MomentService} from '../../services';

export const DEFAULT_INPUTS_O_LIGHT_TABLE_COLUMN = [
  'id',
  'title',
  'otype: type',
  'format',
  'pipe',
  'flex'
];

export const DEFAULT_OUTPUTS_O_LIGHT_TABLE_COLUMN = [

];

@Component({
  selector: 'o-light-table-column',
  templateUrl: 'o-light-table-column.component.html',
  styleUrls: ['o-light-table-column.component.scss'],
  inputs: [
   ...DEFAULT_INPUTS_O_LIGHT_TABLE_COLUMN
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_LIGHT_TABLE_COLUMN
  ],
  encapsulation: ViewEncapsulation.None
})
export class OLightTableColumnComponent implements OnInit {

  public static DEFAULT_INPUTS_O_LIGHT_TABLE_COLUMN = DEFAULT_INPUTS_O_LIGHT_TABLE_COLUMN;
  public static DEFAULT_OUTPUTS_O_LIGHT_TABLE_COLUMN = DEFAULT_OUTPUTS_O_LIGHT_TABLE_COLUMN;

  public static DATE_TYPE: string = 'date';

  id: string;
  title: string = '';
  otype: string = 'text';
  format: string;
  flex: string;

  protected _table:any;

  private momentSrv: MomentService;

  constructor( @Inject(forwardRef(() => OLightTableComponent)) _table: OLightTableComponent,
    protected injector: Injector) {
    this.momentSrv = injector.get(MomentService);
    this._table = _table;
  }

  ngOnInit() {
    this._table.registerColumn(this);
  }

  getId() {
    return this.id;
  }

  getRenderedValue(value) {
    if (value) {
      switch (this.otype) {
        case OLightTableColumnComponent.DATE_TYPE: value = this.parseDate(value); break;
        default: break;
      }
    }
    return value;
  }

  parseDate(value: any): any {
    var result = '';
    result = this.momentSrv.parseDate(value, this.format);
    return result;
  }

}


@NgModule({
  declarations: [OLightTableColumnComponent],
  imports: [],
  exports: [OLightTableColumnComponent],
})
export class OLightTableColumnModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OLightTableColumnModule,
      providers: []
    };
  }
}
