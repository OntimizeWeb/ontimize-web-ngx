import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
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
import { MatLine, MatListAvatarCssMatStyler, MatListItem } from '@angular/material';

import { IListItem } from '../../../interfaces/o-list-item.interface';
import { Util } from '../../../util/util';
import { OListComponent } from '../o-list.component';

@Component({
  selector: 'o-list-item',
  templateUrl: './o-list-item.component.html',
  styleUrls: ['./o-list-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-list-item]': 'true'
  }
})
export class OListItemComponent implements IListItem, AfterContentInit {

  public modelData: any;

  @ContentChildren(MatLine)
  protected _lines: QueryList<MatLine>;

  @ViewChild('innerListItem', { static: true })
  protected _innerListItem: MatListItem;

  @ContentChild(MatListAvatarCssMatStyler)
  set _hasAvatar(avatar: MatListAvatarCssMatStyler) {
    const listItemNativeEl = this.elRef.nativeElement.getElementsByTagName('mat-list-item');
    if (listItemNativeEl && listItemNativeEl.length === 1) {
      if ((avatar !== null && avatar !== undefined)) {
        this._renderer.addClass(listItemNativeEl[0], 'mat-list-avatar');
      } else {
        this._renderer.removeClass(listItemNativeEl[0], 'mat-list-avatar');
      }
    }
  }

  constructor(
    public elRef: ElementRef,
    protected _renderer: Renderer2,
    protected _injector: Injector,
    protected cd: ChangeDetectorRef,
    @Optional() @Inject(forwardRef(() => OListComponent)) public _list: OListComponent
  ) { }

  public ngAfterContentInit(): void {
    const matLinesRef = this._lines;

    const ngAfterContentInitOriginal = this._innerListItem.ngAfterContentInit;
    // tslint:disable-next-line: space-before-function-paren
    this._innerListItem.ngAfterContentInit = function () {
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
