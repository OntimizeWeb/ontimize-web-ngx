import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OContextMenuGroupComponent } from './o-context-menu-group.component';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';

describe('OContextMenuGroupComponent', () => {
  let component: OContextMenuGroupComponent;
  let fixture: ComponentFixture<OContextMenuGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OContextMenuGroupComponent, ...OTestingUtils.getCommonDeclarations()],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .overrideComponent(OContextMenuGroupComponent, {
      set: {
        template: '<div></div>' // Override template to avoid ContentChildren issues
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(OContextMenuGroupComponent);
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
    expect(component).toBeInstanceOf(OContextMenuGroupComponent);
  });

  it('should have TYPE_GROUP_MENU as type', () => {
    expect(component.type).toBe('group');
  });

  it('should initialize with empty children array', () => {
    expect(component.children).toBeDefined();
    expect(Array.isArray(component.children)).toBe(true);
    expect(component.children.length).toBe(0);
  });

  it('should have oContextMenuItems QueryList', () => {
    expect(component.oContextMenuItems).toBeDefined();
  });

  it('should unsubscribe on destroy', () => {
    const unsubscribeSpy = spyOn(component['subscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
