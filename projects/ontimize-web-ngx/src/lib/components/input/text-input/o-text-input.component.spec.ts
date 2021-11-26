import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormGroup, FormControl } from '@angular/forms';
import { OFormComponent } from './../../form/o-form.component';
import { OPermissionsModule } from './../../../services/permissions/o-permissions.module';
import { AppConfig } from './../../../config/app-config';
import { Config } from './../../../types/config.type';
import { HttpClientModule } from '@angular/common/http';
import { INTERNAL_ONTIMIZE_MODULES } from './../../../config/o-modules';
import { TranslateService } from '@ngx-translate/core';
import { Injector } from '@angular/core';
import { OTextInputModule } from './o-text-input.module';
import { OTextInputComponent } from './o-text-input.component';
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { APP_CONFIG } from '../../../config/app-config';
import { appConfigFactory } from '../../../services';

describe('OTextInput', () => {
  let component: OTextInputComponent;
  let fixture: ComponentFixture<OTextInputComponent>;

  let formGroup: FormGroup;

  const config: Config = {
    uuid: 'com.ontimize.web.test',
    title: 'Ontimize Web Testing',
    locale: 'en'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        OTextInputModule,
        HttpClientModule,
        OPermissionsModule,
        NoopAnimationsModule
      ],
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateService,
          deps: [Injector]
        },
        { provide: APP_CONFIG, useValue: config },
        { provide: AppConfig, useFactory: appConfigFactory, deps: [Injector] }
        // ...INTERNAL_ONTIMIZE_MODULES
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OTextInputComponent);
    component = fixture.componentInstance;
    spyOn(component, 'getAttribute').and.returnValue('my-comp');

    formGroup = new FormGroup({});
    const control: FormControl = component.getControl();
    if (control) {
      formGroup.registerControl(component.getAttribute(), control);
    }

    spyOn(component, 'getFormGroup').and.returnValue(formGroup);
    fixture.detectChanges();
  }));

  it('should create the component', async(() => {
    // const fixture = TestBed.createComponent(OTextInputComponent);
    // console.log(fixture);
    // // debugger;
    // const app = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  }));

  it('should create FormControl', async(() => {
    const fControl = component.getFormControl();
    expect(fControl).toBeTruthy();

    component.required = true;
    component.minLength = 2;
    component.maxLength = 10;
    fixture.detectChanges();
    const validators = component.resolveValidators();
    expect(validators).toBeTruthy();
    expect(validators.length).toBe(3);

  }));

  // it(`should have as label 'my-label'`, async(() => {
  //   component.olabel = 'my-label';
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('mat-label').textContent).toBe('my-label');
  // }));

  // it('should render title in a h1 tag', async(() => {
  //   const fixture = TestBed.createComponent(OTableComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('app works!');
  // }));
});
