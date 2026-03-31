import { Injectable } from "@angular/core";
import { PermissionsService } from "../../services/permissions/permissions.service";
import { MenuRootItem } from '../../types/menu-root-item.type';

@Injectable()
export abstract class OBarMenuBase {
  abstract getPermissionsService(): PermissionsService;
  abstract collapseAll();
  abstract ngOnInit(): void;
  abstract setDOMTitle(): void;
  abstract get menuTitle(): string;
  abstract set menuTitle(val: string);
  abstract get tooltip(): string;
  abstract set tooltip(val: string);
  abstract get id(): string;
  abstract set id(val: string);
  abstract get menuItems(): MenuRootItem[];
}
