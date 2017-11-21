import {
    Component,
    OnInit,
    Inject,
    Injector,
    ViewChild,
    Injectable,
    forwardRef,
    TemplateRef
} from '@angular/core';

import { OTranslateService } from '../../../../../services';
import { OTableComponent } from '../../../o-table.component';

import { MdPaginator, MdPaginatorIntl } from '@angular/material';

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
    public pageLenght: number = 0;
    public pageIndex: number = 1;
    public pageSize: number = 10;
    public pageSizeOptions: Array<any>;

    @ViewChild('templateref', { read: TemplateRef }) public templateref: TemplateRef<any>;
    @ViewChild(MdPaginator) mdpaginator: MdPaginator;

    constructor(
        protected injector: Injector,
        @Inject(forwardRef(() => OTableComponent)) protected table: OTableComponent
    ) {
        this.translateService = this.injector.get(OTranslateService);

    }


    ngOnInit() {
        //this.table.mdpaginator = this.mdpaginator;
        this.pageSizeOptions = [10, 25, 50, 100, this.translateService.get('TABLE.SHOW_ALL')];
        //this.pageLenght = this.table.daoTable.data.length;
        if (this.pageSize <= 0) {
            this.pageSize = this.pageSizeOptions[0];
        }
        this.table.rowQuery = this.pageSize;
        this.table.paginationControls = true;
    }
    /*
    ngAfterViewInit() {
        console.log('set data source en el paginator');
        this.table.setDatasource();
    }*/
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
            return `0 de ${length}`;
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

        return `${startIndex + 1} - ${endIndex}  ${this.translateService.get('TABLE.PAGINATE.RANGE_LABEL')} ${length}`;
    }

}
