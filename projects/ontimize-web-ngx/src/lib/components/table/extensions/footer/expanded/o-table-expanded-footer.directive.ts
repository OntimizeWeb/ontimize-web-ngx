import { AfterViewInit, Directive, ElementRef, Injector, Input, Renderer2 } from '@angular/core';
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
  private translateService: OTranslateService;
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
    protected injector: Injector
  ) {
    this.translateService = this.injector.get(OTranslateService);
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
      this.createMessageSpan();
      this.renderer.removeStyle(this.trNoResults, 'display');
    } else {
      this.renderer.setStyle(this.trNoResults, 'display', 'none');
      this.removeMessageSpan();
    }
  }

  removeMessageSpan() {
    if (this.spanMessageNotResults) {
      this.renderer.removeChild(this.tdTableWithMessage, this.spanMessageNotResults);
      this.spanMessageNotResults = null;
    }
  }

  destroy() {
    this.subscription.unsubscribe();
  }

  protected buildMessage(): string {
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

  protected createMessageSpan() {
    this.removeMessageSpan();
    // 1 Build message
    const message = this.buildMessage();
    // 2 Create message
    this.spanMessageNotResults = this.renderer.createElement('span');
    const messageNotResults = this.renderer.createText(message);
    if (this.tdTableWithMessage) {
      this.tdTableWithMessage.setAttribute('colspan', this.colspan);
      this.renderer.appendChild(this.spanMessageNotResults, messageNotResults);
      this.renderer.appendChild(this.tdTableWithMessage, this.spanMessageNotResults);
    }
  }

}
