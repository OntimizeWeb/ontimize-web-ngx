import { Component, ElementRef, forwardRef, HostBinding, Inject, Injector, OnDestroy, OnInit, Optional, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { InputConverter } from '../../decorators/input-converter';
import { OSafePipe } from '../../pipes/o-safe.pipe';
import { FormValueOptions } from '../../types';
import { Util } from '../../util/util';
import { OFormValue } from '../form/o-form-value';
import { OFormComponent } from '../form/o-form.component';
import { OFormControl } from '../input/o-form-control.class';
import { DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT, OFormDataComponent } from '../o-form-data-component.class';
import { OFullScreenDialogComponent } from './fullscreen/fullscreen-dialog.component';


export const DEFAULT_INPUTS_O_IMAGE = [
  ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT,
  'emptyimage: empty-image',
  // not-found-image [string]: Default image for 404 error.
  'notfoundimage: not-found-image',
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
  'acceptFileType: accept-file-type',
  // max-file-size [number]: maximum file size allowed, in bytes. Default: no value.
  'maxFileSize: max-file-size'
];

export const DEFAULT_OUTPUTS_O_IMAGE = [
  ...DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT
];

@Component({
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
export class OImageComponent extends OFormDataComponent implements OnInit, OnDestroy {

  public acceptFileType: string = 'image/*';
  @InputConverter()
  public maxFileSize: number;
  public emptyimage: string;
  public notfoundimage: string;
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

  @ViewChild('input', { static: false })
  protected fileInput: ElementRef;
  protected _useEmptyIcon: boolean = true;
  protected _useEmptyImage: boolean = false;
  protected oSafe: OSafePipe;
  protected dialog: MatDialog;
  public stateCtrl: FormControl;
  public src = '';

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
    this.oSafe = new OSafePipe(injector);
    this._defaultSQLTypeKey = 'BASE64';
    this.dialog = this.injector.get(MatDialog);
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
      if (val.value && val.value.bytes) {
        val = val.value.bytes;
      } else {
        val = val.value;
      }
    } else if (val) {
      if (val.bytes) {
        val = val.bytes;
      } else if (Util.isBase64(val) && val.substring(0, 4) === 'data') {
        // Removing "data:image/*;base64,"
        val = val.substring(val.indexOf('base64') + 7);
      }
    } else {
      val = undefined;
    }
    this.value = new OFormValue(val);

    this.src = this.getSrcValue();
  }

  public isEmpty(): boolean {
    return !this.getValue() || this.getValue().length === 0;
  }

  public createFormControl(cfg?: { value: any, disabled: boolean }, validators?: ValidatorFn[]): OFormControl {
    this._fControl = super.createFormControl(cfg, validators);
    this.stateCtrl = new FormControl(void 0, this.resolveValidators());
    this._fControl.fControlChildren = [this.stateCtrl];
    return this._fControl;
  }

  public fileChange(input): void {
    if (input.files[0]) {
      const reader = new FileReader();
      reader.addEventListener('load', event => {
        let result = event.target['result'];
        if (result && typeof (result) === 'string' && Util.isBase64(result)) {
          // Removing "data:image/*;base64,"
          result = result.substring(result.indexOf('base64') + 7);
        }
        this.setValue(result);
        if (this._fControl) {
          this._fControl.markAsTouched();
        }
        event.stopPropagation();
      }, false);
      if (input.files[0]) {
        reader.readAsDataURL(input.files[0]);
      }

      this.currentFileName = input.files[0].name;
      this.stateCtrl.setValue(this.currentFileName);
    }
  }

  public notFoundImageUrl(event): any {
    event.target.src = Util.isDefined(this.notfoundimage) ? this.notfoundimage : '';
  }

  private getSrcValue(): any {

    if (this.value && this.value.value) {
      if (this.value.value instanceof Object && this.value.value.bytes) {
        let src: string = '';
        if (this.value.value.bytes.substring(0, 4) === 'data') {
          src = 'data:image/*;base64,' + this.value.value.bytes.substring(this.value.value.bytes.indexOf('base64') + 7);
        } else {
          src = 'data:image/*;base64,' + this.value.value.bytes;
        }
        return this.oSafe.transform(src, 'url');
      } else if (typeof this.value.value === 'string' && Util.isBase64(this.value.value)) {
        let src: string = '';
        if (this.value.value.substring(0, 4) === 'data') {
          src = 'data:image/*;base64,' + this.value.value.substring(this.value.value.indexOf('base64') + 7);
        } else {
          src = 'data:image/*;base64,' + this.value.value;
        }
        return this.oSafe.transform(src, 'url');
      }
      if (this.value.value) {
        return this.value.value;
      } else {
        return this.emptyimage;
      }
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

  public resolveValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = super.resolveValidators();
    if (Util.isDefined(this.maxFileSize)) {
      validators.push(this.maxFileSizeValidator.bind(this));
    }
    return validators;
  }

  public setValue(val: any, options: FormValueOptions = {}, setDirty: boolean = false): void {
    super.setValue(val, options, setDirty);
    if (!Util.isDefined(this.getValue()) || !this.currentFileName) {
      this.stateCtrl.reset();
    }
  }

  protected maxFileSizeValidator(control: FormControl): ValidationErrors {
    if (control.value && control.value.length > 0 && Util.isDefined(this.maxFileSize)) {
      if (!Util.isDefined(this.fileInput.nativeElement.files)) {
        return {};
      }
      if (this.fileInput.nativeElement.files && !Array.from<File>(this.fileInput.nativeElement.files).every(file => file.size < this.maxFileSize)) {
        return {
          fileSize: {
            maxFileSize: this.maxFileSize
          }
        };
      }
    }
    return {};
  }

  onFileChange(pFileList: File[]) {
    const files = Object.keys(pFileList).map(key => pFileList[key]);
    const fileList = this.createFileListItems(files)

    this.fileInput.nativeElement.files = fileList;
    this.fileChange(this.fileInput.nativeElement);
  }

  createFileListItems(files) {
    const b = new ClipboardEvent("").clipboardData || new DataTransfer()
    for (let i = 0, len = files.length; i < len; i++) b.items.add(files[i])
    return b.files
  }

  getFileName(): string {
    return this.currentFileName;
  }

  getImageFile(): File {
    if (this.fileInput && this.fileInput.nativeElement.files.length > 0) {
      return this.fileInput.nativeElement.files[0];
    } else {
      return void (0);
    }
  }

  hasErrorInDragAndDrop() {
    return this.getFormControl() && this.getFormControl().touched && !this.hasControls() && this.enabled && !this.isReadOnly;

  }

}
