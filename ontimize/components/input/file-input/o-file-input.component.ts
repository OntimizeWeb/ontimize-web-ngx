import { Component, ElementRef, EventEmitter, forwardRef, Inject, Injector, NgModule, OnInit, Optional, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidationErrors, ValidatorFn } from '@angular/forms';

import { OSharedModule } from '../../../shared';
import { InputConverter } from '../../../decorators';
import { OntimizeFileService } from '../../../services';
import { OFormComponent } from '../../form/o-form.component';
import { OFormDataComponent, OValueChangeEvent, DEFAULT_INPUTS_O_FORM_DATA_COMPONENT } from '../../o-form-data-component.class';

import { OFileItem } from './o-file-item.class';
import { OFileUploader } from './o-file-uploader.class';

export const DEFAULT_INPUTS_O_FILE_INPUT = [
  'oattr: attr',
  'olabel: label',
  'floatLabel: float-label',
  'oplaceholder: placeholder',
  'tooltip',
  'tooltipPosition: tooltip-position',
  'tooltipShowDelay: tooltip-show-delay',
  'tooltipHideDelay: tooltip-hide-delay',
  'oenabled: enabled',
  'orequired: required',
  'service',
  'entity',
  'serviceType : service-type',
  'width',
  'readOnly: read-only',
  'clearButton: clear-button',

  // accept-file-type [string]: file types allowed on the file input, separated by ';'. Default: no value.
  // file_extension, audio/*, video/*, image/*, media_type. See https://www.w3schools.com/tags/att_input_accept.asp
  'acceptFileType: accept-file-type',

  // max-file-size [number]: maximum file size allowed, in bytes. Default: no value.
  'maxFileSize: max-file-size',

  // multiple [boolean]: multiple file selection allowed. Default: no.
  'multiple',

  // max-files [number]: maximum number of files allowed. Default: -1.
  'maxFiles: max-files',

  // show-info [boolean]: show files information. Default: no.
  'showInfo: show-info',

  // split-upload [boolean]: each file is uploaded in a request (true) or all files are uploaded in a single request (false). Default: yes.
  'splitUpload: split-upload',

  // additional-data [JSON]: used to send aditional information in the upload request.
  'additionalData: additional-data',
  'appearance'
];

export const DEFAULT_OUTPUTS_O_FILE_INPUT = [
  ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT,
  'onBeforeUpload',
  'onBeforeUploadFile',
  'onProgress',
  'onProgressFile',
  'onCancel',
  'onCancelFile',
  'onUpload',
  'onUploadFile',
  'onComplete',
  'onCompleteFile',
  'onError',
  'onErrorFile'
];

@Component({
  moduleId: module.id,
  selector: 'o-file-input',
  templateUrl: './o-file-input.component.html',
  styleUrls: ['./o-file-input.component.scss'],
  inputs: DEFAULT_INPUTS_O_FILE_INPUT,
  outputs: DEFAULT_OUTPUTS_O_FILE_INPUT
})
export class OFileInputComponent extends OFormDataComponent implements OnInit {

  public static DEFAULT_INPUTS_O_FILE_INPUT = DEFAULT_INPUTS_O_FILE_INPUT;
  public static DEFAULT_OUTPUTS_O_FILE_INPUT = DEFAULT_OUTPUTS_O_FILE_INPUT;

  /* Inputs */
  public acceptFileType: string;
  public maxFileSize: number;
  protected service: string;
  protected entity: string;
  protected serviceType: string;
  autoBinding: boolean = false;
  autoRegistering: boolean = false;
  @InputConverter()
  showInfo: boolean = false;
  @InputConverter()
  multiple: boolean = false;
  @InputConverter()
  protected maxFiles: number = -1;
  @InputConverter()
  splitUpload: boolean = true;

  /* Outputs */
  onBeforeUpload: EventEmitter<any> = new EventEmitter<any>();
  onBeforeUploadFile: EventEmitter<any> = new EventEmitter<any>();
  onProgress: EventEmitter<any> = new EventEmitter<any>();
  onProgressFile: EventEmitter<any> = new EventEmitter<any>();
  onCancel: EventEmitter<any> = new EventEmitter<any>();
  onCancelFile: EventEmitter<any> = new EventEmitter<any>();
  onUpload: EventEmitter<any> = new EventEmitter<any>();
  onUploadFile: EventEmitter<any> = new EventEmitter<any>();
  onComplete: EventEmitter<any> = new EventEmitter<any>();
  onCompleteFile: EventEmitter<any> = new EventEmitter<any>();
  onError: EventEmitter<any> = new EventEmitter<any>();
  onErrorFile: EventEmitter<any> = new EventEmitter<any>();

  /* Internal variables */
  uploader: OFileUploader;
  fileService: OntimizeFileService;

