import { AfterViewInit, Directive, ElementRef, EmbeddedViewRef, Injector, Input, Renderer2, SecurityContext, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { delay, distinctUntilChanged } from 'rxjs/operators';

import { OTranslateService } from '../../../../../services/translate/o-translate.service';
import { Util } from '../../../../../util/util';
import { OTableBase } from '../../../o-table-base.class';

@Directive({
  standalone: true,
  selector: '[oTableExpandedFooter]'
})
export class OTableExpandedFooterDirective implements AfterViewInit {

  private spanMessageNotResults: any;
  private noResultsView: EmbeddedViewRef<any>;
  private translateService: OTranslateService;
  private sanitizer: DomSanitizer;
  private tableBody: any;
  private tdTableWithMessage: any;
  private trNoResults: any;
  private subscription = new Subscription();

  @Input('oTableExpandedFooterColspan')
  set colspan(value: number) {
    this._colspan = value;
    if (this.tdTableWithMessage) {
      this.tdTableWithMessage.setAttribute('colspan', value);
    }
  }
  get colspan(): number {
    return this._colspan;
  }
  private _colspan: number;

  constructor(
    public table: OTableBase,
    public element: ElementRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    protected injector: Injector
  ) {
    this.translateService = this.injector.get(OTranslateService);
    this.sanitizer = this.injector.get(DomSanitizer);
  }

  ngAfterViewInit() {
    // Locate <tbody> by tag name. Indexing childNodes by position is unsafe
    // because text nodes (whitespace) shift the indices depending on how the
    // template is formatted, which previously caused the "no results" row
    // to be appended inside <thead> instead of <tbody>.
    this.tableBody = this.element.nativeElement.querySelector(':scope > tbody');
    this.registerContentChange();
  }

  registerContentChange() {
    // Create a tr with a td and inside put the message and add to tbody
    // <tr><td><span>{message}</span><td><tr>
    this.trNoResults = this.renderer.createElement('tr');
    this.tdTableWithMessage = this.renderer.createElement('td');
    this.renderer.addClass(this.trNoResults, 'o-table-no-results');
    this.renderer.addClass(this.trNoResults, 'mat-mdc-row');
    this.renderer.setStyle(this.trNoResults, 'display', 'none');
    this.trNoResults.appendChild(this.tdTableWithMessage);
    this.renderer.appendChild(this.tableBody, this.trNoResults);

    /* Show/Hide message When the renderer data is changed with static data*/
    this.subscription.add(this.table.onContentChange.pipe(
      distinctUntilChanged((prev, curr) => (prev?.length ?? 0) === (curr?.length ?? 0)),
    ).subscribe(() => {
      this.showMessage(true);
    }));

    /*  Show/Hide message when the quickfilter is changed */
    if (this.table.oTableQuickFilterComponent) {
      this.subscription.add(this.table.oTableQuickFilterComponent.onChange.pipe().subscribe(() => this.showMessage(true)));
    }
  }

  public showMessage(display: boolean): void {
    this.table.cd.detectChanges();
    const hasData = (this.table?.dataSource?.renderedData?.length ?? 0) > 0;

    if (display && !hasData) {
      this.createMessageContent();
      this.renderer.removeStyle(this.trNoResults, 'display');
    } else {
      this.renderer.setStyle(this.trNoResults, 'display', 'none');
      this.removeMessageContent();
    }
  }

  removeMessageContent() {
    if (this.spanMessageNotResults) {
      this.renderer.removeChild(this.tdTableWithMessage, this.spanMessageNotResults);
      this.spanMessageNotResults = null;
    }
    if (this.noResultsView) {
      this.noResultsView.destroy();
      this.noResultsView = null;
    }
  }

  destroy() {
    this.subscription.unsubscribe();
    this.noResultsView?.destroy();
  }

  protected buildMessage(): string {
    if (this.table.noResultsMessage) {
      return this.translateService.get(this.table.noResultsMessage);
    }
    let message = '';
    message = this.translateService.get('TABLE.EMPTY');
    if (this.tableHasQuickFilter() && this.table.oTableQuickFilterComponent.value) {
      message += this.translateService.get('TABLE.EMPTY_USING_FILTER', [(this.table.oTableQuickFilterComponent.value)]);
    }
    return message;
  }

  protected tableHasQuickFilter(): boolean {
    return this.table.quickFilter && Util.isDefined(this.table.oTableQuickFilterComponent);
  }

  protected createMessageContent() {
    this.removeMessageContent();
    if (this.tdTableWithMessage) {
      this.tdTableWithMessage.setAttribute('colspan', this.colspan);
    }

    if (this.table.noResultsTemplate) {
      // Created detached from the DOM at the container's anchor and its root
      // nodes moved into the message <td>; Angular still tracks/checks the
      // view by reference regardless of where its nodes end up in the DOM
      // (the same technique the CDK's TemplatePortal/DomPortalOutlet use).
      this.noResultsView = this.viewContainerRef.createEmbeddedView(this.table.noResultsTemplate);
      this.noResultsView.rootNodes.forEach(node => this.renderer.appendChild(this.tdTableWithMessage, node));
      this.noResultsView.detectChanges();
      return;
    }

    // 1 Build message
    const message = this.buildMessage();
    // 2 Create message
    // Renderer2.setProperty bypasses Angular's automatic template sanitization,
    // so the message is sanitized explicitly before being assigned as innerHTML
    // (same SecurityContext.HTML Angular applies to a plain [innerHTML] binding).
    this.spanMessageNotResults = this.renderer.createElement('span');
    this.renderer.setProperty(this.spanMessageNotResults, 'innerHTML', this.sanitizer.sanitize(SecurityContext.HTML, message) ?? '');
    if (this.tdTableWithMessage) {
      this.renderer.appendChild(this.tdTableWithMessage, this.spanMessageNotResults);
    }
  }

}
