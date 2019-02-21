import { Component, OnInit, OnDestroy, Inject, Injector, forwardRef, ElementRef, NgModule, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { InputConverter } from '../../../decorators';
import { Util } from '../../../util/util';
import { PermissionsUtils } from '../../../util/permissions';
import { DialogService, NavigationService, OPermissions, SnackBarService } from '../../../services';
import { OSharedModule } from '../../../shared';
import { OFormNavigationComponent } from '../navigation/o-form-navigation.component';
import { OFormComponent } from '../o-form.component';

export const DEFAULT_INPUTS_O_FORM_TOOLBAR = [
  'labelHeader: label-header',
  'labelHeaderAlign: label-header-align',
  'headeractions: header-actions',
  'showHeaderActionsText: show-header-actions-text',
  //show-header-navigation [string][yes|no|true|false]: Include navigations buttons in form-toolbar. Default: true;
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
  labelHeader: string = '';
  headeractions: string = '';
  labelHeaderAlign: string = 'center';

  @InputConverter()
  showHeaderActionsText: boolean = true;

  formActions: string[];
  isDetail: boolean = true;

  public editMode: boolean = false;
  public insertMode: boolean = false;
  public initialMode: boolean = true;

  refreshBtnEnabled: boolean = false;
  insertBtnEnabled: boolean = false;
  editBtnEnabled: boolean = false;
  deleteBtnEnabled: boolean = false;
  saveBtnEnabled: boolean = false;

  protected _existsChangesToSave: boolean = false;

  protected _dialogService: DialogService;
  protected _navigationService: NavigationService;
  protected mutationObservers: MutationObserver[] = [];

  protected formCacheSubscription: Subscription;
  protected actionsPermissions: OPermissions[];
  protected snackBarService: SnackBarService;

  @InputConverter()
  showHeaderNavigation: boolean = true;

  constructor(@Inject(forwardRef(() => OFormComponent)) private _form: OFormComponent,
    public element: ElementRef,
    protected injector: Injector) {
    _form.registerToolbar(this);
    this._dialogService = this.injector.get(DialogService);
    this._navigationService = this.injector.get(NavigationService);
    this.snackBarService = this.injector.get(SnackBarService);
  }

  ngOnInit() {
    this.formActions = Util.parseArray(this.headeractions);
    if (this.formActions && this.formActions.length > 0) {
      this.refreshBtnEnabled = this.formActions.indexOf('R') !== -1;
      this.insertBtnEnabled = this.formActions.indexOf('I') !== -1;
      this.editBtnEnabled = this.formActions.indexOf('U') !== -1;
      this.deleteBtnEnabled = !this.insertMode && this.formActions.indexOf('D') !== -1;
    }
    if (this._navigationService) {
      var self = this;
      this._navigationService.onTitleChange(title => {
        self.labelHeader = title;
      });
    }

  }

  ngOnDestroy() {
    if (this.formCacheSubscription) {
      this.formCacheSubscription.unsubscribe();
    }
    if (this.mutationObservers) {
      this.mutationObservers.forEach((m: MutationObserver) => {
        m.disconnect();
      });
    }
  }

  ngAfterViewInit(): void {
    this.parsePermissions();
  }

  protected parsePermissions() {
    if (this._form.oattr) {
      this.actionsPermissions = this._form.getActionsPermissions();

      if (!Util.isDefined(this.actionsPermissions)) {
        return;
      }
      const self = this;
      this.actionsPermissions.forEach((permission: OPermissions) => {
        //others actions
        self.permissionManagement(permission);

        if (PermissionsUtils.STANDARD_ACTIONS.indexOf(permission.attr) > -1) {
          //actions R;I;U;D
          if (permission.attr === PermissionsUtils.ACTION_UPDATE) {
            self.permissionManagement(permission, 'edit');
          }
        }
      });

    }
  }

  private permissionManagement(permission: OPermissions, attr?: string) {
    let attrAction = Util.isDefined(attr) ? attr : permission.attr;
    let elementByAction = this.element.nativeElement.querySelector('[attr="' + attrAction + '"]');

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

  protected manageEditableDetail() {
    const isEditableDetail = this._form.isEditableDetail();

    let updatePermissions: OPermissions = (this.actionsPermissions || []).find(p => p.attr === PermissionsUtils.ACTION_UPDATE);
    if (this.hasEnabledPermission(updatePermissions)) {
      this.saveBtnEnabled = isEditableDetail;
    }

    this.refreshBtnEnabled = this.refreshBtnEnabled && isEditableDetail;
    this.insertBtnEnabled = this.insertBtnEnabled && isEditableDetail;
    this.editBtnEnabled = this.editBtnEnabled && !isEditableDetail;

    const self = this;
    this._form.getFormCache().onCacheStateChanges.asObservable().subscribe((value: any) => {
      if (self._form.isEditableDetail()) {
        self.existsChangesToSave = self._form.isInitialStateChanged();
      }
    });
  }

  setInitialMode() {
    this.manageEditableDetail();
    this.initialMode = true;
    this.insertMode = false;
    this.editMode = false;
  }

  setInsertMode() {
    this.initialMode = false;
    this.insertMode = true;
    this.editMode = false;
  }

  setEditMode() {
    this.initialMode = false;
    this.insertMode = false;
    this.editMode = true;
  }

  onCloseDetail() {
    this._form.executeToolbarAction(OFormComponent.CLOSE_DETAIL_ACTION, {
      changeToolbarMode: true
    });
  }

  onBack() {
    this._form.executeToolbarAction(OFormComponent.BACK_ACTION);
  }

  onReload() {
    if (!this.checkEnabledPermission(PermissionsUtils.ACTION_REFRESH)) {
      return;
    }
    let self = this;
    this._form.showConfirmDiscardChanges().then(val => {
      if (val) {
        self._form.executeToolbarAction(OFormComponent.RELOAD_ACTION);
      }
    });
  }

  onInsert() {
    if (!this.checkEnabledPermission(PermissionsUtils.ACTION_INSERT)) {
      return;
    }

    this._form.executeToolbarAction(OFormComponent.GO_INSERT_ACTION, {
      changeToolbarMode: true
    });
  }

  onEdit() {
    if (!this.checkEnabledPermission(PermissionsUtils.ACTION_UPDATE)) {
      return;
    }

    this._form.executeToolbarAction(OFormComponent.GO_EDIT_ACTION, {
      changeToolbarMode: true
    });
  }

  onDelete(evt: any) {
    if (!this.checkEnabledPermission(PermissionsUtils.ACTION_DELETE)) {
      return;
    }

    this.showConfirmDelete(evt);
  }

  onSave(evt: any) {
    if (!this.checkEnabledPermission(PermissionsUtils.ACTION_UPDATE)) {
      return;
    }

    this.handleAcceptEditOperation();
  }

  get existsChangesToSave(): boolean {
    return this._existsChangesToSave;
  }

  set existsChangesToSave(val: boolean) {
    const attr = this._form.isEditableDetail() ? PermissionsUtils.ACTION_UPDATE : PermissionsUtils.ACTION_INSERT;
    let permissions: OPermissions = (this.actionsPermissions || []).find(p => p.attr === attr);
    if (Util.isDefined(permissions) && permissions.enabled === false) {
      return;
    }
    this._existsChangesToSave = val;
  }

  cancelOperation() {
    if (this.isDetail) {
      this.onCloseDetail();
    } else if (!this.isDetail && this.insertMode) {
      this.onCloseDetail();
    } else {
      this.onReload();
      this._form.setInitialMode();
    }
  }

  acceptOperation() {
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

  handleAcceptInsertOperation() {
    this._form.executeToolbarAction(OFormComponent.INSERT_ACTION);
  }

  handleAcceptEditOperation() {
    this._form.executeToolbarAction(OFormComponent.EDIT_ACTION);
  }

  showConfirmDelete(evt: any) {
    this._dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DELETE').then(res => {
      if (res === true) {
        this._form.executeToolbarAction(OFormComponent.DELETE_ACTION).subscribe(resp => {
          //TODO mostrar un toast indicando que la operación fue correcta...
          this.onCloseDetail();
        }, err => {
          console.log('OFormToolbar.delete error');
        });
      }
    }
    );
  }

  get showNavigation(): boolean {
    return this.showHeaderNavigation && !(this._form.getFormManager() && this._form.getFormManager().isTabMode());
  }

  getLabelHeaderAlign(): string {
    return this.labelHeaderAlign;
  }

  get showUndoButton(): boolean {
    return this._form.undoButton && (!this.initialMode || this._form.isEditableDetail());
  }

  get isChangesStackEmpty(): boolean {
    return this._form.isCacheStackEmpty;
  }

  onUndoLastChange() {
    this._form.executeToolbarAction(OFormComponent.UNDO_LAST_CHANGE_ACTION);
  }

  get isSaveBtnEnabled(): boolean {
    return this.saveBtnEnabled;
  }

  get isRefreshBtnEnabled(): boolean {
    return this.refreshBtnEnabled;
  }

  get isInsertBtnEnabled(): boolean {
    return this.insertBtnEnabled;
  }

  get isEditBtnEnabled(): boolean {
    return this.editBtnEnabled;
  }

  get isDeleteBtnEnabled(): boolean {
    return this.deleteBtnEnabled;
  }

  private checkEnabledPermission(attr) {
    const permissions: OPermissions = (this.actionsPermissions || []).find(p => p.attr === attr);
    let enabledPermision = PermissionsUtils.checkEnabledPermission(permissions);
    if (!enabledPermision) {
      this.snackBarService.open('MESSAGES.OPERATION_NOT_ALLOWED_PERMISSION');
    }
    return enabledPermision;
  }

  hasEnabledPermission(permission: OPermissions): boolean {
    return permission ? permission.enabled : true;
  }
}

@NgModule({
  declarations: [OFormNavigationComponent, OFormToolbarComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OFormNavigationComponent, OFormToolbarComponent]
})
export class OFormToolbarModule { }
