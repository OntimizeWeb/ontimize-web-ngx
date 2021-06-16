import { OPermissions } from '../o-permissions.type';
import { OTableMenuPermissions } from './o-table-menu-permissions.type';

export type OTablePermissions = {
  attr: string;
  selector: string;
  menu?: OTableMenuPermissions;
  columns?: OPermissions[];
  actions?: OPermissions[];
  contextMenu?: OPermissions[];
};
