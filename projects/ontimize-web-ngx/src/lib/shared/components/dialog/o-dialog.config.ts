export type AlertType = 'info' | 'warn' | 'error';

export class ODialogConfig {

  /* The type of preconfigured alert dialogs */
  alertType?: AlertType;

  /* The text of 'ok' button */
  okButtonText?: string;

  /* The text of 'cancel' button */
  cancelButtonText?: string;

  /* The material icon of the dialog */
  icon?: string;
}
