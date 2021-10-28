import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  forwardRef,
  Inject,
  Injector,
  NgModule,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { InputConverter } from '../../../decorators';
import { DialogService, NavigationService, OPermissions, SnackBarService } from '../../../services';
import { OSharedModule } from '../../../shared';
import { PermissionsUtils } from '../../../util/permissions';
import { Util } from '../../../util/util';
import { OFormNavigationComponent } from '../navigation/o-form-navigation.component';
import { OFormComponent } from '../o-form.component';


export const DEFAULT_INPUTS_O_FORM_TOOLBAR = [
  'labelHeader: label-header',
  'labelHeaderAlign: label-header-align',
  'headeractions: header-actions',
  'showHeaderActionsText: show-header-actions-text',
  // show-header-navigation [string][yes|no|true|false]: Include navigations buttons in form-toolbar. Default: true;
  'showHeaderNavigation:show-header-navigation'
];

@Component({
  moduleId: module.id,
  selector: 'o-form-toolbar',
  templateUrl: './o-form-toolbar.component.html',
  styleUrls: ['./o-form-toolbar.component.scss'],
  inputs: DEFAULT_INPUTS_O_FORM_TOOLBAR,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-form-toolbar]': 'true'
  }
})
export class OFormToolbarComponent implements OnInit, OnDestroy {

  public static DEFAULT_INPUTS_O_FORM_TOOLBAR = DEFAULT_INPUTS_O_FORM_TOOLBAR;

  /* Bindings */
  public labelHeader: string = '';
  public headeractions: string = '';
  public labelHeaderAlign: string = 'center';

  @InputConverter()
  public showHeaderActionsText: boolean = true;
  @InputConverter()
  public showHeaderNavigation: boolean = true;

  public formActions: string[];
  public isDetail: boolean = true;

  public editMode: boolean = false;
  public insertMode: boolean = false;
  public initialMode: boolean = true;
  public refreshBtnEnabled: boolean = false;
  public insertBtnEnabled: boolean = false;
  public deleteBtnEnabled: boolean = false;

  @ViewChild('breadcrumb', { read: ViewContainerRef })
  public breadContainer: ViewContainerRef;

  public isSaveBtnEnabled: Observable<boolean>;
  public isEditBtnEnabled: Observable<boolean>;
  public existsChangesToSave: Observable<boolean>;

  get changesToSave(): boolean {
    return this._changesToSave;

  }

  set changesToSave(val: boolean) {
    this._changesToSave = val;
    const attr = this._form.isEditableDetail() ? PermissionsUtils.ACTION_UPDATE : PermissionsUtils.ACTION_INSERT;
    const permissions: OPermissions = (this.actionsPermissions || []).find(p => p.attr === attr);
    if (Util.isDefined(permissions) && permissions.enabled === false) {
      return;
    }

    this._existsChangesToSaveSubject.next(val);

  }

  protected _changesToSave: boolean = false;


  get editBtnEnabled(): boolean {
    return this._editBtnEnabled;
  }
  set editBtnEnabled(value: boolean) {
    this._editBtnEnabled = value;
    this._isEditBtnEnabledSubject.next(this._editBtnEnabled);
  }
  protected _editBtnEnabled: boolean = false;

  get saveBtnEnabled(): boolean {
    return this._saveBtnEnabled;
  }
  set saveBtnEnabled(value: boolean) {
    this._saveBtnEnabled = value;
    this._isSaveBtnEnabledSubject.next(this._saveBtnEnabled);
  }
  protected _saveBtnEnabled: boolean = false;


  protected _dialogService: DialogService;
  protected _navigationService: NavigationService;
  protected mutationObservers: MutationObserver[] = [];

  protected formCacheSubscription: Subscription;
  protected actionsPermissions: OPermissions[];
  protected snackBarService: SnackBarService;

  protected _includeBreadcrumb: boolean;

