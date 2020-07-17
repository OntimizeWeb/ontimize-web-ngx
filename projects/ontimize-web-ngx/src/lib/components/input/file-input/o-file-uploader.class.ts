import { Subscription } from 'rxjs';

import { IFileService } from '../../../interfaces/file-service.interface';
import { Codes } from '../../../util/codes';
import { OFileItem } from './o-file-item.class';

export class OFileUploader {

  public entity: string;
  public files: OFileItem[] = [];
  public isUploading: boolean = false;
  public progress: number = 0;
  public nextIndex: number = 0;
  public splitUpload: boolean = true;
  public data: object;

  protected _uploadSuscription: Subscription;

  constructor(
    protected service: IFileService,
    entity: string
  ) {
    this.entity = entity;
  }

  public addFile(fileItem: OFileItem): void {
    this.files.push(fileItem);
    this.progress = this._getTotalProgress();
  }

  /**
   * Cancels the upload of all files and remove them from the file list.
   */
  clear(): void {
    this.cancel();
    while (this.files.length) {
      this.files[0].remove();
    }
    this.progress = 0;
  }

  /**
   * Removes a file from the file list, it cancels upload if needed.
   * @param value the file to remove
   */
  removeFile(value: any): void {
    const index = this.getIndexOfItem(value);
    const item = this.files[index];
    if (item) {
      if (item.isUploading) {
        item.cancel();
      }
      this.files.splice(index, 1);
      this.progress = this._getTotalProgress();
    }
  }

  public upload(): void {
    this.files.forEach((item: OFileItem) => {
      if (item.pendingUpload) {
        item.prepareToUpload();
      }
    });
    if (this.splitUpload) {
      this.files.forEach((item: OFileItem) => {
        if (item.pendingUpload) {
          this.uploadItem(item);
        }
      });
    } else {
      this.uploadItems(this.files);
    }
  }

  /**
   * Uploads a single file on a single request.
   * @param item the file to upload
   */
  public uploadItem(item: OFileItem): void {
    item.prepareToUpload();
    if (this.isUploading || item.isUploading) {
      return;
    }
    this.isUploading = true;
    item.isUploading = true;

    this._onBeforeUploadItem(item);

    if (this.service === undefined) {
      console.warn('No service configured! aborting upload');
      return;
    }
    if (this._uploadSuscription) {
      this._uploadSuscription.unsubscribe();
    }

    const self = this;
    this._uploadSuscription = item._uploadSuscription = this.service.upload([item], this.entity, this.data).subscribe(
      resp => {
        if (resp.loaded && resp.total) {
          const progress = Math.round(resp.loaded * 100 / resp.total);
          self._onProgressItem(item, progress);
        } else if (resp.code === Codes.ONTIMIZE_SUCCESSFUL_CODE) {
          self._onSuccessItem(item, resp);
        } else {
          console.error('uploadItem error');
          self._onErrorItem(item, 'Unknow error');
        }
      },
      err => self._onErrorItem(item, err),
      () => self._onCompleteItem(item)
    );
  }

  /**
   * Upload a set of files on a single request.
   * @param items the array of files to upload
   */
  public uploadItems(items: OFileItem[]): void {
    if (this.isUploading || items.some(item => item.isUploading)) {
      return;
    }
    this.isUploading = true;

    this._onBeforeUploadAll();

    if (this.service === undefined) {
      console.warn('No service configured! aborting upload');
      return;
    }
    if (this._uploadSuscription) {
      this._uploadSuscription.unsubscribe();
    }

    const self = this;
    this._uploadSuscription = this.service.upload(items, this.entity, this.data).subscribe(resp => {
      if (resp.loaded && resp.total) {
        const progress = Math.round(resp.loaded * 100 / resp.total);
        self._onProgressAll(progress);
      } else if (resp.code === Codes.ONTIMIZE_SUCCESSFUL_CODE) {
        self._onSuccessAll(resp);
      } else {
        console.error('uploadItems error');
      }
    },
      err => self._onErrorAll(err),
      () => self._onCompleteAll()
    );
  }

  /**
   * Cancels the upload of all files.
   */
  public cancel(): void {
    if (this.splitUpload) {
      this.files.forEach(item => item.cancel());
    } else {
      if (this._uploadSuscription) {
        this._uploadSuscription.unsubscribe();
      }
      this._onCancelAll();
      this._onCompleteAll();
    }
  }

