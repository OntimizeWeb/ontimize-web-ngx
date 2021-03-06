import { AfterViewInit, Directive, ElementRef, Injector, Input, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { OTranslateService } from '../../../../../services/translate/o-translate.service';
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

    this.subscription.add(this.table.onDataLoaded.subscribe(() => this.updateMessageNotResults()));
    if (this.table.quickFilter && this.table.hasControls()) {
      this.subscription.add(this.table.oTableQuickFilterComponent.onChange.pipe(filter(qfValue => !!qfValue)).subscribe(() => this.updateMessageNotResults()));
    }
  }

  updateMessageNotResults(): void {
    // reset span message
    if (this.spanMessageNotResults) {
      this.renderer.removeChild(this.element.nativeElement, this.spanMessageNotResults);
    }

    if (this.table.daoTable.data.length === 0) {
      // generate new message
      let message = '';
      message = this.translateService.get('TABLE.EMPTY');
      if (this.table.quickFilter && this.table.oTableQuickFilterComponent && this.table.oTableQuickFilterComponent.value) {
        message += this.translateService.get('TABLE.EMPTY_USING_FILTER', [(this.table.oTableQuickFilterComponent.value)]);
      }

      this.spanMessageNotResults = this.renderer.createElement('span');
      const messageNotResults = this.renderer.createText(message);
      this.tdTableWithMessage.setAttribute('colspan', this.colspan);
      this.renderer.appendChild(this.spanMessageNotResults, messageNotResults);
      this.renderer.appendChild(this.tdTableWithMessage, this.spanMessageNotResults);
    }
  }

  destroy() {
    this.subscription.unsubscribe();
  }

}
