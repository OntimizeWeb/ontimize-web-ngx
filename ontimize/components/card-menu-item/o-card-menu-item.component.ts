import { Component, OnInit, ViewEncapsulation, ViewChild, ViewContainerRef, ComponentFactory, AfterViewInit, ComponentFactoryResolver, NgModule, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, Injector, QueryList, ContentChildren, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { InputConverter } from '../../decorators';
import { OTranslateService } from '../../services';
import { OSharedModule } from '../../shared';

export const DEFAULT_INPUTS_O_MENU_CARD = [
  'title',
  'image',
  'icon',
  'tooltip',
  'buttonText : button-text',
  'disabledButton : disabled-button',
  'mainContainerLayout : main-container-layout',
  'secondaryContainerLayout : secondary-container-layout',
  'route',
  'detailComponent : detail-component',
  'detailComponentInputs : detail-component-inputs'
];

export const DEFAULT_OUTPUTS_O_MENU_CARD = [
];

@Component({
  selector: 'o-card-menu-item',
  templateUrl: './o-card-menu-item.component.html',
  styleUrls: ['./o-card-menu-item.component.scss'],
  inputs: DEFAULT_INPUTS_O_MENU_CARD,
  outputs: DEFAULT_OUTPUTS_O_MENU_CARD,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-card-menu-item]': 'true',
    '[class.mat-elevation-z1]': 'true',
    '[class.compact]': '!showSecondaryContainer'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OCardMenuItemComponent implements OnInit, AfterViewInit, OnDestroy {

  public static DEFAULT_INPUTS_O_MENU_CARD = DEFAULT_INPUTS_O_MENU_CARD;
  public static DEFAULT_OUTPUTS_O_MENU_CARD = DEFAULT_OUTPUTS_O_MENU_CARD;

  title: string;
  image: string;
  icon: string;
  tooltip: string;
  buttonText: string;
  @InputConverter()
  disabledButton: boolean = false;
  mainContainerLayout = 'column';
  secondaryContainerLayout = 'column';
  route: string;
  detailComponent: any;
  detailComponentInputs: Object;

  // @ViewChild('menuCardContent', { read: ViewContainerRef })
  // detailComponentContainer: ViewContainerRef;

  protected _detailComponentContainer: ViewContainerRef;

  @ViewChild('menuCardContent', { read: ViewContainerRef })
  set detailComponentContainer(content: ViewContainerRef) {
    this._detailComponentContainer = content;
  }

  get detailComponentContainer() : ViewContainerRef {
    return this._detailComponentContainer;
  }

  protected translateService: OTranslateService;
  protected translateServiceSubscription: Subscription;

  @ContentChildren('.secondary-container')
  secondaryContent: QueryList<any>;

  protected _showSecondaryContainer: boolean = true;

  constructor(
    protected injector: Injector,
    protected router: Router,
    protected actRoute: ActivatedRoute,
    protected resolver: ComponentFactoryResolver,
    protected cd: ChangeDetectorRef,
    protected elRef: ElementRef
  ) {
    this.translateService = this.injector.get(OTranslateService);
    this.translateServiceSubscription = this.translateService.onLanguageChanged.subscribe(() => {
      this.cd.detectChanges();
    });
  }

  ngOnInit() {
    //
  }

  ngAfterViewInit() {
    if (this.detailComponentContainer && this.detailComponent) {
      const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(this.detailComponent);
      const ref = this.detailComponentContainer.createComponent(factory);
      if (this.detailComponentInputs && ref.instance) {
        const keys = Object.keys(this.detailComponentInputs);
        for (let i = 0, len = keys.length; i < len; i++) {
          ref.instance[keys[i]] = this.detailComponentInputs[keys[i]];
        }
      }
    }
    this.showSecondaryContainer = (this.detailComponentContainer && this.detailComponent) || this.secondaryContent.length > 0;
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    if (this.translateServiceSubscription) {
      this.translateServiceSubscription.unsubscribe();
    }
  }

  useImage(): boolean {
    return this.image !== undefined;
  }

  useIcon(): boolean {
    return this.icon !== undefined && this.image === undefined;
  }

  onButtonClick() {
    if (this.route) {
      this.router.navigate([this.route], {
        relativeTo: this.actRoute
      });
    }
  }

  onClick() {
    if (this.buttonText === undefined) {
      this.onButtonClick();
    }
  }

  get showSecondaryContainer(): boolean {
    return this._showSecondaryContainer;
  }

  set showSecondaryContainer(val: boolean) {
    this._showSecondaryContainer = val;
    if (val) {
      this.elRef.nativeElement.classList.remove('compact');
    } else {
      this.elRef.nativeElement.classList.add('compact');
    }
  }

}

@NgModule({
  declarations: [OCardMenuItemComponent],
  imports: [OSharedModule, CommonModule],
  exports: [OCardMenuItemComponent]
})
export class OCardMenuItemModule {
}
