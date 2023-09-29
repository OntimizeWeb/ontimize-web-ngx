import { Subscription } from 'rxjs';

import { OFileUploader } from './o-file-uploader.class';

export class OFileItem {

  public index: number = void 0;
  public isReady: boolean = false;
  public isUploading: boolean = false;
  public isUploaded: boolean = false;
  public isSuccess: boolean = false;
  public isCancel: boolean = false;
  public isError: boolean = false;
  public progress: number = 0;
  public _uploadSuscription: Subscription;

  protected uploader: OFileUploader;
  protected _file: File;

  constructor(file: File, uploader: OFileUploader) {
    this._file = file;
    this.uploader = uploader;
  }

  public upload(): void {
    this.uploader.uploadItem(this);
  }

  public cancel(): void {
    this.uploader.cancelItem(this);
  }

  public remove(): void {
    this.uploader.removeFile(this);
  }

  public prepareToUpload(): void {
    this.index = this.index || ++this.uploader.nextIndex;
    this.isReady = true;
  }

  get file(): File {
    return this._file;
  }

  get name(): string {
    return this._file.name;
  }

  get size(): number {
    return this._file.size;
  }

  get type(): string {
    return this._file.type;
  }

  get lastModifiedDate(): any {
    return this._file.lastModified;
  }

  public _onBeforeUpload(notify: boolean = true): void {
    this.isReady = true;
    this.isUploading = true;
    this.isUploaded = false;
    this.isSuccess = false;
    this.isCancel = false;
    this.isError = false;
    this.progress = 0;
    if (notify) {
      this.onBeforeUpload();
    }
  }

  public _onProgress(progress: number): void {
    this.progress = progress;
    this.onProgress(progress);
  }

  public _onSuccess(data: any, notify: boolean = true): void {
    this.index = void 0;
    this.isReady = false;
    this.isUploading = false;
    this.isUploaded = true;
    this.isSuccess = true;
    this.isCancel = false;
    this.isError = false;
    this.progress = 100;
    if (notify) {
      this.onSuccess(data);
    }
  }

  public _onError(error: any, notify: boolean = true): void {
    this.index = void 0;
    this.isReady = false;
    this.isUploading = false;
    this.isUploaded = true;
    this.isSuccess = false;
    this.isCancel = false;
    this.isError = true;
    this.progress = 0;
    if (notify) {
      this.onError(error);
    }
  }

  public _onCancel(notify: boolean = true): void {
    this.isReady = false;
    this.isUploading = false;
    this.isUploaded = false;
    this.isSuccess = false;
    this.isCancel = true;
    this.isError = false;
    this.progress = 0;
    this.index = void 0;
    if (notify) {
      this.onCancel();
    }
  }

  public _onComplete(notify: boolean = true): void {
    if (notify) {
      this.onComplete();
    }
  }

  public onBeforeUpload(): any {
    return {};
  }

  public onProgress(progress: number): any {
    return { progress };
  }

  public onSuccess(data: any): any {
    return { data };
  }

  public onError(error: any): any {
    return { error };
  }

  public onCancel(): any {
    return {};
  }

  public onComplete(): any {
    return {};
  }

  get pendingUpload(): boolean {
    return !this.isUploaded && !this.isUploading && !this.isCancel;
   }

}
