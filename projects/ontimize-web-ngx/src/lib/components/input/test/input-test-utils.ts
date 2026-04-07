import { FormControl, FormGroup } from '@angular/forms';

export class InputTestUtil {

  static mockFormGroup(component: any): FormGroup {

    const formGroup = new FormGroup({});
    const control: FormControl = component.getControl();
    if (control) {
      formGroup.registerControl(component.getAttribute(), control);
    }

    return formGroup;
  }
}