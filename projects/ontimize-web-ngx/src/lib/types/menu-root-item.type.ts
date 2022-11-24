import {
  MenuGroup,
  MenuItem,
  MenuItemAction,
  MenuItemLocale,
  MenuItemLogout,
  MenuItemUserInfo,
} from '../interfaces/app-menu.interface';

export type MenuRootItem = (MenuGroup | MenuItemAction | MenuItemLocale | MenuItemLogout | MenuItemUserInfo | MenuItem);
