import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentDateAdapter } from '../../components/input/date-input/adapter/moment.adapter';
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
  MatSortModule
  // PlatformModule,
  // StyleModule,
  // OverlayModule,
  // PortalModule,
  // RtlModule,
  // A11yModule,
  // MatCommonModule,
  // ObserveContentModule
} from '@angular/material';

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
  MatSortModule
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
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter }
  ]
})
export class OCustomMaterialModule { }
