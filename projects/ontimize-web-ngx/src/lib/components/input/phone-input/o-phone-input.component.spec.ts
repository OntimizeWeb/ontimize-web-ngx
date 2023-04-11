import { HttpClientModule } from '@angular/common/http';
import { Injector } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService } from '@ngx-translate/core';

import { APP_CONFIG, AppConfig } from '../../../config/app-config';
import { appConfigFactory, OPermissionsModule } from '../../../services';
import { TestUtils } from '../test/test-utils';
import { InputTestUtil } from './../test/input-test-utils';
import { OPhoneInputComponent } from './o-phone-input.component';
import { OPhoneInputModule } from './o-phone-input.module';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { FakeMatIconRegistry } from '../test/fake-icon-registry';

describe('OPhoneInputComponent', () => {
  let component: OPhoneInputComponent;
  let fixture: ComponentFixture<OPhoneInputComponent>;
  let formGroup: FormGroup;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        OPhoneInputModule,
        HttpClientModule,
        OPermissionsModule,
        NoopAnimationsModule,
        MatIconModule
      ],
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateService,
          deps: [Injector]
        },
        { provide: APP_CONFIG, useValue: TestUtils.mockConfiguration() },
        { provide: AppConfig, useFactory: appConfigFactory, deps: [Injector] },
        { provide: MatIconRegistry, useClass: FakeMatIconRegistry }
        // ...INTERNAL_ONTIMIZE_MODULES
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OPhoneInputComponent);
    component = fixture.componentInstance;
    formGroup = InputTestUtil.mockFormGroup(component);
    spyOn(component, 'getFormGroup').and.returnValue(formGroup);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
