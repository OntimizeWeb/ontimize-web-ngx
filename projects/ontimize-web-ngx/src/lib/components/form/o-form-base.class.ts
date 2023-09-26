import { EventEmitter } from '@angular/core';
import { OFormContainerComponent } from '../form-container/o-form-container.component';
import { OPermissions } from '../../types/o-permissions.type';
import { OFormCacheClass } from './cache/o-form.cache.class';
import { OFormMessageService } from './services/o-form-message.service';
import { OFormToolbarComponent } from './toolbar/o-form-toolbar.component';
import { OFormLayoutManagerBase } from '../../layouts/form-layout/o-form-layout-manager-base.class';
import { IFormDataComponentHash } from '../../interfaces/form-data-component-hash.interface';
import { IFormDataComponent } from '../../interfaces/form-data-component.interface';


export abstract class OFormBase {
  includeBreadcrumb: boolean;
  isCacheStackEmpty: boolean;
  formContainer: OFormContainerComponent;
  undoButton: boolean;
  detectChangesOnBlur: boolean;

  onInsert: EventEmitter<any>;
  onUpdate: EventEmitter<any>;
  onDelete: EventEmitter<any>;
  onCancel: EventEmitter<null>;
  onDataLoaded: EventEmitter<object>;
  abstract executeToolbarAction(action: string, options?: any);
  abstract getAttribute(): string;
  abstract getComponents(): IFormDataComponentHash;
  abstract getFieldReference(attr: string): IFormDataComponent;
  abstract getFieldReferences(attrs: string[]): IFormDataComponentHash;
  abstract getFormManager(): OFormLayoutManagerBase;
  abstract getFormCache(): OFormCacheClass;
  abstract getActionsPermissions(): OPermissions[];
  abstract isEditableDetail(): boolean;
  abstract registerToolbar(toolbar: OFormToolbarComponent): void;
  abstract getRegisteredFieldsValues(): any;
  abstract showConfirmDiscardChanges(): Promise<boolean>;
  abstract setInitialMode();
  abstract isInitialStateChanged(ignoreAttrs?: string[]): boolean;
  abstract get messageService(): OFormMessageService;


}