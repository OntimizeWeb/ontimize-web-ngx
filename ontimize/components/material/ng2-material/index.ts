import {OpaqueToken} from '@angular/core';
import {MdContent} from './components/content/content';
import {
  MdDataTable,
  MdDataTableModule,
  MdDataTableHeaderSelectableRow,
  MdDataTableSelectableRow
} from './components/data-table/index';
import {MdDialog, MdDialogTitle, MdDialogActions, MdDialogPortal,
  MdDialogModule} from './components/dialog/index';
import {MdDividerModule, MdDivider} from './components/divider/divider';
import {MdInk} from './components/ink/ink';
import {
  MdPatternValidator,
  MdMaxLengthValidator,
  MdMinValueValidator,
  MdMaxValueValidator,
  MdNumberRequiredValidator,
  INPUT_VALIDATORS
} from './components/form/validators';
import {MdSubheader} from './components/subheader/subheader';
import {Media} from './core/util/media';
import {ViewportHelper, BrowserViewportHelper, NodeViewportHelper} from './core/util/viewport';
import {OverlayContainer} from '@angular2-material/core';
import {MdBackdrop} from './components/backdrop/backdrop';

/** Token used to inject the DOM element that serves as the overlay container. */
export declare const OVERLAY_CONTAINER_TOKEN: OpaqueToken;

export * from './components/backdrop/backdrop';
export * from './components/content/content';
export * from './components/data-table/index';
export * from './components/dialog/index';
export * from './components/divider/divider';
export * from './components/ink/ink';
export * from './components/form/validators';
export * from './components/subheader/subheader';
export * from './core/util/media';
export * from './core/util/ink';
export * from './core/util/viewport';
export * from './core/util/animate';

/**
 * Collection of Material Design component directives.
 */
export const MATERIAL_DIRECTIVES: any[] = [
  MdContent,
  MdDataTable, MdDataTableHeaderSelectableRow, MdDataTableSelectableRow,
  MdDivider,
  MdBackdrop,
  MdDialog, MdDialogActions, MdDialogTitle, MdDialogPortal,
  MdInk,
  MdPatternValidator, MdMaxLengthValidator,
  MdMinValueValidator, MdMaxValueValidator,
  MdNumberRequiredValidator,
  MdSubheader
];

export const MATERIAL_MODULES: any[] = [
  MdDialogModule,
  MdDataTableModule,
  MdDividerModule
];

/**
 * Material Design component providers for use in a Node.JS environment.
 */
export const MATERIAL_NODE_PROVIDERS: any[] = [
  {provide:ViewportHelper, useClass: NodeViewportHelper},
  Media,
  ...INPUT_VALIDATORS
];

let _overlayContainer: OverlayContainer = new OverlayContainer();

/**
 * Material Design component providers for use in the browser.
 */
export const MATERIAL_BROWSER_PROVIDERS: any[] = [
  ...MATERIAL_NODE_PROVIDERS,
  {provide:ViewportHelper, useClass: BrowserViewportHelper},
  // TODO(jd): should this be here? Or in the example app bootstrap?
  {provide:OVERLAY_CONTAINER_TOKEN, useValue: _overlayContainer.getContainerElement()},
];


/**
 * Please use {@see MATERIAL_NODE_PROVIDERS} or {@see MATERIAL_BROWSER_PROVIDERS}
 * as appropriate.
 *
 * @deprecated
 */
export const MATERIAL_PROVIDERS = MATERIAL_BROWSER_PROVIDERS;
