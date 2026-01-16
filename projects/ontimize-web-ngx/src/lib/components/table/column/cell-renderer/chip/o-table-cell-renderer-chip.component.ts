import { ChangeDetectionStrategy, Component, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';
import { Util } from '../../../../../util/util';
import { Codes } from '../../../../../util';
import { BooleanInputConverter } from '../../../../../decorators';
export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_CHIP = [
  'icon',
  'svgIcon:svg-icon',
  'iconPosition: icon-position',
  'translate: boolean'
];
@Component({
  selector: 'o-table-cell-renderer-chip',
  templateUrl: './o-table-cell-renderer-chip.component.html',
  styleUrls: ['./o-table-cell-renderer-chip.component.scss'],
  inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_CHIP,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OTableCellRendererChipComponent extends OBaseTableCellRenderer implements OnInit {

  @ViewChild('templateref', { read: TemplateRef, static: true }) public templateref: TemplateRef<any>;
  public iconPosition = Codes.ICON_POSITION_LEFT;
  public svgIcon: string;
  public icon: string;
  @BooleanInputConverter()
  translate:boolean = true;
  constructor(protected injector: Injector) {
    super(injector);
    this.tableColumn.type = 'chip';
  }

  initialize() {
    super.initialize();
     this.iconPosition = Util.parseIconPosition(this.iconPosition);

  }

  getCellData(value: any) {
    return value;
  }
  public isArray(value: any): boolean {
    return Array.isArray(value);
  }

  isIconPositionLeft() {
    return Util.isDefined(this.icon) && this.iconPosition === Codes.ICON_POSITION_LEFT;
  }

  isIconPositionRight() {
    return Util.isDefined(this.icon) && this.iconPosition === Codes.ICON_POSITION_RIGHT;
  }

  isSvgIconPositionRight() {
    return Util.isDefined(this.svgIcon) && this.iconPosition === Codes.ICON_POSITION_RIGHT;
  }

  isSvgIconPositionLeft() {
    return Util.isDefined(this.svgIcon) && this.iconPosition === Codes.ICON_POSITION_LEFT;
  }

  public shouldTranslate(): boolean {
    return this.translate !== false; // Por defecto true
  }

}
