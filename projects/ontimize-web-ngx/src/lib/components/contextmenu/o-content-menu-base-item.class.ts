import { Util } from '../../util/util';

export const DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS = [
  'attr',
  'ovisible: visible',
  'icon',
  'data',
  'label',
  'oenabled: enabled',
  'svgIcon: svg-icon'
];

export class OComponentMenuBaseItem {

  public static TYPE_ITEM_MENU = 'item_menu';
  public static TYPE_GROUP_MENU = 'item_group';
  public static TYPE_SEPARATOR_MENU = 'item_separator';
  public ovisible: boolean | ((item: any) => boolean) = true;
  public attr;
  public type = OComponentMenuBaseItem.TYPE_GROUP_MENU;
  public icon: string;
  public data: any;
  public label: string;
  public enabled: boolean | ((item: any) => boolean) = true;
  public svgIcon: string;

  get disabled(): boolean {
    if (this.enabled instanceof Function) {
      return !this.enabled(this.data);
    }
    return !this.enabled;
  }

  get isVisible(): boolean {
    if (this.ovisible instanceof Function) {
      return this.ovisible(this.data);
    }
    return this.ovisible;
  }

  set oenabled(value: (boolean | ((item: any) => boolean))) {
    if (value instanceof Function) {
      this.enabled = value;
    } else {
      this.enabled = this.parseInput(value, true);
    }
  }

  protected parseInput(value: any, defaultValue?: boolean): boolean {
    if (value instanceof Function || typeof value === 'boolean') {
      return value;
    }
    return Util.parseBoolean(value, defaultValue);
  }

}