  @ViewChild('inputFile')
  inputFile: ElementRef;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector,
  ) {
    super(form, elRef, injector);
  }

  ngOnInit() {
    this.initialize();

    this.uploader.onBeforeUploadAll = () => this.onBeforeUpload.emit();
    this.uploader.onBeforeUploadItem = (item) => this.onBeforeUploadFile.emit(item);
    this.uploader.onProgressAll = (progress) => this.onProgress.emit(progress);
    this.uploader.onProgressItem = (item, progress) => this.onProgressFile.emit({ item, progress });
    this.uploader.onCancelAll = () => this.onCancel.emit();
    this.uploader.onCancelItem = (item) => this.onCancelFile.emit();
    this.uploader.onSuccessAll = (response) => this.onUpload.emit({ response });
    this.uploader.onSuccessItem = (item, response) => this.onUploadFile.emit({ item, response });
    this.uploader.onCompleteAll = () => this.onComplete.emit();
    this.uploader.onCompleteItem = (item) => this.onCompleteFile.emit(item);
    this.uploader.onErrorAll = (error) => this.onError.emit(error);
    this.uploader.onErrorItem = (item, error) => this.onErrorFile.emit({ item, error });
  }

  initialize() {
    super.initialize();

    if (!this.service) {
      this.service = this.form.service;
    }
    if (!this.entity) {
      this.entity = this.form.entity;
    }

    this.configureService();
    this.uploader = new OFileUploader(this.fileService, this.entity);
    this.uploader.splitUpload = this.splitUpload;
  }

  configureService() {
    let loadingService: any = OntimizeFileService;
    if (this.serviceType) {
      loadingService = this.serviceType;
    }
    try {
      this.fileService = this.injector.get(loadingService);

      if (this.fileService) {
        let serviceCfg = this.fileService.getDefaultServiceConfiguration(this.service);
        if (this.entity) {
          serviceCfg['entity'] = this.entity;
        }
        this.fileService.configureService(serviceCfg);
      }
    } catch (e) {
      console.error(e);
    }
  }

  resolveValidators(): ValidatorFn[] {
    let validators: ValidatorFn[] = super.resolveValidators();
    if (this.acceptFileType) {
      validators.push(this.filetypeValidator.bind(this));
    }
    if (this.maxFileSize) {
      validators.push(this.maxFileSizeValidator.bind(this));
    }
    if (this.multiple && this.maxFiles !== -1) {
      validators.push(this.maxFilesValidator.bind(this));
    }
    return validators;
  }

  innerOnChange(event: any) {
    this.ensureOFormValue(event);
    if (this._fControl && this._fControl.touched) {
      this._fControl.markAsDirty();
    }
    this.onChange.emit(event);
  }

  fileSelected(event: Event): void {
    let value: string = '';
    if (event) {
      let files: FileList = event.target['files'];
      if (!this.multiple) {
        this.uploader.clear();
      }
      for (var i = 0, f: File; f = files[i]; i++) {
        let fileItem: OFileItem = new OFileItem(f, this.uploader);
        this.uploader.addFile(fileItem);
      }
      value = this.uploader.files.map(file => file.name).join(', ');
    }
    window.setTimeout(() => {
      this.setValue(value !== '' ? value : undefined, { changeType: OValueChangeEvent.USER_CHANGE });
      this.inputFile.nativeElement.value = '';
      if (this._fControl) {
        this._fControl.markAsTouched();
      }
    }, 0);
  }

  /**
   * Override super.onClickClearValue();
   * super.clearValue() vs super.onClickClearValue()
   *  * super.clearValue() emit OValueChangeEvent.PROGRAMMATIC_CHANGE
   *  * super.onClickClearValue() emit OValueChangeEvent.USER_CHANGE
   */
  onClickClearValue(e: Event) {
    super.onClickClearValue(e);
    this.uploader.clear();
  }

  /**
   * Override super.clearValue();
   */
  clearValue(): void {
    super.clearValue();
    this.uploader.clear();
  }

  onClickUpload(e: Event) {
    e.stopPropagation();
    if (this.isValid) {
      this.upload();
    }
  }

  upload() {
    this.uploader.upload();
  }

  get files() {
    return this.uploader.files;
  }

  get additionalData(): any {
    if (this.uploader) {
      return this.uploader.data;
    }
    return null;
  }

  set additionalData(data: any) {
    if (this.uploader) {
      this.uploader.data = data;
    }
  }

  protected filetypeValidator(control: FormControl): ValidationErrors {
    if (control.value && control.value.length > 0 && this.acceptFileType) {
      let regex: RegExp = new RegExp(this.acceptFileType.replace(';', '|'));
      if (!this.files.every(file => file.type.match(regex) !== null || file.name.substr(file.name.lastIndexOf('.')).match(regex) !== null)) {
        return {
          'fileType': {
            'allowedFileTypes': this.acceptFileType.replace(';', ', ')
          }
        };
      }
    }
    return {};
  }

  protected maxFileSizeValidator(control: FormControl): ValidationErrors {
    if (control.value && control.value.length > 0 && this.maxFileSize) {
      if (!this.files.every(file => file.size < this.maxFileSize)) {
        return {
          'fileSize': {
            'maxFileSize': this.maxFileSize
          }
        };
      }
    }
    return {};
  }

  protected maxFilesValidator(control: FormControl): ValidationErrors {
    if (control.value && control.value.length > 0 && this.multiple && this.maxFiles !== -1) {
      if (this.maxFiles < this.files.length) {
        return {
          'numFile': {
            'maxFiles': this.maxFiles
          }
        };
      }
    }
    return {};
  }

}

@NgModule({
  declarations: [OFileInputComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OFileInputComponent]
})
export class OFileInputModule { }
