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
import { Subscription } from 'rxjs/Subscription';

import { OSharedModule } from '../../../shared';
import { InputConverter } from '../../../decorators';
import { OntimizeFileService } from '../../../services';
import { OFormComponent } from '../../form/o-form.component';
import { OFormDataComponent } from '../../o-form-data-component.class';

export interface IFileData {
  name: string;
  size: number;
  type: string;
  lastModifiedDate: Date;
}

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
  'multiple'
];

export const DEFAULT_OUTPUTS_O_FILE_INPUT = [
  'onChange',
  'onUpload'
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
  multiple: boolean = false;

  /* Outputs */
  onChange: EventEmitter<Object> = new EventEmitter<Object>();
  onUpload: EventEmitter<Object> = new EventEmitter<Object>();

  /* Internal variables */
  protected fileService: OntimizeFileService;
  protected uploadSuscription: Subscription;

  /* Data model */
  protected _files: File[] = [];
  protected _filesData: IFileData[] = [];
  protected _remoteFileData: any[];

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
    this._files = [];
    this._filesData = [];
    if (event) {
      let files: FileList = event.target['files'];
      for (var i = 0, f: File; f = files[i]; i++) {
        value += f.name;
        if (i < files.length - 1) {
          value += ', ';
        }
        this._files.push(f);
        this._filesData.push({
          'name': f.name,
          'size': f.size,
          'type': f.type,
          'lastModifiedDate': f.lastModifiedDate
        });
      }
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
      this.upload(this._files);
    }
  }

  clearData() {
    if (!this._isReadOnly && !this.isDisabled) {
      this.setValue(undefined);
      this._files = [];
      this._filesData = [];
      this.inputFile.nativeElement.value = '';
      if (this._fControl) {
        this._fControl.markAsTouched();
      }
    }
  }

  upload(files: File[]) {
    if (this.fileService === undefined) {
      console.warn('No service configured! aborting upload');
      return;
    }
    if (this.uploadSuscription) {
      this.uploadSuscription.unsubscribe();
    }
    var self = this;
    this.uploadSuscription = this.fileService.upload(files, this.entity).subscribe(
      resp => {
        if (resp.code === 0) {
          self.remoteFileData = resp.data;
          self.onUpload.emit(resp.data);
        } else {
          console.log('error');
        }
      },
      err => console.log(err)
    );
  }

  get file() {
    return this._files;
  }

  get fileData() {
    return this._filesData;
  }

  get remoteFileData() {
    return this._remoteFileData;
  }

  set remoteFileData(data: any[]) {
    this._remoteFileData = data;
  }

  protected filetypeValidator(control: FormControl) {
    if (control.value && control.value.length > 0 && this.acceptFileType) {
      let regex: RegExp = new RegExp(this.acceptFileType.replace(';', '|'));
      if (!this._filesData.every(file => file.type.match(regex) !== null || file.name.substr(file.name.lastIndexOf('.')).match(regex) !== null)) {
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
      if (!this._filesData.every(file => file.size < this.maxFileSize)) {
        return {
          'fileSize': {
            'maxFileSize': this.maxFileSize
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
