import { FormControl, FormGroup } from '@angular/forms';

import { Config } from './../../../types/config.type';

export class InputTestUtil {

  static mockConfiguration(): Config {
    return {
      uuid: 'com.ontimize.web.test',
      title: 'Ontimize Web Testing',
      locale: 'en'
    }
  }

  static mockFormGroup(component: any): FormGroup {

    const formGroup = new FormGroup({});
    const control: FormControl = component.getControl();
    if (control) {
      formGroup.registerControl(component.getAttribute(), control);
    }

    return formGroup;
  }
}