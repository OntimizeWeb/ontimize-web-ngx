import {Http} from '@angular/http';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {
  TranslateModule,
  TranslateLoader,
  TranslateStaticLoader} from 'ng2-translate/ng2-translate';

import { MdButtonModule } from '@angular2-material/button';
import { MdButtonToggleModule } from '@angular2-material/button-toggle';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { MdCardModule } from '@angular2-material/card';
import { MdCoreModule } from '@angular2-material/core';
import { MdGridListModule } from '@angular2-material/grid-list';
import { MdIconModule } from '@angular2-material/icon';
import { MdInputModule } from '@angular2-material/input';
import { MdListModule } from '@angular2-material/list';
import { MdMenuModule } from '@angular2-material/menu';
import { MdProgressBarModule } from '@angular2-material/progress-bar';
import { MdProgressCircleModule } from '@angular2-material/progress-circle';
import { MdRadioModule } from '@angular2-material/radio';
import { MdSidenavModule } from '@angular2-material/sidenav';
import { MdSliderModule } from '@angular2-material/slider';
import { MdSlideToggleModule } from '@angular2-material/slide-toggle';
import { MdTabsModule } from '@angular2-material/tabs';
import { MdToolbarModule } from '@angular2-material/toolbar';
import { MdTooltipModule } from '@angular2-material/tooltip';

import {
  MATERIAL_MODULES
} from '../components/material/ng2-material/index';

import {
  OBarMenuModule,
  OBarMenuGroupModule,
  OBarMenuItemModule,
  OLocaleBarMenuItemModule,
  OBarMenuSeparatorModule,
  OButtonModule,
  OCheckboxModule,
  OComboModule,
  ODialogModule,
  OFormModule,
  OImageModule,
  OCurrencyInputModule,
  ODateInputModule,
  OEmailInputModule,
  OHTMLInputModule,
  OIntegerInputModule,
  OLightTableModule,
  OLightTableButtonPanelModule,
  OLightTableColumnModule,
  OListPickerModule,
  ONIFInputModule,
  OPasswordInputModule,
  OPercentInputModule,
  ORealInputModule,
  OTextInputModule,
  OTextareaInputModule,
  OListModule,
  OListItemModule,
  OSelectableListModule,
  OSelectableListItemModule,
  OSearchInputModule,
  OTableModule,
  OSideMenuModule,
  OSideMenuGroupModule,
  OSideMenuItemModule,
  OLocaleSideMenuItemModule,
  OSideMenuSeparatorModule
} from '../components';

export const ONTIMIZE_MODULES: any = [
  // Standard modules
  BrowserModule,
  FormsModule,
  ReactiveFormsModule,
  HttpModule,

  // Ng2-translate
  TranslateModule.forRoot({
    provide: TranslateLoader,
    useFactory: (http: Http) => new TranslateStaticLoader(http, '/assets/i18n', '.json'),
    deps: [Http]
  }),

  // Material modules
  MdButtonModule.forRoot(),
  MdButtonToggleModule.forRoot(),
  MdCheckboxModule.forRoot(),
  MdCardModule.forRoot(),
  MdCoreModule.forRoot(),
  MdGridListModule.forRoot(),
  MdIconModule.forRoot(),
  MdInputModule.forRoot(),
  MdListModule.forRoot(),
  MdMenuModule.forRoot(),
  MdProgressBarModule.forRoot(),
  MdProgressCircleModule.forRoot(),
  MdRadioModule.forRoot(),
  MdSidenavModule.forRoot(),
  MdSliderModule.forRoot(),
  MdSlideToggleModule.forRoot(),
  MdTabsModule.forRoot(),
  MdToolbarModule.forRoot(),
  MdTooltipModule.forRoot(),

  // Ng2-material
  ...MATERIAL_MODULES,

  // Ontimize modules
  OBarMenuModule.forRoot(),
  OBarMenuGroupModule.forRoot(),
  OBarMenuItemModule.forRoot(),
  OLocaleBarMenuItemModule.forRoot(),
  OBarMenuSeparatorModule.forRoot(),
  OButtonModule.forRoot(),
  OCheckboxModule.forRoot(),
  OComboModule.forRoot(),
  ODialogModule.forRoot(),
  OFormModule.forRoot(),
  OImageModule.forRoot(),
  OCurrencyInputModule.forRoot(),
  ODateInputModule.forRoot(),
  OEmailInputModule.forRoot(),
  OHTMLInputModule.forRoot(),
  OIntegerInputModule.forRoot(),
  OListPickerModule.forRoot(),
  ONIFInputModule.forRoot(),
  OPasswordInputModule.forRoot(),
  OPercentInputModule.forRoot(),
  ORealInputModule.forRoot(),
  OTextInputModule.forRoot(),
  OTextareaInputModule.forRoot(),
  OLightTableModule.forRoot(),
  OLightTableButtonPanelModule.forRoot(),
  OLightTableColumnModule.forRoot(),
  OListModule.forRoot(),
  OListItemModule.forRoot(),
  OSelectableListModule.forRoot(),
  OSelectableListItemModule.forRoot(),
  OSearchInputModule.forRoot(),
  OTableModule.forRoot(),
  OSideMenuModule.forRoot(),
  OSideMenuGroupModule.forRoot(),
  OSideMenuItemModule.forRoot(),
  OLocaleSideMenuItemModule.forRoot(),
  OSideMenuSeparatorModule.forRoot()
];
