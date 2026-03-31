import { OComponentPermissions } from './o-component-permissions.type';

export type ORoutePermissions = {
  permissionId: string;
  enabled?: boolean;
  components?: OComponentPermissions[];
};
