import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  Injector,
  forwardRef,
  ElementRef,
  NgZone,
  NgModule,
  ViewEncapsulation
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';

import { OFormComponent } from './o-form.component';
import { InputConverter } from '../../decorators';
import { Util } from '../../util/util';
import { DialogService, NavigationService } from '../../services';
import { OSharedModule } from '../../shared';

export const DEFAULT_INPUTS_O_FORM_TOOLBAR = [
  'labelHeader: label-header',
  'labelHeaderAlign: label-header-align',
  'headeractions: header-actions',
  'showHeaderActionsText: show-header-actions-text'
];

@Component({
  selector: 'o-form-toolbar',
  templateUrl: './o-form-toolbar.component.html',
  styleUrls: ['./o-form-toolbar.component.scss'],
  inputs: [
    ...DEFAULT_INPUTS_O_FORM_TOOLBAR
  ],
  encapsulation: ViewEncapsulation.None
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

  protected refreshBtnEnabled: boolean = false;
  protected insertBtnEnabled: boolean = false;
  protected editBtnEnabled: boolean = false;
  protected deleteBtnEnabled: boolean = false;
  protected navigationEnabled: boolean = false;
  protected saveBtnEnabled: boolean = false;

  protected _existsChangesToSave: boolean = false;

  protected _dialogService: DialogService;
  protected _navigationService: NavigationService;

  protected formCacheSubscription: Subscription;

  constructor( @Inject(forwardRef(() => OFormComponent)) private _form: OFormComponent,
    public element: ElementRef,
    private _router: Router,
    private _actRoute: ActivatedRoute,
    private zone: NgZone,
    protected injector: Injector) {
    _form.registerToolbar(this);
    this._dialogService = this.injector.get(DialogService);
    this._navigationService = this.injector.get(NavigationService);
  }

  ngOnInit() {
    this.formActions = Util.parseArray(this.headeractions);
    if (this.formActions && this.formActions.length > 0) {
      this.refreshBtnEnabled = this.formActions.indexOf('R') !== -1;
      this.insertBtnEnabled = this.formActions.indexOf('I') !== -1;
      this.editBtnEnabled = this.formActions.indexOf('U') !== -1;
      this.deleteBtnEnabled = this.formActions.indexOf('D') !== -1;
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
  }

  protected manageEditableDetail() {
    let isEditableDetail = this._form.isEditableDetail();
    this.saveBtnEnabled = isEditableDetail;

    this.refreshBtnEnabled = this.refreshBtnEnabled && isEditableDetail;
    this.insertBtnEnabled = this.insertBtnEnabled && isEditableDetail;
    this.editBtnEnabled = this.editBtnEnabled && !isEditableDetail;
    this.deleteBtnEnabled = this.deleteBtnEnabled && !isEditableDetail;

    let self = this;
    this.formCacheSubscription = this._form.formGroup.valueChanges.subscribe((value: any) => {
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
    let self = this;
    this._form.confirmToolbarAction().then(val => {
      if (val) {
        self._form.executeToolbarAction(OFormComponent.CLOSE_DETAIL_ACTION);
      }
    });
  }

  onBack() {
    let self = this;
    this._form.confirmToolbarAction().then(val => {
      if (val) {
        self._form.executeToolbarAction(OFormComponent.BACK_ACTION);
      }
    });
  }

  onReload() {
    let self = this;
    this._form.confirmToolbarAction().then(val => {
      if (val) {
        self._form.executeToolbarAction(OFormComponent.RELOAD_ACTION);
      }
    });
  }

  onInsert() {
    let self = this;
    this._form.confirmToolbarAction().then(val => {
      if (val) {
        self.setInsertMode();
        self._form.executeToolbarAction(OFormComponent.GO_INSERT_ACTION);
      }
    });
  }

  onEdit() {
    this.setEditMode();
    this._form.executeToolbarAction(OFormComponent.GO_EDIT_ACTION);
  }

  onDelete(evt: any) {
    this.showConfirmDelete(evt);
  }

  onSave(evt: any) {
    this.handleAcceptEditOperation();
  }

  get existsChangesToSave(): boolean {
    return this._existsChangesToSave;
  }

  set existsChangesToSave(val: boolean) {
    this._existsChangesToSave = val;
  }

  cancelOperation() {
    if (this.isDetail) {
      this.onCloseDetail();
    } else if (!this.isDetail && this.insertMode) {
      this.onCloseDetail();
    } else {
      this.onReload();
    }
    this.setInitialMode();
  }

  acceptOperation() {
    if (this.editMode) {
      this.handleAcceptEditOperation();
    } else if (this.insertMode) {
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
          alert('Se ha producido un error!');
        });
      }
    }
    );
  }

  next() {
    //TODO
    // let total = this._form.navigationData.length;
    // let index = this._form.currentIndex + 1;
    // if (total > index) {
    //   this._form.move(index);
    // } else {
    //   console.log('form-toolbar->next(): total > index');
    // }
  }

  previous() {
    //TODO
    // let index = this._form.currentIndex - 1;
    // if (index >= 0) {
    //   this._form.move(index);
    // } else {
    //   console.log('form-toolbar->next(): index < 0');
    // }
  }

  first() {
    //TODO
    // this._form.move(0);
  }

  last() {
    //TODO
    // let index = this._form.navigationData.length - 1;
    // this._form.move(index);
  }

  numberOfRecords() {
    if (this.navigationEnabled) {
      let total = this._form.navigationData.length;
      let index = this._form.currentIndex + 1;
      if (total === 0 || total === 1) {
        return '';
      }
      return index + ' / ' + total;
    }
    return '';
  }

  get showNavigation(): boolean {
    if (this.navigationEnabled) {
      return this._form.navigationData.length >= 1;
    }
    return false;
  }

  getLabelHeaderAlign(): string {
    return this.labelHeaderAlign;
  }
}

@NgModule({
  declarations: [OFormToolbarComponent],
  imports: [OSharedModule, CommonModule],
  exports: [OFormToolbarComponent]
})
export class OFormToolbarModule {
}
