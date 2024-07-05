import { Component, ElementRef, EventEmitter, forwardRef, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { UntypedFormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { BooleanInputConverter, NumberInputConverter } from '../../../decorators/input-converter';
import { IFileService } from '../../../interfaces/file-service.interface';
import { fileServiceFactory } from '../../../services/factories';
import { OntimizeFileService } from '../../../services/ontimize/ontimize-file.service';
import { OConfigureServiceArgs } from '../../../types/configure-service-args.type';
import { FormValueOptions } from '../../../types/form-value-options.type';
import { Util } from '../../../util/util';
import { OFormComponent } from '../../form/o-form.component';
import { OFormDataComponent } from '../../o-form-data-component.class';
import { OValueChangeEvent } from '../../o-value-change-event.class';
import { OFileItem } from './o-file-item.class';
import { OFileUploader } from './o-file-uploader.class';

export const DEFAULT_INPUTS_O_FILE_INPUT = [

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
  'service',
  'entity',
  'serviceType : service-type',
  //  configure-service-args [OConfigureServiceArgs]: Allows configure service .
  'configureServiceArgs: configure-service-args'
];

export const DEFAULT_OUTPUTS_O_FILE_INPUT = [
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
  selector: 'o-file-input',
  templateUrl: './o-file-input.component.html',
  styleUrls: ['./o-file-input.component.scss'],
  inputs: DEFAULT_INPUTS_O_FILE_INPUT,
  outputs: DEFAULT_OUTPUTS_O_FILE_INPUT,
  providers: [
    { provide: OntimizeFileService, useFactory: fileServiceFactory, deps: [Injector] }
  ]
})
export class OFileInputComponent extends OFormDataComponent implements OnInit {

  public arraySeparatorRegExp = new RegExp(/\;/gi);
  public uploader: OFileUploader;
  public fileService: IFileService;
  @ViewChild('inputFile')
  public inputFile: ElementRef;

  public autoBinding: boolean = false;
  public autoRegistering: boolean = false;
  @BooleanInputConverter()
  public showInfo: boolean = false;
  @BooleanInputConverter()
  public multiple: boolean = false;
  @BooleanInputConverter()
  public splitUpload: boolean = true;
  public acceptFileType: string;
  @NumberInputConverter()
  public maxFileSize: number;
  @NumberInputConverter()
  public maxFiles: number = -1;

  public onBeforeUpload: EventEmitter<any> = new EventEmitter<any>();
  public onBeforeUploadFile: EventEmitter<any> = new EventEmitter<any>();
  public onProgress: EventEmitter<any> = new EventEmitter<any>();
  public onProgressFile: EventEmitter<any> = new EventEmitter<any>();
  public onCancel: EventEmitter<any> = new EventEmitter<any>();
  public onCancelFile: EventEmitter<any> = new EventEmitter<any>();
  public onUpload: EventEmitter<any> = new EventEmitter<any>();
  public onUploadFile: EventEmitter<any> = new EventEmitter<any>();
  public onComplete: EventEmitter<any> = new EventEmitter<any>();
  public onCompleteFile: EventEmitter<any> = new EventEmitter<any>();
  public onError: EventEmitter<any> = new EventEmitter<any>();
  public onErrorFile: EventEmitter<any> = new EventEmitter<any>();

  protected service: string;
  protected entity: string;
  protected serviceType: string;
  public configureServiceArgs: OConfigureServiceArgs;
  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector,
  ) {
    super(form, elRef, injector);
  }

  ngOnInit() {
    super.ngOnInit();

    this.initialize();

    this.uploader.onBeforeUploadAll = () => this.onBeforeUpload.emit();
    this.uploader.onBeforeUploadItem = item => this.onBeforeUploadFile.emit(item);
    this.uploader.onProgressAll = progress => this.onProgress.emit(progress);
    this.uploader.onProgressItem = (item, progress) => this.onProgressFile.emit({ item: item, progress: progress });
    this.uploader.onCancelAll = () => this.onCancel.emit();
    this.uploader.onCancelItem = item => this.onCancelFile.emit();
    this.uploader.onSuccessAll = response => this.onUpload.emit({ response: response });
    this.uploader.onSuccessItem = (item, response) => this.onUploadFile.emit({ item: item, response: response });
    this.uploader.onCompleteAll = () => this.onComplete.emit();
    this.uploader.onCompleteItem = item => this.onCompleteFile.emit(item);
    this.uploader.onErrorAll = error => this.onError.emit(error);
    this.uploader.onErrorItem = (item, error) => this.onErrorFile.emit({ item: item, error: error });
  }

  public initialize(): void {
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

  public configureService(): void {
    let configureServiceArgs: OConfigureServiceArgs = { injector: this.injector, baseService: OntimizeFileService, entity: this.entity, service: this.service, serviceType: this.serviceType };
    if (Util.isDefined(this.configureServiceArgs)) {
      configureServiceArgs = { ...configureServiceArgs, ...this.configureServiceArgs };
    }
    this.fileService = Util.configureService(configureServiceArgs);

  }

  public resolveValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = super.resolveValidators();
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

  public fileSelected(event: Event): void {
    let value: string = '';
    if (event) {
      const target: any = event.target || event.srcElement;
      if (target.files.length > 0) {
        const files: FileList = target.files;
        if (!this.multiple) {
          this.uploader.clear();
        }
        for (let i = 0, f: File; i < files.length; i++) {
          f = files[i];
          const fileItem: OFileItem = new OFileItem(f, this.uploader);
          this.uploader.addFile(fileItem);
        }
        value = this.uploader.files.map(file => file.name).join(', ');

        window.setTimeout(() => {
          this.setValue(value !== '' ? value : undefined, { changeType: OValueChangeEvent.USER_CHANGE });
          if (this._fControl) {
            this._fControl.markAsTouched();
          }
        }, 0);
      }
    }
  }

  /**
   * Override super.clearValue();
   */
  public clearValue(options?: FormValueOptions, setDirty: boolean = false): void {
    super.clearValue(options, setDirty);
    this.uploader.clear();
    this.inputFile.nativeElement.value = '';
  }

  public onClickUpload(e: Event): void {
    e.stopPropagation();
    if (this.isValid) {
      this.upload();
    }
  }

  public upload(): void {
    this.uploader.upload();
  }

  get files(): OFileItem[] {
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

  public innerOnChange(event: any): void {
    this.ensureOFormValue(event);
    if (this._fControl && this._fControl.touched) {
      this._fControl.markAsDirty();
    }
    this.onChange.emit(event);
  }

  protected filetypeValidator(control: UntypedFormControl): ValidationErrors {
    if (control.value && control.value.length > 0 && this.acceptFileType) {
      const regex: RegExp = new RegExp(this.acceptFileType.replace(';', '|'));
      if (!this.files.every(file => file.type.match(regex) !== null || file.name.substr(file.name.lastIndexOf('.')).match(regex) !== null)) {
        return {
          fileType: {
            allowedFileTypes: this.acceptFileType.replace(';', ', ')
          }
        };
      }
    }
    return {};
  }

  protected maxFileSizeValidator(control: UntypedFormControl): ValidationErrors {
    if (control.value && control.value.length > 0 && this.maxFileSize) {
      if (!this.files.every(file => file.size < this.maxFileSize)) {
        return {
          fileSize: {
            maxFileSize: this.maxFileSize
          }
        };
      }
    }
    return {};
  }

  protected maxFilesValidator(control: UntypedFormControl): ValidationErrors {
    if (control.value && control.value.length > 0 && this.multiple && this.maxFiles !== -1) {
      if (this.maxFiles < this.files.length) {
        return {
          numFile: {
            maxFiles: this.maxFiles
          }
        };
      }
    }
    return {};
  }
}
