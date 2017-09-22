import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChange,
  Inject,
  Injector,
  ElementRef,
  forwardRef,
  Optional,
  NgModule,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { dataServiceFactory } from '../../services/data-service.provider';
import { OntimizeService } from '../../services';
import { OFormComponent } from '../form/o-form.component';
import { OSharedModule } from '../../shared';
import { OServiceComponent } from '../o-service-component.class';

export const DEFAULT_INPUTS_O_TABLE = [];

export const DEFAULT_OUTPUTS_O_TABLE = [];

@Component({
  selector: 'o-table',
  templateUrl: './o-table.component.html',
  styleUrls: ['./o-table.component.scss'],
  providers: [
    { provide: OntimizeService, useFactory: dataServiceFactory, deps: [Injector] }
  ],
  inputs: DEFAULT_INPUTS_O_TABLE,
  outputs: DEFAULT_OUTPUTS_O_TABLE,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-table]': 'true',
  }
})

export class OTableComponent extends OServiceComponent implements OnInit, OnDestroy, OnChanges {
  constructor(
    injector: Injector,
    elRef: ElementRef,
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent
  ) {
    super(injector, elRef, form);
  }

  ngOnInit(): void {
    // TODO
  }

  ngOnDestroy() {
    // TODO
  }

  ngAfterViewInit() {
    // TODO
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    // TODO
  }
}

@NgModule({
  declarations: [
    OTableComponent
  ],
  imports: [
    CommonModule,
    OSharedModule
  ],
  exports: [
    OTableComponent
  ]
})
export class OTableModule {
}
