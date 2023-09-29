import { EventEmitter } from '@angular/core';
import { OFormContainerComponent } from '../form-container/o-form-container.component';
import { OPermissions } from '../../types/o-permissions.type';
import { OFormCacheClass } from './cache/o-form.cache.class';
import { OFormMessageService } from './services/o-form-message.service';
import { OFormLayoutManagerBase } from '../../layouts/form-layout/o-form-layout-manager-base.class';
import { IFormDataComponentHash } from '../../interfaces/form-data-component-hash.interface';
import { IFormDataComponent } from '../../interfaces/form-data-component.interface';
import { OFormNavigationClass } from './navigation/o-form.navigation.class';
import { OFormToolbarBase } from './toolbar/o-form-toolbar-base.class';


export abstract class OFormBase {
  _pKeysEquiv = {};
  confirmExit: boolean;
  formData: object;
  ignoreOnExit: string[];
  canDiscardChanges: boolean;
  formParentKeysValues: object;
  keysArray: string[];
  keysSqlTypesArray: Array<string>
  includeBreadcrumb: boolean;

  isDetailForm: boolean;
  formContainer: OFormContainerComponent;
  undoButton: boolean;
  detectChangesOnBlur: boolean;

  onInsert: EventEmitter<any>;
  onUpdate: EventEmitter<any>;
  onDelete: EventEmitter<any>;
  onCancel: EventEmitter<null>;
  beforeUpdateMode: EventEmitter<null>;
  onDataLoaded: EventEmitter<object>;
  beforeCloseDetail: EventEmitter<any>;

  abstract executeToolbarAction(action: string, options?: any);
  abstract getAttribute(): string;
  abstract getComponents(): IFormDataComponentHash;
  abstract getFieldReference(attr: string): IFormDataComponent;
  abstract getFieldReferences(attrs: string[]): IFormDataComponentHash;
  abstract getFormCache(): OFormCacheClass;
  abstract getFormManager(): OFormLayoutManagerBase;
  abstract getFormNavigation(): OFormNavigationClass;
  abstract getActionsPermissions(): OPermissions[];
  abstract getKeysValues(): any;
  abstract isEditableDetail(): boolean;
  abstract isInInsertMode(): boolean;
  abstract registerToolbar(toolbar: OFormToolbarBase): void;
  abstract getRegisteredFieldsValues(): any;
  abstract showConfirmDiscardChanges(): Promise<boolean>;
  abstract setInitialMode();
  abstract setInsertMode(): void;
  abstract setUpdateMode(): void;
  abstract setUrlParamsAndReload(val: object);
  abstract isInitialStateChanged(ignoreAttrs?: string[]): boolean;
  abstract getFormToolbar(): OFormToolbarBase;
  abstract get isCacheStackEmpty(): boolean;
  abstract get messageService(): OFormMessageService;


}