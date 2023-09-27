import type { ODialogConfig } from "./o-dialog.config";

export abstract class ODialogBase {
  abstract alert(title: string, message: string, config?: ODialogConfig);
  abstract info(title: string, message: string, config?: ODialogConfig);
  abstract warn(title: string, message: string, config?: ODialogConfig);
  abstract error(title: string, message: string, config?: ODialogConfig);
  abstract confirm(title: string, message: string, config?: ODialogConfig);
}