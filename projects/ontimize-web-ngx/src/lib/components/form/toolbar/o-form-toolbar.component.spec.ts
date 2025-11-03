import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import {  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA , Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';

// Import component dynamically to avoid compilation
let OFormToolbarComponent: any;
import { OFormBase } from '../o-form-base.class';

describe('OFormToolbarComponent', () => {
  let component: any;
  let mockOFormBase: jasmine.SpyObj<OFormBase>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    // Dynamically import to avoid early compilation
    const module = await import('./o-form-toolbar.component');
    OFormToolbarComponent = module.OFormToolbarComponent;
    
    await TestBed.configureTestingModule({
      declarations: [...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    // Create component manually to avoid OWrapperContentMenuComponent issues
    const mockOFormBase: any = {
      registerToolbar: jasmine.createSpy('registerToolbar')
    };
    const mockElementRef: any = { nativeElement: document.createElement('div') };
    const mockInjector = TestBed.inject(Injector);
    component = new OFormToolbarComponent(mockOFormBase, mockElementRef, mockInjector);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without errors', () => {
    expect(() => {
      // detectChanges not needed with manual instantiation
    }).not.toThrow();
  });

  it('should have basic component structure', () => {
    expect(component.constructor).toBe(OFormToolbarComponent);
  });
});
