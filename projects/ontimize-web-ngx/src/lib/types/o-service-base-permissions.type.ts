import { OPermissions } from './o-permissions.type';

export type OServiceBasePermissions = {
  attr: string;
  selector: string;
  components?: OPermissions[];
  actions?: OPermissions[];
};
