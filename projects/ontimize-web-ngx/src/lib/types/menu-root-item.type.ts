import {
  MenuGroup,
  MenuGroupRoute,
  MenuItem,
  MenuItemAction,
  MenuItemLocale,
  MenuItemLogout,
  MenuItemRoute,
  MenuItemUserInfo,
  MenuSection,
} from '../interfaces/app-menu.interface';

export type MenuRootItem = (MenuGroup | MenuGroupRoute | MenuSection | MenuItemRoute | MenuItemAction | MenuItemLocale | MenuItemLogout | MenuItemUserInfo | MenuItem);
