
import { CdkColumnDef } from '@angular/cdk/table';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Optional, ViewEncapsulation } from '@angular/core';
import { ArrowViewStateTransition, matSortAnimations, MatSortHeader, MatSortHeaderIntl } from '@angular/material/sort';
import { FocusMonitor } from '@angular/cdk/a11y';
import { OMatSort } from './o-mat-sort';

@Component({
  selector: '[o-mat-sort-header]',
  exportAs: 'oMatSortHeader',
  templateUrl: './sort-header.html',
  styleUrls: ['./sort-header.scss'],
  host: {
    '(click)': '_handleClick()',
    '(mouseenter)': '_setIndicatorHintVisible(true)',
    '(longpress)': '_setIndicatorHintVisible(true)',
    '(mouseleave)': '_setIndicatorHintVisible(false)',
    '[attr.aria-sort]': '_getAriaSortAttribute()',
    '[class.mat-sort-header-disabled]': '_isDisabled()',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['disabled'],
  animations: [
    matSortAnimations.indicator,
    matSortAnimations.leftPointer,
    matSortAnimations.rightPointer,
    matSortAnimations.arrowOpacity,
    matSortAnimations.arrowPosition,
    matSortAnimations.allowChildren,
  ]
})
// tslint:disable-next-line: component-class-suffix
export class OMatSortHeader extends MatSortHeader {

  constructor(public _intl: MatSortHeaderIntl,
    changeDetectorRef: ChangeDetectorRef,
    @Optional() public _sort: OMatSort,
    @Inject('MAT_SORT_HEADER_COLUMN_DEF') @Optional()
    public _cdkColumnDef: CdkColumnDef,
    _focusMonitor: FocusMonitor,
    _elementRef: ElementRef<HTMLElement>){

    super(_intl, changeDetectorRef, _sort, _cdkColumnDef, _focusMonitor, _elementRef);
  }

  _handleClick() {
    if (this._isDisabled()) { return; }

    this._sort.addSortColumn(this);

    // Do not show the animation if the header was already shown in the right position.
    if (this._viewState.toState === 'hint' || this._viewState.toState === 'active') {
      this._disableViewStateAnimation = true;
    }

    // If the arrow is now sorted, animate the arrow into place. Otherwise, animate it away into
    // the direction it is facing.
    const viewState: ArrowViewStateTransition = this._isSorted() ?
      { fromState: this._arrowDirection, toState: 'active' } :
      { fromState: 'active', toState: this._arrowDirection };
    this._setAnimationTransitionState(viewState);

    this._showIndicatorHint = false;
  }

  _isSorted() {
    return this._sort.isActive(this) && this._sort.hasDirection(this.id);
  }

  _updateArrowDirection() {
    this._arrowDirection = this._isSorted() ?
      this._sort.directionById[this.id] :
      (this.start || this._sort.start);
  }

  refresh() {
    if (this._sort.isActive(this)) {
      this._setAnimationTransitionState({
        fromState: this._sort.directionById[this.id],
        toState: 'active'
      });
      this._showIndicatorHint = false;
    } else {
      this._viewState.toState = 'active';
      this._intl.changes.next();
    }
  }

  getSortIndicatorNumbered(): string {
    let result = '';
    // if there is only one sorted column the number is not displayed
    if (this._sort.activeArray.length < 2) { return result; }
    const index = this._sort.activeArray.findIndex(x => x.id === this.id);
    if (index > -1) {
      result += index + 1;
    }
    return result;
  }

  getSortIndicatorNumberedClass() {
    return 'o-table-header-indicator-numbered o-mat-sort-indicator-numbered-' + this._arrowDirection;
  }
}
