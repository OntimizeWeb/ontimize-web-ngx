import { Directive, ElementRef, Inject, Renderer2, forwardRef } from '@angular/core';

import { Injector } from '@angular/core';
import { OTableComponent } from './table-components';
import { OTranslateService } from '../../services';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[oTableExpandedFooter]'
})
export class OTableExpandedFooter {

  spanMessageNotResults;
  translateService: OTranslateService;
  tableBody: any;
  tableHeader: any;
  tdTableWithMessage;
  protected onContentChangeSubscription: Subscription;

  constructor(
    @Inject(forwardRef(() => OTableComponent)) public table: OTableComponent,
    public element: ElementRef,
    private renderer: Renderer2,
    protected injector: Injector
  ) {
    this.translateService = this.injector.get(OTranslateService);
  }


  ngAfterViewInit() {
    if (this.element.nativeElement.childNodes[2]) {
      this.tableBody = this.element.nativeElement.childNodes[1];
      this.tableHeader = this.element.nativeElement.childNodes[0];
    }
    this.registerContentChange();
  }

  registerContentChange() {
    /**Create a tr with a td and inside put the message and add to tbody
     * <tr><td><span> {message}</span><td><tr>
    */
    let tr = this.renderer.createElement('tr');
    this.tdTableWithMessage = this.renderer.createElement('td');
    this.renderer.addClass(tr, 'o-table-no-results');
    tr.appendChild(this.tdTableWithMessage);
    this.renderer.appendChild(this.tableBody, tr);

    const self = this;
    this.onContentChangeSubscription = this.table.onContentChange.subscribe((data) => {
      self.updateMessageNotResults(data);
    });

  }

  updateMessageNotResults(data) {
    //reset span message
    if (this.spanMessageNotResults) {
      this.renderer.removeChild(this.element.nativeElement, this.spanMessageNotResults);
    }

    //generate new message
    if (data.length === 0) {
      let result = '';
      result = this.translateService.get('TABLE.EMPTY');
      if (this.table.quickFilter && this.table.oTableQuickFilterComponent &&
        this.table.oTableQuickFilterComponent.value && this.table.oTableQuickFilterComponent.value.length > 0) {
        result += this.translateService.get('TABLE.EMPTY_USING_FILTER', [(this.table.oTableQuickFilterComponent.value)]);
        this.spanMessageNotResults = this.renderer.createElement('span');
        let messageNotResults = this.renderer.createText(result);
        this.tdTableWithMessage.setAttribute('colspan', this.tableHeader.querySelectorAll('th').length);
        this.renderer.appendChild(this.spanMessageNotResults, messageNotResults);
        this.renderer.appendChild(this.tdTableWithMessage, this.spanMessageNotResults);
      }
    }
  }

  // updateColspanTr() {
  // TODO
  //LAUNCH  WHEN HAVE OBSERVER OVER VISIBLE COLUMNS
  //   if (this.spanMessageNotResults) {
  //     this.td.setAttribute('colspan', this.tableHeader.querySelectorAll('th').length);
  //     this.renderer.appendChild(this.td, this.spanMessageNotResults);
  //   }
  // }

  destroy() {
    if (this.onContentChangeSubscription) {
      this.onContentChangeSubscription.unsubscribe();
    }
  }
}
