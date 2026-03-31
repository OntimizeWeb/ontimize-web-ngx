import { OPermissions } from '../o-permissions.type';
import { OServiceBasePermissions } from '../o-service-base-permissions.type';
import { OTableMenuPermissions } from './o-table-menu-permissions.type';

export type OTablePermissions = OServiceBasePermissions & {
  menu?: OTableMenuPermissions;
  columns?: OPermissions[];
  contextMenu?: OPermissions[];
};