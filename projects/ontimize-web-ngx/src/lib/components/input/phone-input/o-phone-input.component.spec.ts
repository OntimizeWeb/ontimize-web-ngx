import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OPhoneInputComponent } from './o-phone-input.component';

describe('OPhoneInputComponent', () => {
  let component: OPhoneInputComponent;
  let fixture: ComponentFixture<OPhoneInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OPhoneInputComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OPhoneInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
