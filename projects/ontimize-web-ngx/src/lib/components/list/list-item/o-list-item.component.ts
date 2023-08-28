import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  forwardRef,
  Inject,
  Injector,
  Optional,
  QueryList,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MatListItem, MatListItemLine, MatListItemTitle } from '@angular/material/list';

import { Util } from '../../../util/util';
import { OListComponent } from '../o-list.component';
import { ListItem } from './o-list-item';

@Component({
  selector: 'o-list-item',
  templateUrl: './o-list-item.component.html',
  styleUrls: ['./o-list-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-list-item]': 'true'
  }
})
export class OListItemComponent implements ListItem, AfterContentInit {

  public modelData: any;
  public linesNo = 1;

  @ContentChildren(MatListItemLine, { descendants: true }) _lines: QueryList<MatListItemLine>;
  @ContentChildren(MatListItemTitle, { descendants: true }) _titles: QueryList<MatListItemTitle>;


  @ViewChild('innerListItem', { static: true })
  public _innerListItem: MatListItem;


  constructor(
    public elRef: ElementRef,
    protected _renderer: Renderer2,
    protected _injector: Injector,
    protected cd: ChangeDetectorRef,
    @Optional() @Inject(forwardRef(() => OListComponent)) public _list: OListComponent
  ) { }

  public ngAfterContentInit(): void {
    const matLinesRef = this._titles!.length + this._lines!.length;

    const ngAfterContentInitOriginal = this._innerListItem.ngAfterViewInit;
    // eslint-disable-next-line space-before-function-paren
    this._innerListItem.ngAfterViewInit = function () {
      const emptyDiv = this._element.nativeElement.querySelector('.mat-list-text:empty');
      if (emptyDiv) {
        emptyDiv.remove();
      }
      this._lines = matLinesRef;
      ngAfterContentInitOriginal.apply(this);
    };
  }

  public onDetailIconClicked(e?: Event): void {
    if (Util.isDefined(e)) {
      e.stopPropagation();
    }
    this._list.viewDetail(this.modelData);
  }

  public onEditIconClicked(e?: Event): void {
    if (Util.isDefined(e)) {
      e.stopPropagation();
    }
    this._list.editDetail(this.modelData);
  }

  public setItemData(data: any): void {
    if (!Util.isDefined(this.modelData)) {
      this.modelData = data;
      this.cd.detectChanges();
    }
  }

  public getItemData(): any {
    return this.modelData;
  }

  public onCheckboxChange(): void {
    if (this._list.selectable && Util.isDefined(this.modelData)) {
      this._list.setSelected(this.modelData);
    }
  }

  public onCheckboxClicked(event: Event) {
    event.stopPropagation();
  }

  get isSelected(): boolean {
    return this._list.isItemSelected(this.modelData);
  }

}
