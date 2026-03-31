import { Injectable } from "@angular/core";
import type { OSnackBarConfig } from "./o-snackbar.component";
@Injectable()
export abstract class OSnackBarBase {
  abstract open(message: string, config?: OSnackBarConfig): void;
}