import { OPermissions } from './o-permissions.type';

export type OFormPermissions = {
  attr: string;
  selector: string;
  components?: OPermissions[];
  actions?: OPermissions[];
};
