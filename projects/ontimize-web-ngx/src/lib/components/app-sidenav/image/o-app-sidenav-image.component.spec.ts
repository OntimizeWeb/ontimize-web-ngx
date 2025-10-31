import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject } from 'rxjs';

import { OAppSidenavImageComponent } from './o-app-sidenav-image.component';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';
import { OAppSidenavBase } from '../o-app-sidenav-base.class';
import { OAppLayoutBase } from '../../../layouts/app-layout/o-app-layout-base.class';

describe('OAppSidenavImageComponent', () => {
  let component: OAppSidenavImageComponent;
  let fixture: ComponentFixture<OAppSidenavImageComponent>;
  let mockSidenav: jasmine.SpyObj<OAppSidenavBase>;
  let mockAppLayout: jasmine.SpyObj<OAppLayoutBase>;

  beforeEach(async () => {
    // Create mock for OAppSidenavBase
    mockSidenav = jasmine.createSpyObj('OAppSidenavBase', [], {
      onSidenavClosedStart: new Subject(),
      onSidenavOpenedStart: new Subject(),
      sidenav: {
        opened: false
      }
    });

    await TestBed.configureTestingModule({
      declarations: [OAppSidenavImageComponent, ...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        ...OTestingUtils.getCommonTestingModuleConfig().providers,
        { provide: OAppSidenavBase, useValue: mockSidenav },
        { provide: OAppLayoutBase, useValue: mockAppLayout }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(OAppSidenavImageComponent);
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
    expect(component).toBeInstanceOf(OAppSidenavImageComponent);
  });

  it('should set closed image when sidenav is closed', () => {
    component.openedSrc = 'opened.png';
    component.closedSrc = 'closed.png';
    mockSidenav.sidenav.opened = false;
    
    component.updateImage();
    
    expect(component.src).toBe('closed.png');
  });

  it('should set opened image when sidenav is opened', () => {
    component.openedSrc = 'opened.png';
    component.closedSrc = 'closed.png';
    mockSidenav.sidenav.opened = true;
    
    component.updateImage();
    
    expect(component.src).toBe('opened.png');
  });

  it('should show image when src is set', () => {
    component.src = 'test.png';
    expect(component.showImage).toBe(true);
  });

  it('should not show image when src is empty', () => {
    component.src = '';
    expect(component.showImage).toBe(false);
  });
});
