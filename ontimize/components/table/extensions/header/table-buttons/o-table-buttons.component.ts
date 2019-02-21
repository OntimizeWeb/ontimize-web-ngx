import { Component, Inject, forwardRef, Injector, ViewEncapsulation, ViewChild, OnDestroy, ChangeDetectionStrategy, OnInit, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { PermissionsUtils } from '../../../../../util/permissions';
import { OPermissions } from '../../../../../services';
import { InputConverter } from '../../../../../decorators';
import { OTableComponent } from '../../../o-table.component';
import { OTableButtonComponent } from '../table-button/o-table-button.component';

export const DEFAULT_INPUTS_O_TABLE_BUTTONS = [
  // insert-button [no|yes]: show insert button. Default: yes.
  'insertButton: insert-button',
  // refresh-button [no|yes]: show refresh button. Default: yes.
  'refreshButton: refresh-button',
  // delete-button [no|yes]: show delete button. Default: yes.
  'deleteButton: delete-button'
];

export const DEFAULT_OUTPUTS_O_TABLE_BUTTONS = [];

@Component({
  moduleId: module.id,
  selector: 'o-table-buttons',
  templateUrl: './o-table-buttons.component.html',
  styleUrls: ['./o-table-buttons.component.scss'],
  inputs: DEFAULT_INPUTS_O_TABLE_BUTTONS,
  outputs: DEFAULT_OUTPUTS_O_TABLE_BUTTONS,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.o-table-buttons]': 'true',
  }
})

export class OTableButtonsComponent implements OnInit, AfterViewInit, OnDestroy {
  public static DEFAULT_INPUTS_O_TABLE_BUTTONS = DEFAULT_INPUTS_O_TABLE_BUTTONS;
  public static DEFAULT_OUTPUTS_O_TABLE_BUTTONS = DEFAULT_OUTPUTS_O_TABLE_BUTTONS;

  /* Inputs */
  @InputConverter()
  insertButton: boolean = true;
  @InputConverter()
  refreshButton: boolean = true;
  @InputConverter()
  deleteButton: boolean = true;
  /* End of inputs */

  @ViewChild('insertOButton')
  insertOButton: OTableButtonComponent;
  @ViewChild('refreshOButton')
  refreshOButton: OTableButtonComponent;
  @ViewChild('deleteOButton')
  deleteOButton: OTableButtonComponent;

  protected permissions: OPermissions[];
  protected mutationObservers: MutationObserver[] = [];

  constructor(
    protected injector: Injector,
    protected cd: ChangeDetectorRef,
    @Inject(forwardRef(() => OTableComponent)) protected table: OTableComponent
  ) {

  }

  ngOnInit(): void {
    this.permissions = this.table.getActionsPermissions();
  }

  ngAfterViewInit(): void {
    if (this.permissions.length === 0) {
      return;
    }
    if (this.insertOButton && !this.enabledInsertOButton) {
      this.disableOTableOptionComponent(this.insertOButton);
    }
    if (this.refreshOButton && !this.enabledRefreshOButton) {
      this.disableOTableOptionComponent(this.refreshOButton);
    }
    if (this.deleteOButton && !this.enabledDeleteOButton) {
      this.disableOTableOptionComponent(this.deleteOButton);
    }
    this.cd.detectChanges();
  }

  protected disableOTableOptionComponent(comp: OTableButtonComponent) {
    comp.enabled = false;
    const buttonEL = comp.elRef.nativeElement.querySelector('button');
    const obs = PermissionsUtils.registerDisabledChangesInDom(buttonEL);
    this.mutationObservers.push(obs);
  }

  protected disableButton(buttonEL: ElementRef) {
    buttonEL.nativeElement.disabled = true;
    const obs = PermissionsUtils.registerDisabledChangesInDom(buttonEL.nativeElement);
    this.mutationObservers.push(obs);
  }

  ngOnDestroy() {
    if (this.mutationObservers) {
      this.mutationObservers.forEach((m: MutationObserver) => {
        m.disconnect();
      });
    }
  }

  add() {
    this.table.add();
  }

  reloadData() {
    this.table.reloadData();
  }

  remove() {
    this.table.remove();
  }

  protected setPermissionsToOTableButton(perm: OPermissions, button: OTableButtonComponent) {
    if (perm.visible === false && button) {
      button.elRef.nativeElement.remove();
    } else if (perm.enabled === false && button) {
      button.enabled = false;
      const buttonEL = button.elRef.nativeElement.querySelector('button');
      const obs = PermissionsUtils.registerDisabledChangesInDom(buttonEL);
      this.mutationObservers.push(obs);
    }
  }

  get showInsertOButton(): boolean {
    if (!this.insertButton) {
      return false;
    }
    const perm: OPermissions = this.getPermissionByAttr('insert');
    return !(perm && perm.visible === false);
  }

  get showRefreshOButton(): boolean {
    if (!this.refreshButton) {
      return false;
    }
    const perm: OPermissions = this.getPermissionByAttr('refresh');
    return !(perm && perm.visible === false);
  }

  get showDeleteOButton(): boolean {
    if (!this.deleteButton) {
      return false;
    }
    const perm: OPermissions = this.getPermissionByAttr('delete');
    return !(perm && perm.visible === false);
  }

  getPermissionByAttr(attr: string) {
    return this.permissions.find((perm: OPermissions) => perm.attr === attr);
  }

  get enabledInsertOButton(): boolean {
    const perm: OPermissions = this.getPermissionByAttr('insert');
    return !(perm && perm.enabled === false);
  }

  get enabledRefreshOButton(): boolean {
    const perm: OPermissions = this.getPermissionByAttr('refresh');
    return !(perm && perm.enabled === false);
  }

  get enabledDeleteOButton(): boolean {
    const perm: OPermissions = this.getPermissionByAttr('delete');
    return !(perm && perm.enabled === false);
  }

  registerButtons(oTableButtons: OTableButtonComponent[]) {
    const fixedButtons = ['insert', 'refresh', 'delete'];
    const userItems: OPermissions[] = this.permissions.filter((perm: OPermissions) => fixedButtons.indexOf(perm.attr) === -1);
    const self = this;
    userItems.forEach((perm: OPermissions) => {
      const button = oTableButtons.find((oTableButton: OTableButtonComponent) => oTableButton.oattr === perm.attr);
      self.setPermissionsToOTableButton(perm, button);
    });
  }

}
