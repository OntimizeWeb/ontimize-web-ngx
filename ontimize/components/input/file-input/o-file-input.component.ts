import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Injector,
  NgModule,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidatorFn } from '@angular/forms/src/directives/validators';

import { OSharedModule } from '../../../shared';
import { InputConverter } from '../../../decorators';
import { OntimizeFileService } from '../../../services';
import { OFormComponent } from '../../form/o-form.component';
import { OFormDataComponent } from '../../o-form-data-component.class';

import { OFileItem } from './o-file-item.class';
import { OFileUploader } from './o-file-uploader.class';

export const DEFAULT_INPUTS_O_FILE_INPUT = [
  'oattr: attr',
  'olabel: label',
  'tooltip',
  'tooltipPosition: tooltip-position',
  'tooltipShowDelay: tooltip-show-delay',
  'oenabled: enabled',
  'orequired: required',
  'service',
  'entity',
  'serviceType : service-type',

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
  'splitUpload: split-upload'
];

export const DEFAULT_OUTPUTS_O_FILE_INPUT = [
  'onChange',
  'onBeforeUpload',
  'onBeforeUploadFile',
  'onProgress',
  'onProgressFile',
  'onCancel',
  'onCancelFile',
  'onUpload',
  'onUploadFile',
  'onComplete',
  'onCompleteFile'
];

@Component({
  selector: 'o-file-input',
  templateUrl: './o-file-input.component.html',
  styleUrls: ['./o-file-input.component.scss'],
  inputs: [
    ...DEFAULT_INPUTS_O_FILE_INPUT
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_FILE_INPUT
  ]
})
export class OFileInputComponent extends OFormDataComponent implements OnDestroy, OnInit {

  public static DEFAULT_INPUTS_O_FILE_INPUT = DEFAULT_INPUTS_O_FILE_INPUT;
  public static DEFAULT_OUTPUTS_O_FILE_INPUT = DEFAULT_OUTPUTS_O_FILE_INPUT;

  /* Inputs */
  public acceptFileType: string;
  public maxFileSize: number;
  protected service: string;
  protected entity: string;
  protected serviceType: string;
  autoBinding: boolean = false;
  @InputConverter()
  showInfo: boolean = false;
  @InputConverter()
  multiple: boolean = false;
  @InputConverter()
  protected maxFiles: number = -1;
  @InputConverter()
  splitUpload: boolean = true;

  /* Outputs */
  onChange: EventEmitter<any> = new EventEmitter<any>();
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

  /* Internal variables */
  uploader: OFileUploader;
  fileService: OntimizeFileService;

  @ViewChild('inputFile')
  private inputFile: ElementRef;

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
  }

  ngOnDestroy() {
    this.destroy();
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
      for (var i = 0, f: File; f = files[i]; i++) {
        let fileItem: OFileItem = new OFileItem(f, this.uploader);
        this.uploader.addFile(fileItem);
      }
      value = this.uploader.files.map(file => file.name).join(', ');
    }
    window.setTimeout(() => {
      this.setValue(value !== '' ? value : undefined);
      if (this._fControl) {
        this._fControl.markAsTouched();
      }
    }, 0);
  }

  onClickClear(e: Event) {
    e.stopPropagation();
    this.clearData();
  }

  onClickUpload(e: Event) {
    e.stopPropagation();
    if (this.isValid) {
      this.upload();
    }
  }

  clearData() {
    if (!this._isReadOnly && !this.isDisabled) {
      this.uploader.clear();
      let value = this.uploader.files.map(file => file.name).join(', ');
      this.setValue(value);
      this.inputFile.nativeElement.value = '';
      if (this._fControl) {
        this._fControl.markAsTouched();
      }
    }
  }

  upload() {
    this.uploader.upload();
  }

  get files() {
    return this.uploader.files;
  }

  protected filetypeValidator(control: FormControl) {
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

  protected maxFileSizeValidator(control: FormControl) {
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

  protected maxFilesValidator(control: FormControl) {
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
  imports: [OSharedModule, CommonModule],
  exports: [OFileInputComponent]
})
export class OFileInputModule {
}
