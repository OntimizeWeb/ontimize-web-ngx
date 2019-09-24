import { CommonModule } from '@angular/common';
import { Component, ElementRef, forwardRef, HostBinding, Inject, Injector, NgModule, Optional, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { InputConverter } from '../../decorators';
import { OSharedModule } from '../../shared';
import { Util } from '../../util/util';
import { OFormComponent } from '../form/o-form.component';
import { OFormValue } from '../form/OFormValue';
import { OFormControl } from '../input/o-form-control.class';
import { DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT, OFormDataComponent } from '../o-form-data-component.class';
import { OFullScreenDialogComponent } from './fullscreen/fullscreen-dialog.component';


export const DEFAULT_INPUTS_O_IMAGE = [
  ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT,
  'emptyimage: empty-image',
  // empty-icon [string]: material icon. Default: photo.
  'emptyicon: empty-icon',
  // show-controls [yes|no true|false]: Shows or hides selection controls. Default: true.
  'showControls: show-controls',
  // height [% | px]: Set the height of the image.
  'height',
  // auto-fit [yes|no true|false]: Adjusts the image to the content or not. Default: true.
  'autoFit: auto-fit',
  'fullScreenButton: full-screen-button',
  // accept-file-type [string]: file types allowed on the file input, separated by ';'. Default: image/*.
  // file_extension, image/*, media_type. See https://www.w3schools.com/tags/att_input_accept.asp
  'acceptFileType: accept-file-type'
];

export const DEFAULT_OUTPUTS_O_IMAGE = [
  ...DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT
];

@Component({
  moduleId: module.id,
  selector: 'o-image',
  templateUrl: './o-image.component.html',
  styleUrls: ['./o-image.component.scss'],
  inputs: DEFAULT_INPUTS_O_IMAGE,
  outputs: DEFAULT_OUTPUTS_O_IMAGE,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-image]': 'true'
  }
})
export class OImageComponent extends OFormDataComponent {

  public static DEFAULT_INPUTS_O_IMAGE = DEFAULT_INPUTS_O_IMAGE;
  public static DEFAULT_OUTPUTS_O_IMAGE = DEFAULT_OUTPUTS_O_IMAGE;

  public acceptFileType: string = 'image/*';
  public emptyimage: string;
  public emptyicon: string;
  public height: string;
  @InputConverter()
  public autoFit: boolean = true;
  public currentFileName: string = '';
  @InputConverter()
  protected showControls: boolean = true;
  set fullScreenButton(val: boolean) {
    val = Util.parseBoolean(String(val));
    this._fullScreenButton = val;
  }
  get fullScreenButton(): boolean {
    return this._fullScreenButton;
  }
  protected _fullScreenButton = false;