  protected _isSaveBtnEnabledSubject = new BehaviorSubject<boolean>(false);
  protected _isEditBtnEnabledSubject = new BehaviorSubject<boolean>(false);
  protected _existsChangesToSaveSubject = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(forwardRef(() => OFormComponent)) private _form: OFormComponent,
    public element: ElementRef,
    protected injector: Injector
  ) {
    this.isSaveBtnEnabled = this._isSaveBtnEnabledSubject.asObservable();
    this.isEditBtnEnabled = this._isEditBtnEnabledSubject.asObservable();
    this.existsChangesToSave = this._existsChangesToSaveSubject.asObservable();

    this._form.registerToolbar(this);
    this._dialogService = this.injector.get(DialogService);
    this._navigationService = this.injector.get(NavigationService);
    this.snackBarService = this.injector.get(SnackBarService);
  }

  public ngOnInit(): void {
    this.formActions = Util.parseArray(this.headeractions);
    if (this.formActions && this.formActions.length > 0) {
      this.refreshBtnEnabled = this.formActions.indexOf('R') !== -1;
      this.insertBtnEnabled = this.formActions.indexOf('I') !== -1;
      this.editBtnEnabled = this.formActions.indexOf('U') !== -1;
      this.deleteBtnEnabled = !this.insertMode && this.formActions.indexOf('D') !== -1;
    }
    if (this._navigationService) {
      const self = this;
      this._navigationService.onTitleChange(title => {
        self.labelHeader = title;
      });
    }
    this.includeBreadcrumb = this._form.includeBreadcrumb && this._form.formContainer.breadcrumb;
    if (this.includeBreadcrumb) {
      this._form.formContainer.breadcrumb = false;
    }
  }

  public ngOnDestroy(): void {
    if (this.formCacheSubscription) {
      this.formCacheSubscription.unsubscribe();
    }
    if (this.mutationObservers) {
      this.mutationObservers.forEach((m: MutationObserver) => {
        m.disconnect();
      });
    }
  }

  public ngAfterViewInit(): void {
    this.parsePermissions();
    if (this.includeBreadcrumb) {
      this._form.formContainer.createBreadcrumb(this.breadContainer);
    }
  }

  public setInitialMode(): void {
    this.manageEditableDetail();
    this.initialMode = true;
    this.insertMode = false;
    this.editMode = false;
  }

  public setInsertMode(): void {
    this.initialMode = false;
    this.insertMode = true;
    this.editMode = false;
  }

  public setEditMode(): void {
    this.initialMode = false;
    this.insertMode = false;
    this.editMode = true;
  }

  public onCloseDetail(): void {
    this._form.executeToolbarAction(OFormComponent.CLOSE_DETAIL_ACTION, {
      changeToolbarMode: true
    });
  }

  public onBack(): void {
    this._form.executeToolbarAction(OFormComponent.BACK_ACTION);
  }

  public onReload(): void {
    if (!this.checkEnabledPermission(PermissionsUtils.ACTION_REFRESH)) {
      return;
    }
    const self = this;
    this._form.showConfirmDiscardChanges().then(val => {
      if (val) {
        self._form.executeToolbarAction(OFormComponent.RELOAD_ACTION);
      }
    });
  }

  public onInsert(): void {
    if (!this.checkEnabledPermission(PermissionsUtils.ACTION_INSERT)) {
      return;
    }

    this._form.executeToolbarAction(OFormComponent.GO_INSERT_ACTION, {
      changeToolbarMode: true
    });
  }

  public onEdit(): void {
    if (!this.checkEnabledPermission(PermissionsUtils.ACTION_UPDATE)) {
      return;
    }

    this._form.executeToolbarAction(OFormComponent.GO_EDIT_ACTION, {
      changeToolbarMode: true
    });
  }

  public onDelete(evt: any): void {
    if (!this.checkEnabledPermission(PermissionsUtils.ACTION_DELETE)) {
      return;
    }

    this.showConfirmDelete(evt);
  }

  public onSave(evt: any): void {
    if (!this.checkEnabledPermission(PermissionsUtils.ACTION_UPDATE)) {
      return;
    }

    this.handleAcceptEditOperation();
  }

  public cancelOperation(): void {
    if (this.isDetail) {
      this.onCloseDetail();
    } else if (this.insertMode) {
      this.onBack();
    } else {
      this.onReload();
      this._form.setInitialMode();
    }
  }

  public acceptOperation(): void {
    if (this.editMode) {
      if (!this.checkEnabledPermission(PermissionsUtils.ACTION_UPDATE)) {
        return;
      }
      this.handleAcceptEditOperation();
    } else if (this.insertMode) {
      if (!this.checkEnabledPermission(PermissionsUtils.ACTION_INSERT)) {
        return;
      }
      this.handleAcceptInsertOperation();
    }
  }

  public handleAcceptInsertOperation(): void {
    this._form.executeToolbarAction(OFormComponent.INSERT_ACTION);
  }

  public handleAcceptEditOperation(): void {
    this._form.executeToolbarAction(OFormComponent.EDIT_ACTION);
  }

  public showConfirmDelete(evt: any): void {
    this._dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DELETE').then(res => {
      if (res === true) {
        this._form.executeToolbarAction(OFormComponent.DELETE_ACTION).subscribe(resp => {
          this._form.onDelete.emit(resp);
          this.onCloseDetail();
        }, err => {
          console.error('OFormToolbar.delete error', err);
        });
      }
    }
    );
  }

  get showNavigation(): boolean {
    return this.showHeaderNavigation && !(this._form.getFormManager() && this._form.getFormManager().isTabMode());
  }

  public getLabelHeaderAlign(): string {
    return this.labelHeaderAlign;
  }

  get showUndoButton(): boolean {
    return this._form.undoButton && (!this.initialMode || this._form.isEditableDetail());
  }

  get isChangesStackEmpty(): boolean {
    return this._form.isCacheStackEmpty;
  }

  public onUndoLastChange(): void {
    this._form.executeToolbarAction(OFormComponent.UNDO_LAST_CHANGE_ACTION);
  }

  get isRefreshBtnEnabled(): boolean {
    return this.refreshBtnEnabled;
  }

  get isInsertBtnEnabled(): boolean {
    return this.insertBtnEnabled;
  }

  get isDeleteBtnEnabled(): boolean {
    return this.deleteBtnEnabled;
  }

  public hasEnabledPermission(permission: OPermissions): boolean {
    return permission ? permission.enabled : true;
  }

  get includeBreadcrumb(): boolean {
    return this._includeBreadcrumb;
  }

  set includeBreadcrumb(arg: boolean) {
    this._includeBreadcrumb = arg;
  }

  protected manageEditableDetail(): void {
    const isEditableDetail = this._form.isEditableDetail();

    const updatePermissions: OPermissions = (this.actionsPermissions || []).find(p => p.attr === PermissionsUtils.ACTION_UPDATE);
    if (this.hasEnabledPermission(updatePermissions)) {
      this.saveBtnEnabled = isEditableDetail;
    }

    this.refreshBtnEnabled = this.refreshBtnEnabled && isEditableDetail;
    this.insertBtnEnabled = this.insertBtnEnabled && isEditableDetail;
    this.editBtnEnabled = this.editBtnEnabled && !isEditableDetail;

    const self = this;
    this._form.getFormCache().onCacheStateChanges.asObservable().subscribe((value: any) => {
      if (self._form.isEditableDetail()) {
        self.changesToSave = self._form.isInitialStateChanged();
      }
    });
  }

  protected parsePermissions(): void {
    if (this._form.oattr) {
      this.actionsPermissions = this._form.getActionsPermissions();

      if (!Util.isDefined(this.actionsPermissions)) {
        return;
      }
      const self = this;
      this.actionsPermissions.forEach((permission: OPermissions) => {
        // others actions
        self.permissionManagement(permission);

        if (PermissionsUtils.STANDARD_ACTIONS.indexOf(permission.attr) > -1) {
          // actions R;I;U;D
          if (permission.attr === PermissionsUtils.ACTION_UPDATE) {
            self.permissionManagement(permission, 'edit');
          }
        }
      });
    }
  }

  private permissionManagement(permission: OPermissions, attr?: string): void {
    const attrAction = Util.isDefined(attr) ? attr : permission.attr;
    const elementByAction = this.element.nativeElement.querySelector('[attr="' + attrAction + '"]');

    if (Util.isDefined(elementByAction)) {
      if (!permission.visible) {
        elementByAction.remove();
      } else {
        if (!permission.enabled) {
          elementByAction.disabled = true;
          const mutationObserver = PermissionsUtils.registerDisabledChangesInDom(elementByAction);
          this.mutationObservers.push(mutationObserver);
        }
      }
    }
  }

  private checkEnabledPermission(attr): boolean {
    const permissions: OPermissions = (this.actionsPermissions || []).find(p => p.attr === attr);
    const enabledPermision = PermissionsUtils.checkEnabledPermission(permissions);
    if (!enabledPermision) {
      this.snackBarService.open('MESSAGES.OPERATION_NOT_ALLOWED_PERMISSION');
    }
    return enabledPermision;
  }

}

@NgModule({
  declarations: [OFormNavigationComponent, OFormToolbarComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OFormNavigationComponent, OFormToolbarComponent]
})
export class OFormToolbarModule { }
