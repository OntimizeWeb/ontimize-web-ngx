import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentDateAdapter } from '../../components/input/date-input/adapter/moment.adapter';
import {
  MdButtonToggleModule,
  MdButtonModule,
  MdCheckboxModule,
  MdDatepickerModule,
  MdRadioModule,
  MdRippleModule,
  MdSelectModule,
  MdSlideToggleModule,
  MdSliderModule,
  MdSidenavModule,
  MdListModule,
  MdGridListModule,
  MdCardModule,
  MdChipsModule,
  MdIconModule,
  MdInputModule,
  MdFormFieldModule,
  MdProgressSpinnerModule,
  MdProgressBarModule,
  MdSnackBarModule,
  MdTabsModule,
  MdToolbarModule,
  MdTooltipModule,
  MdMenuModule,
  MdDialogModule,
  MdAutocompleteModule,
  DateAdapter,
  MdNativeDateModule,
  MdTableModule

  // ,
  // PlatformModule,
  // StyleModule,
  // OverlayModule,
  // PortalModule,
  // RtlModule,
  // A11yModule,
  // MdCommonModule,
  // ObserveContentModule
} from '@angular/material';

const MATERIAL_MODULES = [
  MdAutocompleteModule,
  MdButtonModule,
  MdButtonToggleModule,
  MdCardModule,
  MdChipsModule,
  MdCheckboxModule,
  MdDatepickerModule,
  MdDialogModule,
  MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdFormFieldModule,
  MdListModule,
  MdMenuModule,
  MdProgressBarModule,
  MdProgressSpinnerModule,
  MdRadioModule,
  MdRippleModule,
  MdSelectModule,
  MdSidenavModule,
  MdSliderModule,
  MdSlideToggleModule,
  MdSnackBarModule,
  MdTabsModule,
  MdToolbarModule,
  MdTooltipModule,
  MdNativeDateModule,
  MdTableModule
  // ,
  // OverlayModule,
  // PortalModule,
  // RtlModule,
  // StyleModule,
  // A11yModule,
  // PlatformModule,
  // MdCommonModule,
  // ObserveContentModule
];


@NgModule({
  imports: [
    CommonModule
  ],
  exports: MATERIAL_MODULES,
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter }
  ]
})
export class OCustomMaterialModule { }
