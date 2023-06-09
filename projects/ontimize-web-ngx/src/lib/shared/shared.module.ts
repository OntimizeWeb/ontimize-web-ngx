import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ONTIMIZE_DIRECTIVES } from '../config/o-directives';
import { ColumnsFilterPipe } from '../pipes/columns-filter.pipe';
import { OCurrencyPipe } from '../pipes/o-currency.pipe';
import { OIconPipe } from '../pipes/o-icon.pipe';
import { OIntegerPipe } from '../pipes/o-integer.pipe';
import { OMomentPipe } from '../pipes/o-moment.pipe';
import { OPercentPipe } from '../pipes/o-percentage.pipe';
import { ORealPipe } from '../pipes/o-real.pipe';
import { OSafePipe } from '../pipes/o-safe.pipe';
import { OTranslateModule } from '../pipes/o-translate.pipe';
import { OrderByPipe } from '../pipes/order-by.pipe';
import { ODialogComponent } from './components/dialog/o-dialog.component';
import { Error403Component } from './components/error403/o-error-403.component';
import { OLoadFilterDialogComponent } from './components/filter/load-filter/o-load-filter-dialog.component';
import { OStoreFilterDialogComponent } from './components/filter/store-filter/o-store-filter-dialog.component';
import { OSnackBarComponent } from './components/snackbar/o-snackbar.component';
import { OErrorComponent } from './components/validation/o-error.component';
import { OValidatorComponent } from './components/validation/o-validator.component';
import { OCustomMaterialModule } from './material/custom.material.module';

@NgModule({
    imports: [
        CommonModule,
        OTranslateModule,
        FlexLayoutModule,
        OCustomMaterialModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        ColumnsFilterPipe,
        OrderByPipe,
        OIntegerPipe,
        ORealPipe,
        OMomentPipe,
        OCurrencyPipe,
        OPercentPipe,
        OIconPipe,
        OSafePipe,
        ONTIMIZE_DIRECTIVES,
        Error403Component,
        ODialogComponent,
        OErrorComponent,
        OValidatorComponent,
        OSnackBarComponent,
        OLoadFilterDialogComponent,
        OStoreFilterDialogComponent
    ],
    exports: [
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        OTranslateModule,
        ColumnsFilterPipe,
        OrderByPipe,
        OIntegerPipe,
        ORealPipe,
        OMomentPipe,
        OCurrencyPipe,
        OPercentPipe,
        OIconPipe,
        OSafePipe,
        ONTIMIZE_DIRECTIVES,
        OCustomMaterialModule,
        Error403Component,
        OErrorComponent,
        OValidatorComponent,
        OSnackBarComponent,
        OLoadFilterDialogComponent,
        OStoreFilterDialogComponent
    ]
})
export class OSharedModule {
}
