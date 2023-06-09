import { DragDropModule } from '@angular/cdk/drag-drop';
import { ObserversModule } from '@angular/cdk/observers';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { OSharedModule } from '../../shared/shared.module';
import { OContextMenuModule } from '../contextmenu/o-context-menu.module';
import { OTableColumnCalculatedComponent } from './column/calculated/o-table-column-calculated.component';
import { O_TABLE_CELL_EDITORS } from './column/cell-editor/cell-editor';
import { O_TABLE_CELL_RENDERERS } from './column/cell-renderer/cell-renderer';
import { OTableColumnComponent } from './column/o-table-column.component';
import { OTableContextMenuComponent } from './extensions/contextmenu/o-table-context-menu.component';
import { O_TABLE_DIALOGS } from './extensions/dialog/o-table-dialog-components';
import { OTableExportButtonComponent } from './extensions/export-button/o-table-export-button.component';
import { OTableExportButtonService } from './extensions/export-button/o-table-export-button.service';
import { OTableColumnAggregateComponent } from './extensions/footer/aggregate/o-table-column-aggregate.component';
import { OTableExpandedFooterDirective } from './extensions/footer/expanded/o-table-expanded-footer.directive';
import { O_TABLE_FOOTER_COMPONENTS } from './extensions/footer/o-table-footer-components';
import { OTableMatPaginatorIntl } from './extensions/footer/paginator/o-table-mat-paginator-intl';
import { O_TABLE_HEADER_COMPONENTS, O_TABLE_HEADER_COMPONENTS_EXPORTED } from './extensions/header/o-table-header-components';
import { OTableRowClassPipe } from './extensions/pipes/o-table-row-class.pipe';
import { OTableRowDirective } from './extensions/row/o-table-row.directive';
import { OMatSortModule } from './extensions/sort/o-mat-sort-module';
import { OTableComponent } from './o-table.component';
import { OTableRowExpandableComponent } from './extensions/row/table-row-expandable/o-table-row-expandable.component';
import { PortalModule } from '@angular/cdk/portal';
import { ODualListSelectorModule } from '../dual-list-selector/o-dual-list-selector.module';
import { ODataToolbarModule } from '../o-data-toolbar/o-data-toolbar.module';

@NgModule({
    declarations: [
        OTableComponent,
        OTableColumnComponent,
        OTableColumnCalculatedComponent,
        OTableContextMenuComponent,
        OTableRowDirective,
        OTableExpandedFooterDirective,
        OTableExportButtonComponent,
        OTableRowClassPipe,
        ...O_TABLE_CELL_RENDERERS,
        ...O_TABLE_CELL_EDITORS,
        ...O_TABLE_DIALOGS,
        ...O_TABLE_HEADER_COMPONENTS,
        ...O_TABLE_FOOTER_COMPONENTS,
        OTableRowExpandableComponent
    ],
    imports: [
        CommonModule,
        OSharedModule,
        CdkTableModule,
        DragDropModule,
        PortalModule,
        OContextMenuModule,
        ObserversModule,
        OMatSortModule,
        NgxMaterialTimepickerModule,
        ODualListSelectorModule,
        ODataToolbarModule
    ],
    exports: [
        OTableComponent,
        OTableColumnComponent,
        CdkTableModule,
        OTableColumnCalculatedComponent,
        OTableContextMenuComponent,
        OTableRowDirective,
        OTableExpandedFooterDirective,
        OMatSortModule,
        OTableExportButtonComponent,
        OTableRowClassPipe,
        ...O_TABLE_HEADER_COMPONENTS_EXPORTED,
        ...O_TABLE_CELL_RENDERERS,
        ...O_TABLE_CELL_EDITORS,
        ...O_TABLE_FOOTER_COMPONENTS,
        OTableRowExpandableComponent
    ],
    providers: [
        OTableExportButtonService,
        { provide: MatPaginatorIntl, useClass: OTableMatPaginatorIntl }
    ]
})
export class OTableModule { }
