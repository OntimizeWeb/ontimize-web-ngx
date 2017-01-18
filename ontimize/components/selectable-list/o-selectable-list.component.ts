import {
  Component, Inject, ElementRef, NgZone, Injector, forwardRef, Optional,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
// import {ObservableWrapper} from '../../util/async';

import { MdListModule } from '@angular/material';

import { OntimizeService } from '../../services';
import { OSearchInputModule, OSearchInputComponent } from '../search-input/o-search-input.component';
import { dataServiceFactory } from '../../services/data-service.provider';
import { OListModule, OListComponent, DEFAULT_INPUTS_O_LIST, DEFAULT_OUTPUTS_O_LIST } from '../list/o-list.component';
import { OFormComponent } from '../form/o-form.component';
import { OSelectableListItemModule } from './o-selectable-list-item.component';
import { MdSelectableListItemDirective } from '../../directives/MdSelectableListItemDirective';
import { IList } from '../../interfaces';

export const DEFAULT_INPUTS_O_SELECTABLE_LIST = [
  ...DEFAULT_INPUTS_O_LIST
];

export const DEFAULT_OUTPUTS_O_SELECTABLE_LIST = [
  ...DEFAULT_OUTPUTS_O_LIST
];

@Component({
  selector: 'o-selectable-list',
  templateUrl: 'selectable-list/o-selectable-list.component.html',
  styleUrls: ['selectable-list/o-selectable-list.component.css'],
  providers: [
    { provide: OntimizeService, useFactory: dataServiceFactory, deps: [Injector] }
  ],
  inputs: [
    ...DEFAULT_INPUTS_O_SELECTABLE_LIST
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_SELECTABLE_LIST
  ],
  encapsulation: ViewEncapsulation.None
})
export class OSelectableListComponent extends OListComponent implements IList {

  public static DEFAULT_INPUTS_O_SELECTABLE_LIST = DEFAULT_INPUTS_O_SELECTABLE_LIST;
  public static DEFAULT_OUTPUTS_O_SELECTABLE_LIST = DEFAULT_OUTPUTS_O_SELECTABLE_LIST;

  selected: any[] = [];

  constructor(
    protected _router: Router,
    protected _actRoute: ActivatedRoute,
    public element: ElementRef,
    protected zone: NgZone,
    protected _injector: Injector,
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent) {
    super(_router, _actRoute,element, zone, _injector, form);
  }

  registerListItem(item: MdSelectableListItemDirective) {
    // if (item) {
    //  var self = this;
    //  item.onClick(mdItem => {
    //    self.doListitemClick(mdItem);
    //    ObservableWrapper.callEmit(self.mdClick, mdItem.item);
    //  });
    // }
  }

  registerSearchInput(input: OSearchInputComponent) {
    //Not implmented
  }

  getKeys() {
    return this.dataKeys;
  }

  doListitemClick(mdItem: MdSelectableListItemDirective): void {
    //do nothing
  }

  getSelectedItems(): any[] {
    return this.selected;
  }

  isItemSelected(item) {
    return this.selected.indexOf(item) > -1;
  }

  syncSelected(item) {
    let idx = this.selected.indexOf(item);
    if (idx > -1) {
      this.selected.splice(idx, 1);
    } else {
      this.selected.push(item);
    }
  }

}

@NgModule({
  declarations: [OSelectableListComponent],
  imports: [CommonModule, MdListModule, OSelectableListItemModule, OListModule, OSearchInputModule],
  exports: [OSelectableListComponent],
})
export class OSelectableListModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OSelectableListModule,
      providers: []
    };
  }
}
