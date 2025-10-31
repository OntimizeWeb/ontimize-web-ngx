import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { OFullScreenDialogComponent } from './fullscreen-dialog.component';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';

describe('OFullScreenDialogComponent', () => {
  let component: OFullScreenDialogComponent;
  let fixture: ComponentFixture<OFullScreenDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<OFullScreenDialogComponent>>;

  beforeEach(async () => {
    // Create mock for MatDialogRef
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [OFullScreenDialogComponent, ...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .overrideComponent(OFullScreenDialogComponent, {
      set: {
        template: '<div></div>' // Override template to avoid nested component issues
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(OFullScreenDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without errors', () => {
    expect(() => {
      fixture.detectChanges();
    }).not.toThrow();
  });

  it('should have basic component structure', () => {
    expect(component).toBeInstanceOf(OFullScreenDialogComponent);
  });
});
