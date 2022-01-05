



import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OSharedModule } from '../../../shared/shared.module';

import { NativeElementInjectorDirective } from './directives/native-element-injector.directive';
import { OPhoneInputComponent } from './o-phone-input.component';


@NgModule({
	declarations: [OPhoneInputComponent, NativeElementInjectorDirective],
	imports: [
		CommonModule,
		FormsModule,
    ReactiveFormsModule,
    OSharedModule
  ],
	exports: [OPhoneInputComponent, NativeElementInjectorDirective],
})
export class OPhoneInputModule {

}
