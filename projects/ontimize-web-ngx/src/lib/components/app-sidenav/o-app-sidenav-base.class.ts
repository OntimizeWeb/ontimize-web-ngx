import { EventEmitter } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";

export abstract class OAppSidenavBase {
  abstract onSidenavOpenedChange: EventEmitter<boolean>;
  abstract sidenav: MatSidenav;
  abstract onSidenavClosedStart: EventEmitter<void>;
  abstract onSidenavOpenedStart: EventEmitter<void>;
}