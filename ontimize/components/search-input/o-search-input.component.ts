import {
  Component, OnInit, EventEmitter, Injector,
  NgModule,
  ViewEncapsulation
} from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { MdInputModule } from '@angular/material';
import { OTranslateService } from '../../services';
import { OSharedModule } from '../../shared.module';

export const DEFAULT_INPUTS_O_SEARCH_INPUT = [
  'placeholder'
];

export const DEFAULT_OUTPUTS_O_SEARCH_INPUT = [
  'onSearch'
];

@Component({
  selector: 'o-search-input',
  template: require('./o-search-input.component.html'),
  styles: [require('./o-search-input.component.scss')],
  inputs: [
    ...DEFAULT_INPUTS_O_SEARCH_INPUT
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_SEARCH_INPUT
  ],
  encapsulation: ViewEncapsulation.None
})
export class OSearchInputComponent implements OnInit {

  public static DEFAULT_INPUTS_O_SEARCH_INPUT = DEFAULT_INPUTS_O_SEARCH_INPUT;
  public static DEFAULT_OUTPUTS_O_SEARCH_INPUT = DEFAULT_OUTPUTS_O_SEARCH_INPUT;

  placeholder: string = 'SEARCH';

  onSearch: EventEmitter<any> = new EventEmitter<any>();

  private formGroup: FormGroup;
  private term: FormControl;
  private value: string = '';

  private translateService: OTranslateService;

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

  getValue(): string {
    return this.value;
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
  imports: [OSharedModule, FormsModule, ReactiveFormsModule, MdInputModule],
  exports: [OSearchInputComponent],
})
export class OSearchInputModule {
}
