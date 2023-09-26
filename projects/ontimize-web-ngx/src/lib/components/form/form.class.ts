import { EventEmitter } from '@angular/core';
import type { OFormContainerComponent } from '../form-container/o-form-container.component';
import type { OFormLayoutManagerComponent } from '../../layouts/form-layout/o-form-layout-manager.component';
import { OPermissions } from '../../types/o-permissions.type';
import type { OFormCacheClass } from './cache/o-form.cache.class';
import { OFormMessageService } from './services/o-form-message.service';
import { OFormToolbarComponent } from './toolbar/o-form-toolbar.component';


export abstract class BaseOForm {
  includeBreadcrumb: boolean;
  isCacheStackEmpty: boolean;
  formContainer: OFormContainerComponent;
  undoButton: boolean;

  onInsert: EventEmitter<any>;
  onUpdate: EventEmitter<any>;
  onDelete: EventEmitter<any>;
  onCancel: EventEmitter<null>;
  abstract executeToolbarAction(action: string, options?: any);
  abstract getAttribute(): string;
  abstract getFormManager(): OFormLayoutManagerComponent;
  abstract getFormCache(): OFormCacheClass;
  abstract getActionsPermissions(): OPermissions[];
  abstract isEditableDetail(): boolean;
  abstract registerToolbar(toolbar: OFormToolbarComponent): void;
  abstract showConfirmDiscardChanges(): Promise<boolean>;
  abstract setInitialMode();
  abstract isInitialStateChanged(ignoreAttrs?: string[]): boolean;
  abstract get messageService(): OFormMessageService;


}