import {
  Component, OnInit, Inject, Injector,
  forwardRef, ElementRef, NgZone,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { MdIconModule, MdToolbarModule } from '@angular/material';

import { OFormComponent } from './o-form.component';
import { InputConverter } from '../../decorators';
import { Util } from '../../util/util';
import { DialogService, NavigationService } from '../../services';
import { OTranslateModule } from '../../pipes/o-translate.pipe';

export const DEFAULT_INPUTS_O_FORM_TOOLBAR = [
  'labelHeader: label-header',
  'labelHeaderAlign: label-header-align',
  'headeractions: header-actions',
  'showHeaderActionsText: show-header-actions-text'
];

@Component({
  selector: 'o-form-toolbar',
  templateUrl: '/form/o-form-toolbar.component.html',
  styleUrls: ['/form/o-form-toolbar.component.css'],
  inputs: [
    ...DEFAULT_INPUTS_O_FORM_TOOLBAR
  ],
  encapsulation: ViewEncapsulation.None
})

export class OFormToolbarComponent implements OnInit {

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


  protected _dialogService: DialogService;
  protected _navigationService: NavigationService;

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

  public setInitialMode() {
    this.initialMode = true;
    this.insertMode = false;
    this.editMode = false;
  }

  public setInsertMode() {
    this.insertMode = true;
    this.editMode = false;
    this.initialMode = false;
  }

  public setEditMode() {
    this.editMode = true;
    this.insertMode = false;
    this.initialMode = false;
  }

  onCloseDetail() {
    console.log('close detail form');
    this._form.executeToolbarAction(OFormComponent.CLOSE_DETAIL_ACTION);
  }

  onBack() {
    console.log('go back');
    this._form.executeToolbarAction(OFormComponent.BACK_ACTION);
  }

  onReload() {
    console.log('reload form');
    this._form.executeToolbarAction(OFormComponent.RELOAD_ACTION);
  }

  onInsert() {
    console.log('go insert mode');
    this.setInsertMode();
    this._form.executeToolbarAction(OFormComponent.GO_INSERT_ACTION);
  }

  onEdit() {
    console.log('go edit mode');
    this.setEditMode();
    this._form.executeToolbarAction(OFormComponent.GO_EDIT_ACTION);
  }

  onDelete(evt: any) {
    console.log('delete register');
    this.showConfirmDelete(evt);
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
    this._dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DELETE')
      .then(
      res => {
        if (res === true) {
          this._form.executeToolbarAction(OFormComponent.DELETE_ACTION)
            .subscribe(resp => {
              //TODO mostrar un toast indicando que la operación fue correcta...
              this.onCloseDetail();
            }, err => {
              console.log('error');
              alert('Se ha producido un error!');
            });
        }
      }
      );
  }

  next() {
    let total = this._form.navigationData.length;
    let index = this._form.currentIndex + 1;
    if (total > index) {
      this._form.move(index);
    } else {
      console.log('form-toolbar->next(): total > index');
    }
  }

  previous() {
    let index = this._form.currentIndex - 1;
    if (index >= 0) {
      this._form.move(index);
    } else {
      console.log('form-toolbar->next(): index < 0');
    }
  }

  first() {
    this._form.move(0);
  }

  last() {
    let index = this._form.navigationData.length - 1;
    this._form.move(index);
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

  showNavigation() {
    //navigationEnabled
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
  imports: [CommonModule, MdIconModule, MdToolbarModule, OTranslateModule],
  exports: [OFormToolbarComponent],
})
export class OFormToolbarModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OFormToolbarModule,
      providers: []
    };
  }
}
