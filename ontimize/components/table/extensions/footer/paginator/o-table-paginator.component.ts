import {
    Component,
    OnInit,
    Inject,
    Injector,
    Injectable,
    forwardRef
} from '@angular/core';

import { OTranslateService } from '../../../../../services';
import { OTableComponent } from '../../../o-table.component';

import { MdPaginatorIntl } from '@angular/material';

export const DEFAULT_PAGINATOR_TABLE = [
    // page-size [number]: Number of items to display on a page. By default set to 50.
    'pageSize: page-size'
];

@Component({

    selector: 'o-table-paginator',
    templateUrl: './o-table-paginator.component.html',
    styleUrls: ['./o-table-paginator.component.scss'],
    inputs: DEFAULT_PAGINATOR_TABLE
})
export class OTablePaginatorComponent implements OnInit {
    private translateService: OTranslateService;
    protected _pageLenght: number = 0;
    protected _pageIndex: number = 0;
    protected _pageSize: number = 10;
    protected _pageSizeOptions: Array<any>;


    constructor(
        protected injector: Injector,
        @Inject(forwardRef(() => OTableComponent)) protected table: OTableComponent
    ) {
        this.translateService = this.injector.get(OTranslateService);
        this._pageIndex = 0;
        if (this._pageSize <= 0) {
            this._pageSize = this._pageSizeOptions[0];
        }
        this._pageSizeOptions = [10, 25, 50, 100, this.translateService.get('TABLE.SHOW_ALL')];
    }

    ngOnInit() {
        this.table.registerPagination(this);
    }

    get pageLenght(): number {
        return this.pageLenght;
    }

    set pageLenght(value: number) {
        console.log(this._pageSize * this.pageIndex);
        this._pageLenght = value;

    }

    get pageIndex(): number {
      /*  if (+this._pageSize+(this._pageIndex+1) > this._pageLenght) {
            this._pageIndex = 0;
        }*/
        return this._pageIndex;
    }

    set pageIndex(value: number) {
        this._pageIndex = value;
    }

    get pageSize(): number {
        return this._pageSize;
    }

    set pageSize(value: number) {
        this._pageSize = value;
    }

    get pageSizeOptions(): Array<any> {
        return this._pageSizeOptions;
    }

    set pageSizeOptions(value: Array<any>) {
        this._pageSizeOptions = value;
    }



}


@Injectable()
export class OTableMdPaginatorIntl extends MdPaginatorIntl {

    itemsPerPageLabel;
    nextPageLabel;
    previousPageLabel;
    translateService: OTranslateService;

    constructor(protected injector: Injector) {

        super();
        this.translateService = this.injector.get(OTranslateService);
        this.itemsPerPageLabel = this.translateService.get('TABLE.PAGINATE.ITEMSPERPAGELABEL');
        this.nextPageLabel = this.translateService.get('TABLE.PAGINATE.NEXT');
        this.previousPageLabel = this.translateService.get('TABLE.PAGINATE.PREVIOUS');
        this.getRangeLabel = this.getORangeLabel;

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

        //option show all
        if (isNaN(pageSize)) {
            startIndex = 0;
            endIndex = length;
        }

        return `${startIndex + 1} - ${endIndex}  ${this.translateService.get('TABLE.PAGINATE.RANGE_LABELTABLE.PAGINATE.RANGE_LABEL')} ${length}`;
    }

}
