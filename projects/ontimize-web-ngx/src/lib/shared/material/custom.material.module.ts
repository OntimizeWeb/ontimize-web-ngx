import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MAT_DATE_FORMATS,
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatBadgeModule
} from '@angular/material';

import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { OntimizeMatIconRegistry } from '../../services/ontimize-icon-registry.service';
import { dateFormatFactory } from './date/mat-date-formats.factory';

const MATERIAL_MODULES = [
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatChipsModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
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
  MatMomentDateModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  OverlayModule,
  ScrollingModule,
  MatBadgeModule
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
  imports: [
    CommonModule
  ],
  exports: MATERIAL_MODULES,
  providers: [
    //   {
    //   provide: DateAdapter,
    //   useClass: OntimizeMomentDateAdapter,
    //   deps: [MAT_DATE_LOCALE]
    // },
    {
      provide: MAT_DATE_FORMATS,
      useFactory: dateFormatFactory
    }, {
      provide: OntimizeMatIconRegistry,
      useClass: OntimizeMatIconRegistry
    }]
})
export class OCustomMaterialModule { }
