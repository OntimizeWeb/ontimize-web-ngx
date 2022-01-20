import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../../shared/shared.module';

import { NativeElementInjectorDirective } from './directives/native-element-injector.directive';
import { OPhoneInputComponent } from './o-phone-input.component';


@NgModule({
	declarations: [OPhoneInputComponent, NativeElementInjectorDirective],
	imports: [
		CommonModule,
    OSharedModule
  ],
	exports: [OPhoneInputComponent, NativeElementInjectorDirective],
})
export class OPhoneInputModule {

}
