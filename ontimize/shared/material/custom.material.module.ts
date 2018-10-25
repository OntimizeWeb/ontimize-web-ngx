import { NgModule, Injectable, Optional, Inject } from '@angular/core';
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
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS
  // PlatformModule,
  // StyleModule,
  // PortalModule,
  // RtlModule,
  // A11yModule,
  // ObserveContentModule
} from '@angular/material';

import { MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { OverlayModule } from '@angular/cdk/overlay';
import { OntimizeMatIconRegistry } from '../../services/ontimize-icon-registry.service';
import { dateFormatFactory } from '../../services/mat-date-formats.factory';

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
  MatMomentDateModule,
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

@Injectable()
export class OntimizeMomentDateAdapter extends MomentDateAdapter {

  oFormat: string;

  constructor(@Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string) {
    super(dateLocale);
  }

  format(date: any, displayFormat: string): string {
    return super.format(date, this.oFormat || displayFormat);
  }

  parse(value: any, parseFormat: string | string[]): any | null {
    return super.parse(value, this.oFormat || parseFormat);
  }
}

@NgModule({
  imports: [
    CommonModule
  ],
  exports: MATERIAL_MODULES,
  providers: [{
    provide: DateAdapter,
    useClass: OntimizeMomentDateAdapter,
    deps: [MAT_DATE_LOCALE]
  }, {
    provide: MAT_DATE_FORMATS,
    useFactory: dateFormatFactory
  }, {
    provide: OntimizeMatIconRegistry,
    useClass: OntimizeMatIconRegistry
  }]
})
export class OCustomMaterialModule { }
