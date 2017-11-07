import { Component, Inject, forwardRef, Injector, TemplateRef, ViewChild } from '@angular/core';


//import { InputConverter } from '../../../../decorators';
import { OTableColumnComponent } from '../o-table-column.component'

export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_IMAGE = [

  // image-type [base64|url]: image type (extern url or base64). Default: no value.
  'imageType: image-type',

  // empty-image [string]: url of the image to be shown if the column has not any value. Default: no value.
  'emptyImage: empty-image',

  // avatar [no|yes]: view image as avatar (circle), only at presentation level. Default: no.
  'avatar'

];
export const DEFAULT_OUTPUTS_O_TABLE_CELL_RENDERER_IMAGE = [
  'onClick'
];


@Component({
  selector: 'o-table-cell-renderer-image',
  templateUrl: './o-table-cell-renderer-image.component.html',
  inputs: [
    ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_IMAGE
  ]
})
export class OTableCellRendererImageComponent {

  public static DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_IMAGE = DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_IMAGE;
  public static DEFAULT_OUTPUTS_O_TABLE_CELL_RENDERER_IMAGE = DEFAULT_OUTPUTS_O_TABLE_CELL_RENDERER_IMAGE;

  protected tableColumn: OTableColumnComponent;

  public imageType: string;
  public emptyImage: string;
  protected _source: string
  

  @ViewChild('templateref', { read: TemplateRef }) public templateref: TemplateRef<any>;

  constructor( @Inject(forwardRef(() => OTableColumnComponent)) tableColumn: OTableColumnComponent,
    protected injector: Injector) {

    this.tableColumn = this.injector.get(OTableColumnComponent);
    this.tableColumn.type = "image"
    this.tableColumn.registerRenderer(this);
  }


  getSource(cellData: any) {

    //console.log("sourcde ")
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
    };
    return this._source;
  }

}
