import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

export class InputTestUtil {

  static mockFormGroup(component: any): UntypedFormGroup {

    const formGroup = new UntypedFormGroup({});
    const control: UntypedFormControl = component.getControl();
    if (control) {
      formGroup.registerControl(component.getAttribute(), control);
    }

    return formGroup;
  }
}