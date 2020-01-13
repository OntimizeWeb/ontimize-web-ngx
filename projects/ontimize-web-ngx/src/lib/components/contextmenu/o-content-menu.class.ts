import { Util } from '../../utils';

export const DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS = [
  'attr',
  'ovisible: visible'
];

export class OComponentMenuItems {

  public static TYPE_ITEM_MENU = 'item_menu';
  public static TYPE_GROUP_MENU = 'item_group';
  public static TYPE_SEPARATOR_MENU = 'item_separator';
  public ovisible: boolean | ((item: any) => boolean) = true;
  public attr;
  public type = OComponentMenuItems.TYPE_GROUP_MENU;

  public get isVisible(): boolean {
    return this.parseInput(this.ovisible);
  }

  protected parseInput(value: any, defaultValue?: boolean): boolean {
    if (value instanceof Function || typeof value === 'boolean') {
      return value;
    }
    return Util.parseBoolean(value, defaultValue);
  }

}
