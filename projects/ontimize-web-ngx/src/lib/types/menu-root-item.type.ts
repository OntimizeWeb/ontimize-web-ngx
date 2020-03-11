import {
  MenuGroup,
  MenuItem,
  MenuItemAction,
  MenuItemLocale,
  MenuItemLogout,
  MenuItemRoute,
  MenuItemUserInfo,
} from '../interfaces/app-menu.interface';

export type MenuRootItem = (MenuGroup | MenuItemRoute | MenuItemAction | MenuItemLocale | MenuItemLogout | MenuItemUserInfo | MenuItem);
