import { Injectable, Injector } from '@angular/core';
import { MatLegacyPaginatorIntl as MatPaginatorIntl } from '@angular/material/legacy-paginator';

import { OTranslateService } from '../../../../../services/translate/o-translate.service';

@Injectable()
export class OTableMatPaginatorIntl extends MatPaginatorIntl {

  itemsPerPageLabel;
  nextPageLabel;
  previousPageLabel;
  translateService: OTranslateService;
  protected onLanguageChangeSubscribe: any;

  constructor(protected injector: Injector) {
    super();
    this.translateService = this.injector.get(OTranslateService);
    this.itemsPerPageLabel = this.translateService.get('TABLE.PAGINATE.ITEMSPERPAGELABEL');
    this.nextPageLabel = this.translateService.get('TABLE.PAGINATE.NEXT');
    this.previousPageLabel = this.translateService.get('TABLE.PAGINATE.PREVIOUS');
    this.firstPageLabel = this.translateService.get('TABLE.PAGINATE.FIRST');
    this.lastPageLabel = this.translateService.get('TABLE.PAGINATE.LAST');
    this.getRangeLabel = this.getORangeLabel;

    this.onLanguageChangeSubscribe = this.translateService.onLanguageChanged.subscribe(res => {
      this.itemsPerPageLabel = this.translateService.get('TABLE.PAGINATE.ITEMSPERPAGELABEL');
      this.nextPageLabel = this.translateService.get('TABLE.PAGINATE.NEXT');
      this.previousPageLabel = this.translateService.get('TABLE.PAGINATE.PREVIOUS');
      this.firstPageLabel = this.translateService.get('TABLE.PAGINATE.FIRST');
      this.lastPageLabel = this.translateService.get('TABLE.PAGINATE.LAST');
      this.getRangeLabel = this.getORangeLabel;
      this.changes.next();
    });
  }

  getORangeLabel(page: number, pageSize: number, length: number): string {
    if (!isNaN(pageSize) && (length === 0 || pageSize === 0)) {
      return `0  ${this.translateService.get('TABLE.PAGINATE.RANGE_LABEL')} ${length}`;
    }
    length = Math.max(length, 0);
    let startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    let endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

    // option show all
    if (isNaN(pageSize)) {
      startIndex = 0;
      endIndex = length;
    }

    return `${startIndex + 1} - ${endIndex}  ${this.translateService.get('TABLE.PAGINATE.RANGE_LABEL')} ${length}`;
  }

}
