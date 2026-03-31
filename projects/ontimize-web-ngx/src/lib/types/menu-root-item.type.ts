import {
  MenuGroup,
  MenuGroupRoute,
  MenuItem,
  MenuItemAction,
  MenuItemLocale,
  MenuItemLogout,
  MenuItemRoute,
  MenuItemUserInfo,
} from '../interfaces/app-menu.interface';

export type MenuRootItem = (MenuGroup | MenuGroupRoute | MenuItemRoute | MenuItemAction | MenuItemLocale | MenuItemLogout | MenuItemUserInfo | MenuItem);
