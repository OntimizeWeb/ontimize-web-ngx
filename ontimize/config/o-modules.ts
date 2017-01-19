import {Http} from '@angular/http';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {
  TranslateModule,
  TranslateLoader,
  TranslateStaticLoader} from 'ng2-translate';

import { MaterialModule } from '@angular/material';

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
  OColumnModule,
  ORowModule,
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

import {
  OSharedModule
} from '../shared.module';

export const ONTIMIZE_MODULES: any = [
  // Standard modules
  BrowserModule,
  FormsModule,
  ReactiveFormsModule,
  HttpModule,

  // Ng2-translate
  TranslateModule.forRoot({
    provide: TranslateLoader,
    useFactory: (http: Http) => new TranslateStaticLoader(http, './assets/i18n', '.json'),
    deps: [Http]
  }),

  // Material modules
  MaterialModule.forRoot(),

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
  OColumnModule.forRoot(),
  ORowModule.forRoot(),
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
  OSideMenuSeparatorModule.forRoot(),
  OSharedModule.forRoot()
];
