import { Injectable } from '@angular/core';

@Injectable()
export class OFormMessageService {

  getQueryErrorMessage(): string {
    return 'MESSAGES.ERROR_QUERY';
  }

  getUpdateSuccessMessage(): string {
    return 'MESSAGES.SAVED';
  }

  getUpdateErrorMessage(): string {
    return 'MESSAGES.ERROR_UPDATE';
  }

  getDeleteSuccessMessage(): string {
    return 'MESSAGES.DELETED';
  }

  getDeleteErrorMessage(): string {
    return 'MESSAGES.ERROR_DELETE';
  }

  getDeleteConfirmationMessage(): string {
    return 'MESSAGES.CONFIRM_DELETE';
  }

  getDeleteConfirmationDialogTitle(): string {
    return 'CONFIRM';
  }
  
  getInsertSuccessMessage(): string {
    return 'MESSAGES.INSERTED';
  }

  getInsertErrorMessage(): string {
    return 'MESSAGES.ERROR_INSERT';
  }

  getValidationError(): string {
    return 'MESSAGES.FORM_VALIDATION_ERROR';
  }

  getValidationErrorDialogTitle(): string {
    return 'ERROR';
  }

  getNothingToUpdateMessage(): string {
    return 'MESSAGES.FORM_NOTHING_TO_UPDATE_INFO';
  }

  getActionPermissionNotEnabledMessage(): string {
    return 'MESSAGES.OPERATION_NOT_ALLOWED_PERMISSION';
  }

  getDiscardChangesConfirmationMessage(): string {
    return 'MESSAGES.FORM_CHANGES_WILL_BE_LOST';
  }

  getDiscardChangesConfirmationDialogTitle(): string {
    return 'CONFIRM';
  }

}
