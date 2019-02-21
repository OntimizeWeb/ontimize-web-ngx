import { Component, Inject, forwardRef, OnInit, Injector, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { OTableComponent, OColumn } from '../../../o-table.component';
import { Util } from '../../../../../utils';
import { InputConverter } from '../../../../../decorators';

export const DEFAULT_INPUTS_O_TABLE_INSERTABLE_ROW = [
  // columns [string]: columns that can be inserted, separated by ';'. Default: all visible columns.
  'columns',
  'requiredColumns : required-columns',
  // position [first |last ] default: last
  'position',
  'showPlaceHolder: show-placeholder',
  'includeParentKeys: include-parent-keys'
];

export const DEFAULT_OUTPUTS_O_TABLE_INSERTABLE_ROW = [
  'onPostInsertRecord'
];

@Component({
  moduleId: module.id,
  selector: 'o-table-insertable-row',
  template: ' ',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: DEFAULT_INPUTS_O_TABLE_INSERTABLE_ROW,
  outputs: DEFAULT_OUTPUTS_O_TABLE_INSERTABLE_ROW
})

export class OTableInsertableRowComponent implements OnInit {

  public static DEFAULT_INPUTS_O_TABLE_INSERTABLE_ROW = DEFAULT_INPUTS_O_TABLE_INSERTABLE_ROW;
  public static DEFAULT_OUTPUTS_O_TABLE_INSERTABLE_ROW = DEFAULT_OUTPUTS_O_TABLE_INSERTABLE_ROW;
  public static AVAILABLE_ROW_POSITIONS = ['first', 'last'];
  public static DEFAULT_ROW_POSITION = 'last';

  protected columns: string;
  protected columnsArray: Array<string> = [];

  protected requiredColumns: string;
  protected requiredColumnsArray: Array<string> = [];

  onPostInsertRecord: EventEmitter<any> = new EventEmitter();

  protected position: string = OTableInsertableRowComponent.DEFAULT_ROW_POSITION;

  @InputConverter()
  showPlaceHolder: boolean = false;
  @InputConverter()
  includeParentKeys: boolean = true;

  enabled = true;

  constructor(
    protected injector: Injector,
    @Inject(forwardRef(() => OTableComponent)) protected table: OTableComponent
  ) {
  }

  ngOnInit() {
    this.columnsArray = Util.parseArray(this.columns, true);
    if (this.columnsArray.length === 0) {
      this.columnsArray = this.table.oTableOptions.visibleColumns;
    }
    this.requiredColumnsArray = Util.parseArray(this.requiredColumns, true);
    if (OTableInsertableRowComponent.AVAILABLE_ROW_POSITIONS.indexOf((this.position || '').toLowerCase()) === -1) {
      this.position = OTableInsertableRowComponent.DEFAULT_ROW_POSITION;
    }
    this.table.setOTableInsertableRow(this);
  }

  isFirstRow(): boolean {
    return this.position === 'first';
  }

  isColumnInsertable(column: OColumn): boolean {
    return (this.columnsArray.indexOf(column.attr) !== -1);
  }

  isColumnRequired(column: OColumn): boolean {
    return (this.requiredColumnsArray.indexOf(column.attr) !== -1);
  }

}
