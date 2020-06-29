import { AfterViewInit, Directive, ElementRef, forwardRef, Inject, Injector, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';

import { OTranslateService } from '../../../../../services/translate/o-translate.service';
import { OTableComponent } from './../../../o-table.component';

@Directive({
  selector: '[oTableExpandedFooter]'
})
export class OTableExpandedFooterDirective implements AfterViewInit {

  private spanMessageNotResults: any;
  private translateService: OTranslateService;
  private tableBody: any;
  private tableHeader: any;
  private tdTableWithMessage: any;
  private onContentChangeSubscription: Subscription;
  private onVisibleColumnsChangeSubscription: Subscription;

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
    this.registerVisibleColumnsChange();
  }

  registerContentChange() {
    /** Create a tr with a td and inside put the message and add to tbody
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
      self.table.cd.detectChanges();
    });
  }

  registerVisibleColumnsChange() {
    const self = this;
    this.onVisibleColumnsChangeSubscription = this.table.onVisibleColumnsChange.subscribe(() => {
      self.updateColspanTd();
    });

  }

  updateMessageNotResults(data) {
    // reset span message
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
      }
      this.spanMessageNotResults = this.renderer.createElement('span');
      let messageNotResults = this.renderer.createText(result);
      this.tdTableWithMessage.setAttribute('colspan', this.tableHeader.querySelectorAll('th').length);
      this.renderer.appendChild(this.spanMessageNotResults, messageNotResults);
      this.renderer.appendChild(this.tdTableWithMessage, this.spanMessageNotResults);
    }
  }

  /* Update colspan in td that show message not results */
  updateColspanTd() {
    if (this.tdTableWithMessage) {
      this.tdTableWithMessage.setAttribute('colspan', this.tableHeader.querySelectorAll('th').length);
    }
  }

  destroy() {
    if (this.onContentChangeSubscription) {
      this.onContentChangeSubscription.unsubscribe();
    }

    if (this.onVisibleColumnsChangeSubscription) {
      this.onVisibleColumnsChangeSubscription.unsubscribe();
    }
  }
}
