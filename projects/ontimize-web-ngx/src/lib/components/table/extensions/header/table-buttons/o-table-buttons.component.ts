import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { InputConverter } from '../../../../../decorators/input-converter';
import { OTableButtons } from '../../../../../interfaces/o-table-buttons.interface';
import { OPermissions } from '../../../../../types/o-permissions.type';
import { PermissionsUtils } from '../../../../../util/permissions';
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
export class OTableButtonsComponent implements OTableButtons, OnInit, OnDestroy {

  /* Inputs */
  @InputConverter()
  public insertButton: boolean = true;
  @InputConverter()
  public refreshButton: boolean = true;
  @InputConverter()
  public deleteButton: boolean = true;
  /* End of inputs */

  public enabledInsertButton: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public enabledRefreshButton: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public enabledDeleteButton: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  protected permissions: OPermissions[];
  protected mutationObservers: MutationObserver[] = [];
  protected subscription: Subscription;

  constructor(
    protected injector: Injector,
    @Inject(forwardRef(() => OTableComponent)) protected table: OTableComponent
  ) {
    this.permissions = this.table.getActionsPermissions();
  }

  public ngOnInit(): void {
    const insertPerm: OPermissions = this.getPermissionByAttr('insert');
    const refreshPerm: OPermissions = this.getPermissionByAttr('refresh');
    const deletePerm: OPermissions = this.getPermissionByAttr('delete');

    if (this.insertButton && (insertPerm && insertPerm.enabled === false)) {
      this.enabledInsertButton.next(false);
    }
    if (this.refreshButton && (refreshPerm && refreshPerm.enabled === false)) {
      this.enabledRefreshButton.next(false);
    }
    this.subscription = this.table.selection.changed.subscribe(() =>
      deletePerm ? this.enabledDeleteButton.next(deletePerm.enabled && !this.table.selection.isEmpty()) : this.enabledDeleteButton.next(!this.table.selection.isEmpty())
    );
    this.table.registerOTableButtons(this);
  }

  public ngOnDestroy(): void {
    if (this.mutationObservers) {
      this.mutationObservers.forEach((m: MutationObserver) => {
        m.disconnect();
      });
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public add(): void {
    this.table.add();
  }

  public reloadData(): void {
    this.table.reloadData();
  }

  public remove(): void {
    this.table.remove();
  }

  public getPermissionByAttr(attr: string): OPermissions {
    return this.permissions.find((perm: OPermissions) => perm.attr === attr);
  }

  public registerButtons(oTableButtons: OTableButtonComponent[]): void {
    const fixedButtons = ['insert', 'refresh', 'delete'];
    const userItems: OPermissions[] = this.permissions.filter((perm: OPermissions) => fixedButtons.indexOf(perm.attr) === -1);
    const self = this;
    userItems.forEach((perm: OPermissions) => {
      const button = oTableButtons.find((oTableButton: OTableButtonComponent) => oTableButton.oattr === perm.attr);
      self.setPermissionsToOTableButton(perm, button);
    });
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

  protected setPermissionsToOTableButton(perm: OPermissions, button: OTableButtonComponent): void {
    if (perm.visible === false && button) {
      button.elRef.nativeElement.remove();
    } else if (perm.enabled === false && button) {
      button.enabled = false;
      const buttonEL = button.elRef.nativeElement.querySelector('button');
      const obs = PermissionsUtils.registerDisabledChangesInDom(buttonEL);
      this.mutationObservers.push(obs);
    }
  }

}
