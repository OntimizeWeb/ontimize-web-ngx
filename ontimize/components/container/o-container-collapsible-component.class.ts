import { ElementRef, forwardRef, Inject, Injector, Optional } from '@angular/core';

import { InputConverter } from '../../decorators/input-converter';
import { OFormComponent } from '../form/form-components';
import { OContainerComponent } from './o-container-component.class';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material';

export const DEFAULT_INPUTS_O_CONTAINER_COLLAPSIBLE = [
  ...OContainerComponent.DEFAULT_INPUTS_O_CONTAINER,
  'expanded',
  'description'
];

export class OContainerCollapsibleComponent extends OContainerComponent {

  public static DEFAULT_INPUTS_O_CONTAINER_COLLAPSIBLE = DEFAULT_INPUTS_O_CONTAINER_COLLAPSIBLE;

  @InputConverter()
  public expanded: boolean = true;
  public description: string;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) protected form: OFormComponent,
    protected elRef: ElementRef,
    protected injector: Injector,
    @Optional() @Inject(MAT_FORM_FIELD_DEFAULT_OPTIONS) protected matFormDefaultOption
  ) {
    super(form, elRef, injector, matFormDefaultOption);
  }

  protected updateOutlineGap(): void {
    if (this.isAppearanceOutline()) {
      const exPanelHeader = this._titleEl ? (this._titleEl as any)._element.nativeElement : null;

      if (!this._containerRef) {
        return;
      }
      const containerOutline = this._containerRef.nativeElement;
      const containerOutlineRect = containerOutline.getBoundingClientRect();
      if (containerOutlineRect.width === 0 && containerOutlineRect.height === 0) {
        return;
      }

      const titleEl = exPanelHeader.querySelector('.o-container-title.mat-expansion-panel-header-title');
      const descrEl = exPanelHeader.querySelector('.mat-expansion-panel-header-description');

      const containerStart = containerOutlineRect.left;
      const descrStart = descrEl.getBoundingClientRect().left;

      let titleWidth = 0;
      if (this.hasHeader()) {
        titleWidth += this.icon ? titleEl.querySelector('mat-icon').offsetWidth : 0; // icon
        titleWidth += this.title ? titleEl.querySelector('span').offsetWidth : 0; // title
        titleWidth = titleWidth === 0 ? 0 : titleWidth + 4;
      }

      let descrWidth = this.description ? descrEl.querySelector('span').offsetWidth + 8 : 0;
      const empty1Width = descrStart - containerStart - 14 - titleWidth - 4;

      const gapTitleEls = containerOutline.querySelectorAll('.o-container-outline-gap-title');
      const gapEmpty1Els = containerOutline.querySelectorAll('.o-container-outline-gap-empty1');
      const gapDescrEls = containerOutline.querySelectorAll('.o-container-outline-gap-description');

      gapTitleEls[0].style.width = `${titleWidth}px`;
      gapEmpty1Els[0].style.width = `${empty1Width}px`;
      gapDescrEls[0].style.width = `${descrWidth}px`;
    }
  }

  protected registerObserver(): void {
    if (this._titleEl) {
      this.titleObserver.observe((this._titleEl as any)._element.nativeElement, {
        childList: true,
        characterData: true,
        subtree: true
      });
    }
  }

}
