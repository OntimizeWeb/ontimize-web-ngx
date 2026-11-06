import { AfterViewInit, Component, ElementRef, forwardRef, Injector, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgClass } from '@angular/common';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioChange, MatRadioGroup, MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';


import { OTranslatePipe } from '../../../pipes/o-translate.pipe';
import { OContextMenuComponent } from '../../contextmenu/o-context-menu.component';
import { OContextMenuDirective } from '../../contextmenu/o-context-menu.directive';
import { OContextMenuItemComponent } from '../../contextmenu/context-menu-item/o-context-menu-item.component';
import { OMatErrorDirective } from '../../../directives/o-mat-error.directive';

import { OntimizeServiceProvider } from '../../../services/factories';
import { Util } from '../../../util/util';
import { OFormValue } from '../../form/o-form-value';
import { OValueChangeEvent } from '../../o-value-change-event.class';
import { OFormServiceComponent } from '../o-form-service-component.class';

export const DEFAULT_INPUTS_O_RADIO = [
  'layout',
  'labelPosition: label-position',
  'labelGap: label-gap'
];


@Component({
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatTooltipModule, OTranslatePipe, OContextMenuDirective, OContextMenuComponent, OContextMenuItemComponent, OMatErrorDirective],
  selector: 'o-radio',
  templateUrl: './o-radio.component.html',
  styleUrls: ['./o-radio.component.scss'],
  inputs: DEFAULT_INPUTS_O_RADIO,
  providers: [
    OntimizeServiceProvider,
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ORadioComponent), multi: true }
  ],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-radio]': 'true'
  }
})
export class ORadioComponent extends OFormServiceComponent implements AfterViewInit, OnDestroy {

  /* Inputs */
  public layout: 'row' | 'column' = 'column';
  public labelPosition: 'before' | 'after' = 'after';
  public labelGap = '8px'
  /* End inputs*/

  value: OFormValue;
  tabsSubscriptions: any;
  @ViewChild(MatRadioGroup) mrg: MatRadioGroup;
  formLayoutManagerTabIndex: number;
  protected groupId: string;

  constructor(
    elRef: ElementRef,
    injector: Injector
  ) {
    super(elRef, injector);
    this.groupId = crypto.randomUUID();
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    if (this.queryOnInit) {
      this.queryData();
    }
    this.updateFormLayoutManagerState();
  }

  updateFormLayoutManagerState() {
    const formLayoutManager = this.form.getFormManager();

    if (formLayoutManager && formLayoutManager.storeState && formLayoutManager.isTabMode() && formLayoutManager.oTabGroup) {
      if (!Util.isDefined(this.formLayoutManagerTabIndex)) {
        const tabGroupData = formLayoutManager.oTabGroup.data;

        const keysValues = this.form.getFormNavigation().getCurrentKeysValues();
        const data = tabGroupData.find(item =>
          Object.entries(keysValues).every(
            ([key, value]) => item.params[key] == value
          ));
        this.formLayoutManagerTabIndex = data?.id;
      }
      this.tabsSubscriptions = formLayoutManager.onSelectedTabChange.subscribe((arg) => {
        if (arg.data.id === this.formLayoutManagerTabIndex) {
          this.mrg.value = this.getValue();
        }
      });
    }
  }


  onMatRadioGroupChange(e: MatRadioChange): void {
    const newValue = e.value;
    this.setValue(newValue, {
      changeType: OValueChangeEvent.USER_CHANGE,
      emitEvent: false,
      emitModelToViewChange: false
    });
  }

  getValueColumn(item: any) {
    if (item && item.hasOwnProperty(this.valueColumn)) {
      let option = item[this.valueColumn];
      if (option === 'undefined') {
        option = null;
      }
      return option;
    }
    return void 0;
  }

  getDescriptionValue() {
    if (Util.isDefined(this.descriptionColArray) && this.descriptionColArray.length) {
      const currItem = this.dataArray.find(e => e[this.valueColumn] === this.getValue());
      if (Util.isDefined(currItem)) {
        return this.descriptionColArray.map(col => (this.translate && this.translateService) ? this.translateService.get(currItem[col]) : currItem[col]).join(this.separator);
      }
    }
    return '';
  }

  public ngOnDestroy(): void {
    super.destroy();

    if (this.tabsSubscriptions) {
      this.tabsSubscriptions.unsubscribe();
    }

  }

}
