import { ChangeDetectionStrategy, Component, Injector, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { OColumn } from '../../../../../interfaces/o-column.interface';
import { Util } from '../../../../../util/util';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';

const INPUTS_ARRAY = [
  ...OBaseTableCellRenderer.INPUTS_ARRAY,
  // image-type [base64|url]: image type (extern url or base64). Default: no value.
  'imageType: image-type',
  // empty-image [string]: url of the image to be shown if the column has not any value. Default: no value.
  'emptyImage: empty-image',
  // avatar [no|yes]: view image as avatar (circle), only at presentation level. Default: no.
  'avatar'
];

const OUTPUTS_ARRAY = [
  'onClick'
];

@Component({
  selector: 'o-table-cell-renderer-image',
  templateUrl: './o-table-cell-renderer-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: INPUTS_ARRAY,
  outputs: OUTPUTS_ARRAY
})
export class OTableCellRendererImageComponent extends OBaseTableCellRenderer implements OnInit {

  public static INPUTS_ARRAY = INPUTS_ARRAY;
  public static OUTPUTS_ARRAY = OUTPUTS_ARRAY;

  public imageType: string;
  public emptyImage: string;
  protected _source: string;
  avatar: string;
  @ViewChild('templateref', { read: TemplateRef, static: false }) public templateref: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
    this.tableColumn.type = 'image';
    this.tableColumn.orderable = false;
    this.tableColumn.searchable = false;
  }

  ngOnInit() {
    if (this.table) {
      const oCol: OColumn = this.table.getOColumn(this.tableColumn.attr);
      oCol.title = Util.isDefined(this.tableColumn.title) ? this.tableColumn.title : undefined;
      oCol.definition.contentAlign = oCol.definition.contentAlign ? oCol.definition.contentAlign : 'center';
    }
  }

  getSource(cellData: any) {
    this._source = '';
    switch (this.imageType) {
      case 'base64':
        this._source = cellData ? ('data:image/png;base64,' + ((typeof (cellData.bytes) !== 'undefined') ? cellData.bytes : cellData)) : this.emptyImage;
        break;
      case 'url':
        this._source = cellData ? cellData : this.emptyImage;
        break;
      default:
        this._source = this.emptyImage;
        break;
    }
    return this._source;
  }

}
