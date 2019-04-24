import { ChangeDetectorRef, EventEmitter, Injector, ModuleWithProviders, NgModule, OnDestroy, Pipe, PipeTransform } from '@angular/core';

import { OTranslateService } from '../services';
import { Util } from '../utils';

export interface ITranslatePipeArgument {
  values?: any[];
}

@Pipe({
  name: 'oTranslate',
  pure: false // required to update the value when the promise is resolved
})
export class OTranslatePipe implements PipeTransform, OnDestroy {

  public value: string = '';
  public lastKey: string;
  public lastParams: any;

  public onLanguageChanged: EventEmitter<any>;

  protected oTranslateService: OTranslateService;
  protected _ref: ChangeDetectorRef;

  constructor(protected injector: Injector) {
    this._ref = this.injector.get(ChangeDetectorRef);
    this.oTranslateService = this.injector.get(OTranslateService);
  }

  public ngOnDestroy(): void {
    this._dispose();
  }

  public transform(text: string, args: ITranslatePipeArgument): string {
    if (!text || text.length === 0) {
      return text;
    }

    // if we ask another time for the same key, return the last value
    if (Util.equals(text, this.lastKey) && Util.equals(args, this.lastParams)) {
      return this.value;
    }

    // store the query, in case it changes
    this.lastKey = text;

    // store the params, in case they change
    this.lastParams = args;

    // set the value
    this.updateValue(text);

    // if there is a subscription to onLanguageChanged, clean it
    this._dispose();

    // subscribe to onLanguageChanged event, in case the language changes
    if (!this.onLanguageChanged) {
      this.onLanguageChanged = this.oTranslateService.onLanguageChanged.subscribe(lang => {
        if (this.lastKey) {
          this.lastKey = null; // we want to make sure it doesn't return the same value until it's been updated
          this.updateValue(text);
        }
      });
    }
    return this.value;
  }

  public updateValue(key: string): void {
    const args = Util.isDefined(this.lastParams) ? this.lastParams.values || [] : [];

    const res = this.oTranslateService.get(key, args);
    this.value = res !== undefined ? res : key;
    this.lastKey = key;
    this._ref.markForCheck();
  }

  protected _dispose(): void {
    if (typeof this.onLanguageChanged !== 'undefined') {
      this.onLanguageChanged.unsubscribe();
      this.onLanguageChanged = undefined;
    }
  }

}

@NgModule({
  declarations: [OTranslatePipe],
  imports: [],
  exports: [OTranslatePipe]
})
export class OTranslateModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: OTranslateModule,
      providers: []
    };
  }
}
