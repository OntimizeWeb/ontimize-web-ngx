import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonToggleModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSliderModule,
  MatSidenavModule,
  MatListModule,
  MatGridListModule,
  MatCardModule,
  MatChipsModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatMenuModule,
  MatDialogModule,
  MatAutocompleteModule,
  DateAdapter,
  MatNativeDateModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MAT_DATE_LOCALE,
  MatIconRegistry
  // PlatformModule,
  // StyleModule,
  // PortalModule,
  // RtlModule,
  // A11yModule,
  // ObserveContentModule
} from '@angular/material';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { OverlayModule } from '@angular/cdk/overlay';
import { OntimizeMatIconRegistry } from '../../services/icon-registry.service';

const MATERIAL_MODULES = [
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatChipsModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatListModule,
  MatMenuModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatNativeDateModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  OverlayModule
  // OverlayModule,
  // PortalModule,
  // RtlModule,
  // StyleModule,
  // A11yModule,
  // PlatformModule,
  // MatCommonModule,
  // ObserveContentModule
];

@NgModule({
  imports: [CommonModule],
  exports: MATERIAL_MODULES,
  providers: [{
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE]
  }, {
    provide: MatIconRegistry,
    useClass: OntimizeMatIconRegistry
  }]
})
export class OCustomMaterialModule { }
