import { HttpClientModule } from '@angular/common/http';
import { Injector } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormGroup } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService } from '@ngx-translate/core';

import { APP_CONFIG } from '../../../config/app-config';
import { appConfigFactory } from '../../../services';
import { TestUtils } from '../test/test-utils';
import { AppConfig } from './../../../config/app-config';
import { OPermissionsModule } from './../../../services/permissions/o-permissions.module';
import { InputTestUtil } from './../test/input-test-utils';
import { OTextInputComponent } from './o-text-input.component';
import { OTextInputModule } from './o-text-input.module';

describe('OTextInput', () => {
  let component: OTextInputComponent;
  let fixture: ComponentFixture<OTextInputComponent>;

  let formGroup: UntypedFormGroup;

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
        { provide: APP_CONFIG, useValue: TestUtils.mockConfiguration() },
        { provide: AppConfig, useFactory: appConfigFactory, deps: [Injector] }
        // ...INTERNAL_ONTIMIZE_MODULES
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OTextInputComponent);
    component = fixture.componentInstance;
    spyOn(component, 'getAttribute').and.returnValue('my-comp');
    formGroup = InputTestUtil.mockFormGroup(component);
    spyOn(component, 'getFormGroup').and.returnValue(formGroup);
    fixture.detectChanges();
  }));

  it('should create the component', async(() => {
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

  it(`should render label: 'my-label'`, async(() => {
    component.olabel = 'my-label';
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('mat-label').textContent).toBe('my-label');
  }));

});
