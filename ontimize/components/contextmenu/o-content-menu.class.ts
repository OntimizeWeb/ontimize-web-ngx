
import { Util } from '../../utils';
export const DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS = [
  'attr',
  'ovisible: visible'
];
export class OComponentMenuItems {
  public static TYPE_ITEM_MENU = 'item_menu';
  public static TYPE_GROUP_MENU = 'item_group';
  public static TYPE_SEPARATOR_MENU = 'item_separator';
  protected ovisible;

  public visible: boolean | ((item: any) => boolean) = true;
  public attr;
  public type = OComponentMenuItems.TYPE_GROUP_MENU;

  ngOnInit() {
    this.visible = this.parseInput(this.ovisible, true);
  }


  public get isVisible() {
    return this.visible;
  }

  protected parseInput(value: any, defaultValue?: boolean): boolean {
    if (value instanceof Function || typeof value === 'boolean') {
      return value;
    }
    return Util.parseBoolean(value, defaultValue);
  }

}
