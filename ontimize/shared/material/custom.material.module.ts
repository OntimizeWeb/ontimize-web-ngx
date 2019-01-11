import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Inject, Injectable, NgModule, Optional } from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
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
} from '@angular/material';
import { MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import moment, { Moment } from 'moment';

import { dateFormatFactory } from '../../services/mat-date-formats.factory';
import { OntimizeMatIconRegistry } from '../../services/ontimize-icon-registry.service';

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

  deserialize(value: any): Moment | null {
    let date;
    if (typeof value === 'number') {
      date = moment(value);
    }
    if (date && this.isValid(date)) {
      return date;
    }
    return super.deserialize(value);
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
