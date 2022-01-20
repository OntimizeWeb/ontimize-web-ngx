import { HttpClientModule } from '@angular/common/http';
import { Injector } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG, AppConfig } from '../../../config/app-config';
import { appConfigFactory, OPermissionsModule } from '../../../services';
import { InputTestUtil } from './../test/input-test-utils';
import { OPhoneInputComponent } from './o-phone-input.component';
import { OPhoneInputModule } from './o-phone-input.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

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
        NoopAnimationsModule
      ],
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateService,
          deps: [Injector]
        },
        { provide: APP_CONFIG, useValue: InputTestUtil.mockConfiguration() },
        { provide: AppConfig, useFactory: appConfigFactory, deps: [Injector] }
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
