import { Http } from '@angular/http';
import { HttpModule } from '@angular/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


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
  OListItemAvatarModule,
  OListItemTextModule,
  OListItemCardModule,
  OListItemCardImageModule,
  OSearchInputModule,
  OTableModule,
  OSideMenuModule,
  OSideMenuGroupModule,
  OSideMenuItemModule,
  OLocaleSideMenuItemModule,
  OSideMenuSeparatorModule
} from '../components';

import { OSharedModule } from '../shared';

export const INTERNAL_ONTIMIZE_MODULES_EXPORTED: any = [
  // Standard modules
  HttpModule,
  OSharedModule,

  // Ontimize modules
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
  OListPickerModule,
  ONIFInputModule,
  OPasswordInputModule,
  OPercentInputModule,
  ORealInputModule,
  OTextInputModule,
  OTextareaInputModule,
  OLightTableModule,
  OLightTableButtonPanelModule,
  OLightTableColumnModule,
  OListModule,
  OListItemModule,
  OListItemAvatarModule,
  OListItemTextModule,
  OListItemCardModule,
  OListItemCardImageModule,
  OSearchInputModule,
  OTableModule,
  OSideMenuModule,
  OSideMenuGroupModule,
  OSideMenuItemModule,
  OLocaleSideMenuItemModule,
  OSideMenuSeparatorModule
];

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http);
}

export const INTERNAL_ONTIMIZE_MODULES: any = [
  HttpModule,
  // Ngx-translate
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [Http]
    }
  }),

  OSharedModule,

  // Ontimize modules
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
  OListPickerModule,
  ONIFInputModule,
  OPasswordInputModule,
  OPercentInputModule,
  ORealInputModule,
  OTextInputModule,
  OTextareaInputModule,
  OLightTableModule,
  OLightTableButtonPanelModule,
  OLightTableColumnModule,
  OListModule,
  OListItemModule,
  OListItemAvatarModule,
  OListItemTextModule,
  OListItemCardModule,
  OListItemCardImageModule,
  OSearchInputModule,
  OTableModule,
  OSideMenuModule,
  OSideMenuGroupModule,
  OSideMenuItemModule,
  OLocaleSideMenuItemModule,
  OSideMenuSeparatorModule
];

export const ONTIMIZE_MODULES: any = [
  BrowserModule,
  BrowserAnimationsModule
];
