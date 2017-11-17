import {
    Component,
    OnInit,
    Injector,
    ViewChild
} from '@angular/core';

import { OTranslateService } from '../../../../../services';

import {MdPaginator} from '@angular/material';

export const DEFAULT_PAGINATOR_TABLE = [

    // page-lenght [number]: The length of the total number of items that are being paginated. Defaulted to 0.
    'pageLenght: page-lenght',

    // page-index [number]: The zero-based page index of the displayed list of items. Defaulted to 0.
    'pageIndex: page-index',

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
    public pageIndex: number = 0;
    public pageSize: number = 50;
    public pageSizeOptions: Array<any>;

    @ViewChild(MdPaginator) mdpaginator: MdPaginator;

    constructor(protected injector: Injector) {
        this.translateService = this.injector.get(OTranslateService);

    }


    ngOnInit() {
        this.pageSizeOptions = [10, 25, 50, 100, this.translateService.get('TABLE.SHOW_ALL')];
        console.log('pageLenght',this.pageLenght);
    }
}
