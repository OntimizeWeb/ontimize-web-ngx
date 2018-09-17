import { Component, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, Optional } from '@angular/core';
import { matSortAnimations, MatSortHeader, MatSortHeaderIntl, ArrowViewStateTransition } from '@angular/material';
import { CdkColumnDef } from '@angular/cdk/table';
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
export class OMatSortHeader extends MatSortHeader {

  constructor(public _intl: MatSortHeaderIntl,
    changeDetectorRef: ChangeDetectorRef,
    @Optional() public _sort: OMatSort,
    @Optional() public _cdkColumnDef: CdkColumnDef) {

    super(_intl, changeDetectorRef, _sort, _cdkColumnDef);
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
}
