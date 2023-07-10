import { AfterViewInit, ElementRef, EventEmitter, Inject, Injector, OnDestroy, Optional, ViewChild, Directive } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MAT_LEGACY_FORM_FIELD_DEFAULT_OPTIONS as MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/legacy-form-field';
import { Subscription } from 'rxjs';

import { InputConverter } from '../../decorators/input-converter';
import { OContainerComponent } from './o-container-component.class';

export const DEFAULT_INPUTS_O_CONTAINER_COLLAPSIBLE = [
  'expanded',
  'description',
  'collapsedHeight: collapsed-height',
  'expandedHeight: expanded-height'
];
export const DEFAULT_OUTPUTS_O_CONTAINER_COLLAPSIBLE = [
  //onClosed: Event emitted every time the component collapsible is closed.
  'onClosed',
  //onOpened: Event emitted every time the component collapsible is opened.
  'onOpened',
  //onAfterCollapse: An event emitted after the body's collapse animation happens.
  'onAfterCollapse',
  //onAfterExpand: An event emitted after the body's expansion animation happens.
  'onAfterExpand'
]

@Directive({
  inputs: DEFAULT_INPUTS_O_CONTAINER_COLLAPSIBLE,
  outputs: DEFAULT_OUTPUTS_O_CONTAINER_COLLAPSIBLE
})
export class OContainerCollapsibleComponent extends OContainerComponent implements AfterViewInit, OnDestroy {

  @InputConverter()
  public expanded: boolean = true;
  public collapsedHeight = '37px';
  public expandedHeight = '37px';
  public description: string;

  onClosed = new EventEmitter<void>();
  onOpened = new EventEmitter<void>();
  onAfterCollapse = new EventEmitter<void>();
  onAfterExpand = new EventEmitter<void>();

  @ViewChild('expPanel') expPanel: MatExpansionPanel; // Used in subcomponents
  @ViewChild('containerContent', { static: true }) protected containerContent: ElementRef;
  @ViewChild('oContainerOutline') protected oContainerOutline: ElementRef;


  protected expPanelSubscriptions: Subscription = new Subscription();

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
    this.subscribeEventsExpPanel();
  }

  subscribeEventsExpPanel() {
    this.expPanelSubscriptions.add(this.expPanel.afterCollapse.subscribe(() => this.onAfterCollapse.emit()));
    this.expPanelSubscriptions.add(this.expPanel.afterExpand.subscribe(() => this.onAfterExpand.emit()));
    this.expPanelSubscriptions.add(this.expPanel.closed.subscribe(() => this.onClosed.emit()));
    this.expPanelSubscriptions.add(this.expPanel.opened.subscribe(() => this.onOpened.emit()));
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
  ngOnDestroy(): void {
    this.expPanelSubscriptions.unsubscribe();
  }

}