  /**
   * Cancels the the file upload.
   * @param value the file to cancel its upload
   */
  public cancelItem(value: OFileItem): void {
    const index = this.getIndexOfItem(value);
    const item = this.files[index];
    if (item && item.isUploading && this.splitUpload) {
      item._uploadSuscription.unsubscribe();
    }
    this._onCancelItem(item);
    this._onCompleteItem(item);
  }

  public getNotUploadedItems(): OFileItem[] {
    return this.files.filter((item: OFileItem) => !item.isUploaded);
  }

  public getIndexOfItem(value: any): number {
    return typeof value === 'number' ? value : this.files.indexOf(value);
  }

  public onBeforeUploadItem(fileItem: OFileItem): any {
    return { fileItem };
  }

  public onBeforeUploadAll(): any {
    return {};
  }

  public onProgressItem(fileItem: OFileItem, progress: any): any {
    return { fileItem, progress };
  }

  public onProgressAll(progress: any): any {
    return { progress };
  }

  public onCancelItem(fileItem: OFileItem): any {
    return { fileItem };
  }

  public onCancelAll(): any {
    return {};
  }

  public onSuccessItem(fileItem: OFileItem, response: any): any {
    return { fileItem, response };
  }

  public onSuccessAll(response: any): any {
    return { response };
  }

  public onErrorItem(fileItem: OFileItem, error: any): any {
    return { fileItem, error };
  }

  public onErrorAll(error: any): any {
    return { error };
  }

  public onCompleteItem(fileItem: OFileItem): any {
    return { fileItem };
  }

  public onCompleteAll(): any {
    return void 0;
  }

  protected _onBeforeUploadItem(item: OFileItem): void {
    item._onBeforeUpload();
    this.onBeforeUploadItem(item);
  }

  protected _onBeforeUploadAll(): void {
    this.files.forEach(item => item._onBeforeUpload(false));
    this.onBeforeUploadAll();
  }

  protected _onProgressItem(item: OFileItem, progress: number): void {
    const total = this._getTotalProgress(progress);
    this.progress = total;
    item._onProgress(progress);
    this.onProgressItem(item, progress);
    this.onProgressAll(total);
  }

  protected _onProgressAll(progress: number): void {
    const total = this._getTotalProgress(progress);
    this.progress = total;
    this.onProgressAll(total);
  }

  protected _onSuccessItem(item: OFileItem, response: any): void {
    item._onSuccess(response);
    this.onSuccessItem(item, response);
  }

  protected _onSuccessAll(response: any): void {
    this.files.forEach(item => item._onSuccess(response, false));
    this.onSuccessAll(response);
  }

  protected _onErrorItem(item: OFileItem, error: any): void {
    item._onError(error);
    this.onErrorItem(item, error);
  }

  protected _onErrorAll(error: any): void {
    this.files.forEach(item => item._onError(error, false));
    this.onErrorAll(error);
  }

  protected _onCancelItem(item: OFileItem): void {
    item._onCancel();
    this.onCancelItem(item);
  }

  protected _onCancelAll(): void {
    this.files.forEach(item => item._onCancel(false));
    this.onCancelAll();
  }

  protected _onCompleteItem(item: OFileItem): void {
    item._onComplete();
    this.onCompleteItem(item);
    const nextItem = this._getReadyItems()[0];
    this.isUploading = false;
    if (nextItem) {
      nextItem.upload();
      return;
    }
    this.onCompleteAll();
    this.progress = this._getTotalProgress();
  }

  protected _onCompleteAll(): void {
    this.files.forEach(item => item._onComplete(false));
    this.isUploading = false;
    this.onCompleteAll();
    this.progress = this._getTotalProgress();
  }

  protected _getReadyItems(): OFileItem[] {
    return this.files
      .filter((item: OFileItem) => (item.isReady && !item.isUploading))
      .sort((item1: OFileItem, item2: OFileItem) => item1.index - item2.index);
  }

  protected _getTotalProgress(value: number = 0): number {
    const notUploaded = this.getNotUploadedItems().length;
    const uploaded = notUploaded ? this.files.length - notUploaded : this.files.length;
    const ratio = this.splitUpload ? 100 / this.files.length : 100;
    const current = value * ratio / 100;
    return Math.round(uploaded * ratio + current);
  }

}
