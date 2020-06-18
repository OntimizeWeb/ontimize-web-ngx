import { DragDropModule } from '@angular/cdk/drag-drop';
import { ObserversModule } from '@angular/cdk/observers';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';
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
import { O_TABLE_HEADER_COMPONENTS } from './extensions/header/o-table-header-components';
import { OTableRowClassPipe } from './extensions/pipes/o-table-row-class.pipe';
import { OTableRowDirective } from './extensions/row/o-table-row.directive';
import { OMatSortModule } from './extensions/sort/o-mat-sort-module';
import { OTableComponent } from './o-table.component';

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
    ...O_TABLE_FOOTER_COMPONENTS
  ],
  imports: [
    CommonModule,
    OSharedModule,
    CdkTableModule,
    DragDropModule,
    OContextMenuModule,
    ObserversModule,
    OMatSortModule,
    NgxMaterialTimepickerModule
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
    ...O_TABLE_HEADER_COMPONENTS,
    ...O_TABLE_CELL_RENDERERS,
    ...O_TABLE_CELL_EDITORS,
    ...O_TABLE_FOOTER_COMPONENTS
  ],
  entryComponents: [
    OTableColumnAggregateComponent,
    OTableContextMenuComponent,
    ...O_TABLE_CELL_RENDERERS,
    ...O_TABLE_CELL_EDITORS,
    ...O_TABLE_DIALOGS
  ],
  providers: [
    OTableExportButtonService,
    { provide: MatPaginatorIntl, useClass: OTableMatPaginatorIntl }
  ]
})
export class OTableModule { }
