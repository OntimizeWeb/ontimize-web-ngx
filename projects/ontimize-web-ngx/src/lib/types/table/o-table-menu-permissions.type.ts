import { OPermissions } from '../o-permissions.type';

export type OTableMenuPermissions = {
  visible: boolean;
  enabled: boolean;
  items?: OPermissions[];
};
