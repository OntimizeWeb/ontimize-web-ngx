import { AfterViewInit, Directive, ElementRef, Injector, Input, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';

import { OTranslateService } from '../../../../../services/translate/o-translate.service';
import { Util } from '../../../../../util/util';
import { OTableComponent } from './../../../o-table.component';

@Directive({
  selector: '[oTableExpandedFooter]'
})
export class OTableExpandedFooterDirective implements AfterViewInit {

  private spanMessageNotResults: any;
  private translateService: OTranslateService;
  private tableBody: any;
  private tdTableWithMessage: any;
  private subscription = new Subscription();

  /**
   * Show/Hide message when the query is launched/callbacked
   */
  @Input('oTableExpandedFooter')
  set display(val: boolean) {
    this.showMessage(val);
  }

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
    public table: OTableComponent,
    public element: ElementRef,
    private renderer: Renderer2,
    protected injector: Injector
  ) {
    this.translateService = this.injector.get(OTranslateService);
  }

  ngAfterViewInit() {
    if (this.element.nativeElement.childNodes[2]) {
      this.tableBody = this.element.nativeElement.childNodes[1];
    }
    this.registerContentChange();
  }

  registerContentChange() {
    // Create a tr with a td and inside put the message and add to tbody
    // <tr><td><span>{message}</span><td><tr>
    const tr = this.renderer.createElement('tr');
    this.tdTableWithMessage = this.renderer.createElement('td');
    this.renderer.addClass(tr, 'o-table-no-results');
    tr.appendChild(this.tdTableWithMessage);
    this.renderer.appendChild(this.tableBody, tr);

    /* Show/Hide message When the renderer data is changed with static data*/
    this.subscription.add(this.table.onContentChange.pipe(
      distinctUntilChanged((prev, curr) => prev.length === curr.length),
      filter(() => !!this.table.staticData)
    ).subscribe(() => this.showMessage(true)));

    /*  Show/Hide message when the quickfilter is changed */
    if (this.table.oTableQuickFilterComponent) {
      this.subscription.add(this.table.oTableQuickFilterComponent.onChange.pipe().subscribe(() => this.showMessage(true)));
    }
  }

  public showMessage(display: boolean): void {
    // reset span message
    this.removeMessageSpan();

    if (display && this.table && this.table.dataSource && this.table.dataSource.renderedData.length === 0) {
      // generate new message
      this.createMessageSpan();
    }
  }


  removeMessageSpan() {
    if (this.spanMessageNotResults) {
      this.renderer.removeChild(this.element.nativeElement, this.spanMessageNotResults);
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
