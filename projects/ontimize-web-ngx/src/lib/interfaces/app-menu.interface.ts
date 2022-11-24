export interface MenuItemRoute {
  route?: string;
  pathMatch?: 'full' | 'prefix'
}

export interface MenuCommonItem extends MenuItemRoute{
  id: string;
  name: string;
  tooltip?: string;
  icon?: string;
  class?: string;
}
export interface MenuGroup extends MenuCommonItem {
  items: (MenuItemAction | MenuItemLocale | MenuItemLogout | MenuItemUserInfo | MenuGroup | MenuItem)[];
  opened?: boolean;
}

export interface MenuItem extends MenuCommonItem {
  image?: string;
  component?: any;
  'component-inputs'?: object;
  'show-in-card-menu'?: boolean;
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
