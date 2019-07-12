import { Component, forwardRef, Inject, ViewEncapsulation } from '@angular/core';
import { DialogPosition } from '@angular/material';
import { InputConverter } from '../../../../decorators/input-converter';
import { OFormLayoutManagerComponent } from '../../o-form-layout-manager.component';

export const DEFAULT_INPUTS_O_FORM_LAYOUT_DIALOG_OPTIONS = [
  'width',
  'minWidth: min-width',
  'maxWidth: max-width',
  'height',
  'minHeight: min-height',
  'maxHeight max-height',
  'class',
  'position',
  'backdropClass: backdrop-class',
  'closeOnNavigation: close-on-navigation',
  'disableClose:disable-close'
];


@Component({
  moduleId: module.id,
  selector: 'o-form-layout-dialog-options',
  template: ' ',
  inputs: DEFAULT_INPUTS_O_FORM_LAYOUT_DIALOG_OPTIONS,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-form-layout-dialog-options]': 'true'
  }
})
export class OFormLayoutDialogOptionsComponent {
  constructor(@Inject(forwardRef(() => OFormLayoutManagerComponent)) protected oFormLayoutManager: OFormLayoutManagerComponent) { }
  public width: string = '';

  public minWidth: number | string;

  public maxWidth: number | string;

  public height: string = '';

  public minHeight: number | string;

  public maxHeight: number | string;

  public class: string | string[] = '';

  public position: DialogPosition;

  public backdropClass: string;

  @InputConverter()
  public closeOnNavigation: boolean = true;

  @InputConverter()
  public disableClose: boolean = true;

}
