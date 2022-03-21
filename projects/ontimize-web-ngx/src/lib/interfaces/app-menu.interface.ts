export interface MenuGroup {
  id: string;
  name: string;
  icon?: string;
  items: (MenuItemRoute | MenuItemAction | MenuItemLocale | MenuItemLogout | MenuItemUserInfo | MenuGroup | MenuItem)[];
  opened?: boolean;
  tooltip?: string;
  class?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  tooltip?: string;
  icon?: string;
  image?: string;
  component?: any;
  class?: string;
  'component-inputs'?: object;
  'show-in-card-menu'?: boolean;
}

export interface MenuItemRoute extends MenuItem {
  route: string;
  pathMatch: 'full' | 'prefix'
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
