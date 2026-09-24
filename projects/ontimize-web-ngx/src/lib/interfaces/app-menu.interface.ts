export interface MenuCommonRoute {
  route?: string;
  pathMatch?: 'full' | 'prefix'
}

export interface MenuCommonItem {
  id: string;
  name: string;
  tooltip?: string;
  svgIcon?: string;
  icon?: string;
  class?: string;
  visible?: boolean;
  type?: string; //Currently only 'section' is supported, the rest of the types are still inferred from the entry properties.
}

export interface MenuGroup extends MenuCommonItem {
  items: (MenuItemAction | MenuItemLocale | MenuItemLogout | MenuItemUserInfo | MenuGroup | MenuItem | MenuItemRoute)[];
  opened?: boolean;
}

export interface MenuGroupRoute extends MenuGroup, MenuCommonRoute {
}

/**
 * Non collapsable menu entry that groups a set of root menu entries under a title.
 * It is only supported at the root level of the menu configuration.
 */
export interface MenuSection extends MenuGroup {
  type: 'section';
}

export interface MenuItem extends MenuCommonItem {
  image?: string;
  component?: any;
  'component-inputs'?: object;
  'show-in-card-menu'?: boolean;
}
export interface MenuItemRoute extends MenuItem, MenuCommonRoute {
}

export interface MenuItemAction extends MenuItem {
  confirm?: string;
  confirmText?: string;
  action(): any;
}

export interface MenuItemLocale extends MenuItem {
  locale: string;
}

export interface MenuItemLogout extends MenuItem {
  route: string;
  confirm: string;
}

export interface MenuItemUserInfo extends MenuItem {
  user: string;
  avatar: string;
}
