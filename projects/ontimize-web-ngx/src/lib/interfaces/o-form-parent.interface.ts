import { EventEmitter, InjectionToken } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { OFormLayoutManagerBase } from '../layouts/form-layout/o-form-layout-manager-base.class';
import { OFormNavigationClass } from '../components/form/navigation/o-form.navigation.class';
import { OPermissions } from '../types/o-permissions.type';
import { IFormDataComponent } from './form-data-component.interface';
import { IFormDataTypeComponent } from './form-data-type-component.interface';
import { IComponent } from './component.interface';
import { IFormDataComponentHash } from './form-data-component-hash.interface';

/**
 * Interface that a form parent must implement so that Ontimize input components
 * can register themselves and read form state without depending directly on OFormComponent.
 *
 * Provide this via the O_FORM_CONTEXT token:
 *   providers: [{ provide: O_FORM_CONTEXT, useExisting: MyFormComponent }]
 */
export interface IOFormParent {
  /** The reactive FormGroup that the form manages. */
  formGroup: FormGroup;
  /** The `attr` of the form (used to scope permissions). */
  oattr: string;
  /** Event emitted after the form loads data from the server. */
  onDataLoaded: EventEmitter<object>;
  /** Event emitted before the form closes a detail (used by html-input). */
  beforeCloseDetail: EventEmitter<any>;
  /** Event emitted before the form enters update mode (used by html-input). */
  beforeUpdateMode: EventEmitter<null>;
  /** The service path of the form (used by file-input to inherit when not set). */
  service: string;
  /** The entity of the form (used by file-input to inherit when not set). */
  entity: string;
  /** Keys array (used by ServiceUtils.getParentKeysFromForm). */
  keysArray: string[];
  /** SQL types array parallel to keysArray. */
  keysSqlTypesArray: string[];

  isInInsertMode(): boolean;
  isInUpdateMode(): boolean;
  isEditableDetail(): boolean;

  registerFormComponent(comp: IComponent): void;
  unregisterFormComponent(comp: IComponent): void;

  registerFormControlComponent(comp: IFormDataComponent): void;
  unregisterFormControlComponent(comp: IFormDataComponent): void;

  registerSQLTypeFormComponent(comp: IFormDataTypeComponent): void;
  unregisterSQLTypeFormComponent(comp: IFormDataTypeComponent): void;

  getFormComponentPermissions(attr: string): OPermissions;

  /** Returns all registered form data components. */
  getComponents(): IFormDataComponentHash;
  /** Returns form data values (used by ServiceUtils.getParentKeysFromForm). */
  getDataValues(): any;
  /** Returns the SQL types map for all form attributes. */
  getAttributesSQLTypes(): object;
  /** Returns the layout manager, if any. */
  getFormManager(): OFormLayoutManagerBase;
  /** Returns the navigation helper. */
  getFormNavigation(): OFormNavigationClass;
}

export const O_FORM_CONTEXT = new InjectionToken<IOFormParent>('O_FORM_CONTEXT');
