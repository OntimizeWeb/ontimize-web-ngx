
import { Util } from '../../utils';
export const DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS = [
  'attr',
  'icon',
  'data',
  'label',
  'oenabled: enabled',
  'ovisible: visible',
  'children'
];
export class OComponentMenuItems {
  public static TYPE_ITEM_MENU = 'item_menu';
  public static TYPE_GROUP_MENU = 'item_group';
  public static TYPE_SEPARATOR_MENU = 'item_separator';
  protected oenabled;
  protected ovisible;
  public isActive: boolean | ((item: any) => boolean) = true;
  public icon: string;
  public data: any;
  public label: string;
  public enabled: boolean | ((item: any) => boolean) = true;
  public visible: boolean | ((item: any) => boolean) = true;
  public attr;
  public type = OComponentMenuItems.TYPE_GROUP_MENU;
  public children = [];

  ngOnInit() {
    this.enabled = this.parseInput(this.oenabled, true);
    this.visible = this.parseInput(this.ovisible, true);
  }

  public get disabled() {
    if (this.enabled instanceof Function) {
      return !this.enabled(this.data);
    }
    return !this.enabled;
  }

  public get isVisible() {
    if (this.visible instanceof Function) {
      return this.visible(this.data);
    }
    return this.visible;
  }



  protected parseInput(value: any, defaultValue?: boolean): boolean {
    if (value instanceof Function || typeof value === 'boolean') {
      return value;
    }
    return Util.parseBoolean(value, defaultValue);
  }

  public isItemMenu(): boolean {
    return this.type === OComponentMenuItems.TYPE_ITEM_MENU;
  }
}