  @ViewChild('input')
  protected fileInput: ElementRef;
  protected _useEmptyIcon: boolean = true;
  protected _useEmptyImage: boolean = false;
  protected _domSanitizer: DomSanitizer;
  protected dialog: MatDialog;
  public stateCtrl: FormControl;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
    this._domSanitizer = this.injector.get(DomSanitizer);
    this._defaultSQLTypeKey = 'BASE64';
    this.dialog = this.injector.get(MatDialog);
    this.stateCtrl = new FormControl();
  }

  public ngOnInit(): void {
    super.ngOnInit();

    if (this.emptyimage && this.emptyimage.length > 0) {
      this._useEmptyIcon = false;
      this._useEmptyImage = true;
    }

    if (this.emptyicon === undefined && !this._useEmptyImage) {
      this.emptyicon = 'photo';
      this._useEmptyIcon = true;
      this._useEmptyImage = false;
    }
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public ensureOFormValue(val: any): void {
    if (val instanceof OFormValue) {
      if (val.value && val.value.bytes !== undefined) {
        this.value = new OFormValue(val.value.bytes);
        return;
      }
      this.value = new OFormValue(val.value);
    } else if (val && !(val instanceof OFormValue)) {
      if (val.bytes !== undefined) {
        val = val.bytes;
      } else if (val.length > 300 && val.substring(0, 4) === 'data') {
        // Removing "data:image/*;base64,"
        val = val.substring(val.indexOf('base64') + 7);
      }
      this.value = new OFormValue(val);
    } else {
      this.value = new OFormValue(undefined);
    }
  }

  public isEmpty(): boolean {
    return !this.getValue() || this.getValue().length === 0;
  }

  public createFormControl(): OFormControl {
    this._fControl = super.createFormControl();
    this._fControl.fControlChildren = [this.stateCtrl];
    return this._fControl;
  }

  public fileChange(input): void {
    if (input.files[0]) {
      const reader = new FileReader();
      const self = this;
      reader.addEventListener('load', event => {
        let result = event.target['result'];
        if (result && result.length > 300 && result.substring(0, 4) === 'data') {
          // Removing "data:image/*;base64,"
          result = result.substring(result.indexOf('base64') + 7);
        }
        self.setValue(result);
        if (self._fControl) {
          self._fControl.markAsTouched();
        }
        event.stopPropagation();
      }, false);
      if (input.files[0]) {
        reader.readAsDataURL(input.files[0]);
      }
      // if (this.titleLabel) {
      //   this.titleLabel.nativeElement.textContent = input.files[0].name;
      // }
      this.currentFileName = input.files[0].name;
      this.stateCtrl.setValue(this.currentFileName);
    }
  }

  public getSrcValue(): any {
    if (this.value && this.value.value) {
      if (this.value.value instanceof Object && this.value.value.bytes) {
        let src: string = '';
        if (this.value.value.bytes.substring(0, 4) === 'data') {
          src = 'data:image/*;base64,' + this.value.value.bytes.substring(this.value.value.bytes.indexOf('base64') + 7);
        } else {
          src = 'data:image/*;base64,' + this.value.value.bytes;
        }
        return this._domSanitizer.bypassSecurityTrustUrl(src);
      } else if (typeof this.value.value === 'string' &&
        this.value.value.length > 300) {
        let src: string = '';
        if (this.value.value.substring(0, 4) === 'data') {
          src = 'data:image/*;base64,' + this.value.value.substring(this.value.value.indexOf('base64') + 7);
        } else {
          src = 'data:image/*;base64,' + this.value.value;
        }
        return this._domSanitizer.bypassSecurityTrustUrl(src);
      }
      return this.value.value ? this.value.value : this.emptyimage;
    } else if (this.emptyimage) {
      return this.emptyimage;
    }
  }

  public onClickBlocker(evt: Event): void {
    evt.stopPropagation();
  }

  public onClickClearValue(e: Event): void {
    if (!this.isReadOnly && this.enabled) {
      super.onClickClearValue(e);
      this.fileInput.nativeElement.value = '';
      // if (this.titleLabel) {
      //   this.titleLabel.nativeElement.textContent = '';
      // }
      this.stateCtrl.reset();
      this.currentFileName = '';
    }
    if (this._fControl) {
      this._fControl.markAsTouched();
    }
  }

  public hasControls(): boolean {
    return this.showControls;
  }

  public useEmptyIcon(): boolean {
    return this._useEmptyIcon && this.isEmpty();
  }

  public useEmptyImage(): boolean {
    return this._useEmptyImage && this.isEmpty();
  }

  public getFormGroup(): FormGroup {
    let formGroup: FormGroup = super.getFormGroup();
    if (!formGroup) {
      formGroup = new FormGroup({});
      formGroup.addControl(this.getAttribute(), this.getControl());
    }
    return formGroup;
  }

  @HostBinding('style.height')
  get hostHeight(): string {
    return this.height;
  }

  public openFullScreen(e?: Event): void {
    this.dialog.open(OFullScreenDialogComponent, {
      width: '90%',
      height: '90%',
      role: 'dialog',
      disableClose: false,
      panelClass: 'o-image-fullscreen-dialog-cdk-overlay',
      data: this.getSrcValue()
    });
  }

  public openFileSelector(e?: Event): void {
    if (Util.isDefined(this.fileInput)) {
      this.fileInput.nativeElement.click();
    }
  }

  public internalFormControl(): string {
    return this.getAttribute() + '_value';
  }

}

@NgModule({
  declarations: [OImageComponent, OFullScreenDialogComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OImageComponent, OFullScreenDialogComponent],
  entryComponents: [OFullScreenDialogComponent]
})
export class OImageModule { }
