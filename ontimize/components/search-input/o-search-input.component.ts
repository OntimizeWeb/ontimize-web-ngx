import {
  Component, OnInit, EventEmitter, Injector,
  NgModule,
  ViewEncapsulation
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { OTranslateService } from '../../services';
import { OSharedModule } from '../../shared';

export const DEFAULT_INPUTS_O_SEARCH_INPUT = [
  'placeholder'
];

export const DEFAULT_OUTPUTS_O_SEARCH_INPUT = [
  'onSearch'
];

@Component({
  selector: 'o-search-input',
  templateUrl: './o-search-input.component.html',
  styleUrls: ['./o-search-input.component.scss'],
  inputs: DEFAULT_INPUTS_O_SEARCH_INPUT,
  outputs: DEFAULT_OUTPUTS_O_SEARCH_INPUT,
  encapsulation: ViewEncapsulation.None
})
export class OSearchInputComponent implements OnInit {

  public static DEFAULT_INPUTS_O_SEARCH_INPUT = DEFAULT_INPUTS_O_SEARCH_INPUT;
  public static DEFAULT_OUTPUTS_O_SEARCH_INPUT = DEFAULT_OUTPUTS_O_SEARCH_INPUT;

  protected placeholder: string = 'SEARCH';

  onSearch: EventEmitter<any> = new EventEmitter<any>();

  protected formGroup: FormGroup;
  protected term: FormControl;

  protected translateService: OTranslateService;

  constructor(protected injector: Injector) {
    this.translateService = this.injector.get(OTranslateService);

    this.formGroup = new FormGroup({});
  }

  ngOnInit() {
    this.term = new FormControl();
    this.formGroup.addControl('term', this.term);

    this.term.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .subscribe(term => {
        this.onSearch.emit(term);
      });
  }

  getFormGroup(): FormGroup {
    return this.formGroup;
  }

  getValue(): string {
    return this.term.value;
  }

  getFormControl(): FormControl {
    return this.term;
  }

  get placeHolder(): string {
    if (this.translateService) {
      return this.translateService.get(this.placeholder);
    }
    return this.placeholder;
  }

  set placeHolder(value: string) {
    var self = this;
    window.setTimeout(() => {
      self.placeholder = value;
    }, 0);
  }

}

@NgModule({
  declarations: [OSearchInputComponent],
  imports: [OSharedModule, CommonModule],
  exports: [OSearchInputComponent]
})
export class OSearchInputModule {
}
