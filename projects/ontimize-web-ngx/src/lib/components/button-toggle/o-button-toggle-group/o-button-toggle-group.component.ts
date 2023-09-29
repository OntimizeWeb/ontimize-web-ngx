import {
  AfterViewInit,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ContentChildren,
  EventEmitter,
  forwardRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { MatButtonToggleChange, MatButtonToggleGroup } from '@angular/material/button-toggle';

import { BooleanInputConverter } from '../../../decorators/input-converter';
import { Util } from '../../../util/util';
import { OButtonToggleComponent } from '../o-button-toggle.component';

export const DEFAULT_INPUTS_O_BUTTON_TOGGLE_GROUP = [
  'oattr: attr',
  'name',
  'enabled',
  'layout',
  'multiple',
  'value'
];

export const DEFAULT_OUTPUTS_O_BUTTON_TOGGLE_GROUP = [
  'onChange'
];

@Component({
    selector: 'o-button-toggle-group',
    templateUrl: './o-button-toggle-group.component.html',
    inputs: DEFAULT_INPUTS_O_BUTTON_TOGGLE_GROUP,
    outputs: DEFAULT_OUTPUTS_O_BUTTON_TOGGLE_GROUP,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class.o-button-toggle-group]': 'true'
    }
})
export class OButtonToggleGroupComponent implements AfterViewInit, OnInit {

  public DEFAULT_INPUTS_O_BUTTON_TOGGLE_GROUP = DEFAULT_INPUTS_O_BUTTON_TOGGLE_GROUP;
  public DEFAULT_OUTPUTS_O_BUTTON_TOGGLE_GROUP = DEFAULT_OUTPUTS_O_BUTTON_TOGGLE_GROUP;

  /* Inputs */
  protected oattr: string;
  public name: string;
  get enabled(): boolean {
    if (this._innerButtonToggleGroup instanceof MatButtonToggleGroup) {
      return !this._innerButtonToggleGroup.disabled;
    }
    return true;
  }
  set enabled(val: boolean) {
    if (this._innerButtonToggleGroup instanceof MatButtonToggleGroup) {
      val = Util.parseBoolean(String(val));
      this._innerButtonToggleGroup.disabled = !val;
    }
  }
  protected _enabled: boolean = true;
  public layout: 'row' | 'column' = 'row';
  @BooleanInputConverter()
  public multiple: boolean = false;
  public value: any;
  /* End inputs */

  /* Outputs */
  public onChange: EventEmitter<MatButtonToggleChange> = new EventEmitter();
  /* End outputs */

  @ViewChild(MatButtonToggleGroup)
  protected _innerButtonToggleGroup: MatButtonToggleGroup;
  @ViewChild('childContainer', { read: ViewContainerRef })
  protected _viewContainerRef: ViewContainerRef;
  @ContentChildren(forwardRef(() => OButtonToggleComponent))
  protected _children: QueryList<OButtonToggleComponent>;

  constructor(protected resolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    if (!Util.isDefined(this.name)) {
      this.name = this.oattr;
    }
  }

  ngAfterViewInit(): void {
    this.buildChildren();
    this._children.changes.subscribe(() => this.buildChildren());
  }

  protected buildChildren(): void {
    const factory: ComponentFactory<OButtonToggleComponent> = this.resolver.resolveComponentFactory(OButtonToggleComponent);
    this._viewContainerRef.clear();
    const childList = this._children.map((child) => {
      const componentRef = this._viewContainerRef.createComponent(factory);
      componentRef.instance.oattr = child.oattr;
      componentRef.instance.label = child.label;
      componentRef.instance.icon = child.icon;
      componentRef.instance.iconPosition = child.iconPosition;
      componentRef.instance.checked = child.checked;
      componentRef.instance.enabled = child.enabled;
      componentRef.instance.value = child.value;
      componentRef.instance.name = this.name;
      componentRef.instance.onChange = child.onChange;
      componentRef.changeDetectorRef.detectChanges();
      return componentRef.instance;
    });
    this._innerButtonToggleGroup._buttonToggles.reset(childList.map(c => c._innerButtonToggle));
    this._children.reset(childList);
  }

  getValue(): any {
    return this._innerButtonToggleGroup ? this._innerButtonToggleGroup.value : void 0;
  }

  setValue(val: any): void {
    this._innerButtonToggleGroup.value = val;
  }

}
