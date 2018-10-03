import {
  Component,
  Injector,
  ElementRef,
  OnInit,
  NgModule,
  HostListener,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { OTranslateService } from '../../../services';
import { OSharedModule } from '../../../shared';

export const DEFAULT_INPUTS_O_BAR_MENU_GROUP = [
  // title [string]: menu group title. Default: no value.
  'groupTitle: title',

  // tooltip [string]: menu group tooltip. Default: 'title' value.
  'tooltip',

  // icon [string]: material icon. Default: no value.
  'icon'
];

@Component({
  moduleId: module.id,
  selector: 'o-bar-menu-group',
  templateUrl: './o-bar-menu-group.component.html',
  styleUrls: ['./o-bar-menu-group.component.scss'],
  inputs: DEFAULT_INPUTS_O_BAR_MENU_GROUP,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-bar-menu-group]': 'true'
  }
})
export class OBarMenuGroupComponent implements OnInit {

  public static DEFAULT_INPUTS_O_BAR_MENU_GROUP = DEFAULT_INPUTS_O_BAR_MENU_GROUP;

  protected translateService: OTranslateService;

  protected _groupTitle: string;
  protected _tooltip: string;
  protected _icon: string;
  protected _id: string;

  protected _isHovered: boolean = false;

  @HostListener('mouseover') onMouseover = () => this.isHovered = true;
  @HostListener('mouseout') onMouseout = () => this.isHovered = false;

  constructor(
    protected elRef: ElementRef,
    protected injector: Injector) {
    this.id = 'm_' + String((new Date()).getTime() + Math.random());

    this.translateService = this.injector.get(OTranslateService);
  }

  ngOnInit() {
    if (!this.tooltip) {
      this.tooltip = this.groupTitle;
    }
    if (this.translateService) {
      this.translateService.onLanguageChanged.subscribe(() => {
        this.setDOMTitle();
      });
      this.setDOMTitle();
    }
  }

  setDOMTitle() {
    let tooltip = this.translateService.get(this.tooltip);
    this.elRef.nativeElement.setAttribute('title', tooltip);
  }

  get groupTitle(): string {
    return this._groupTitle;
  }

  set groupTitle(val: string) {
    this._groupTitle = val;
  }

  get tooltip(): string {
    return this._tooltip;
  }

  set tooltip(val: string) {
    this._tooltip = val;
  }

  get icon(): string {
    return this._icon;
  }

  set icon(val: string) {
    this._icon = val;
  }

  get id(): string {
    return this._id;
  }

  set id(val: string) {
    this._id = val;
  }

  get isHovered(): boolean {
    return this._isHovered;
  }

  set isHovered(val: boolean) {
    this._isHovered = val;
  }
}

@NgModule({
  declarations: [OBarMenuGroupComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OBarMenuGroupComponent]
})
export class OBarMenuGroupModule {
}
