import { AfterViewInit, ElementRef, Inject, Injector, Optional, ViewChild } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatExpansionPanel } from '@angular/material';

import { InputConverter } from '../../decorators/input-converter';
import { DEFAULT_INPUTS_O_CONTAINER, OContainerComponent } from './o-container-component.class';

export const DEFAULT_INPUTS_O_CONTAINER_COLLAPSIBLE = [
  ...DEFAULT_INPUTS_O_CONTAINER,
  'expanded',
  'description',
  'collapsedHeight:collapsed-height',
  'expandedHeight:expanded-height'
];

export class OContainerCollapsibleComponent extends OContainerComponent implements AfterViewInit {

  @InputConverter()
  public expanded: boolean = true;
  public collapsedHeight = '37px';
  public expandedHeight = '37px';
  public description: string;

  @ViewChild('expPanel', { static: false }) expPanel: MatExpansionPanel; // Used in subcomponents
  @ViewChild('containerContent', { static: true }) protected containerContent: ElementRef;
  @ViewChild('oContainerOutline', { static: false }) protected oContainerOutline: ElementRef;

  constructor(
    protected elRef: ElementRef,
    protected injector: Injector,
    @Optional() @Inject(MAT_FORM_FIELD_DEFAULT_OPTIONS) protected matFormDefaultOption
  ) {
    super(elRef, injector, matFormDefaultOption);
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.updateOutlineGap();
  }

  protected updateOutlineGap(): void {
    if (this.isAppearanceOutline()) {
      const exPanelHeader = this._titleEl ? (this._titleEl as any)._element.nativeElement : null;

      if (!this.oContainerOutline) {
        return;
      }
      const containerOutline = this.oContainerOutline.nativeElement;
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

      const labelStart = titleEl.getBoundingClientRect().left;
      const startWidth = labelStart - containerStart - 2;
      const empty1Width = descrStart - containerStart - titleWidth - 24;
      const descrWidth = this.description ? descrEl.querySelector('span').offsetWidth + 8 : 0;

      const startEls = containerOutline.querySelectorAll('.o-container-outline-start');
      const gapTitleEls = containerOutline.querySelectorAll('.o-container-outline-gap-title');
      const gapEmpty1Els = containerOutline.querySelectorAll('.o-container-outline-gap-empty1');
      const gapDescrEls = containerOutline.querySelectorAll('.o-container-outline-gap-description');

      startEls[0].style.width = `${startWidth}px`;
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

  updateInnerHeight(height: number): void {
    if (this.containerContent) {
      this.containerContent.nativeElement.style.height = height;
    }
    if (this.oContainerOutline) {
      this.oContainerOutline.nativeElement.style.height = height;
    }
  }

}
