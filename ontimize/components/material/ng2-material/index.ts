import {OpaqueToken} from '@angular/core';
import {MdContent} from './components/content/content';
import {
  MdPatternValidator,
  MdMaxLengthValidator,
  MdMinValueValidator,
  MdMaxValueValidator,
  MdNumberRequiredValidator,
  INPUT_VALIDATORS
} from './components/form/validators';
import {Media} from './core/util/media';
import {ViewportHelper, BrowserViewportHelper, NodeViewportHelper} from './core/util/viewport';
import {OverlayContainer} from '@angular/material';

/** Token used to inject the DOM element that serves as the overlay container. */
export declare const OVERLAY_CONTAINER_TOKEN: OpaqueToken;

export * from './components/content/content';
export * from './components/form/validators';
export * from './core/util/media';
export * from './core/util/ink';
export * from './core/util/viewport';
export * from './core/util/animate';

/**
 * Collection of Material Design component directives.
 */
export const MATERIAL_DIRECTIVES: any[] = [
  MdContent,
  MdPatternValidator, MdMaxLengthValidator,
  MdMinValueValidator, MdMaxValueValidator,
  MdNumberRequiredValidator
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
