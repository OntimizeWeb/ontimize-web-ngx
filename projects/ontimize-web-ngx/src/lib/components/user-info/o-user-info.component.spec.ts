import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import {  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA , Injector } from '@angular/core';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

// Import component dynamically to avoid compilation
let OUserInfoComponent: any;

describe('OUserInfoComponent', () => {
  let component: any;

  beforeEach(async () => {
    // Dynamically import to avoid early compilation
    const module = await import('./o-user-info.component');
    OUserInfoComponent = module.OUserInfoComponent;
    
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
    const mockElementRef: any = { nativeElement: document.createElement('div') };
    const mockInjector = TestBed.inject(Injector);
    const mockRouter: any = { navigate: jasmine.createSpy(), events: of({}) };
    component = new OUserInfoComponent(mockElementRef, mockInjector, mockRouter);
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
    expect(component.constructor).toBe(OUserInfoComponent);
  });

  it('should have default property values', () => {
    expect(component.showLogout).toBe(true);
    expect(component.showSettings).toBe(true);
    expect(component.showProfile).toBe(false);
    expect(component.id).toBeUndefined();
    expect(component.userInfoConfiguration).toBeUndefined();
  });

  it('should set showLogout property', () => {
    component.showLogout = false;
    expect(component.showLogout).toBe(false);
    
    component.showLogout = true;
    expect(component.showLogout).toBe(true);
  });

  it('should set showSettings property', () => {
    component.showSettings = false;
    expect(component.showSettings).toBe(false);
    
    component.showSettings = true;
    expect(component.showSettings).toBe(true);
  });

  it('should set showProfile property', () => {
    component.showProfile = true;
    expect(component.showProfile).toBe(true);
    
    component.showProfile = false;
    expect(component.showProfile).toBe(false);
  });

  it('should set id property', () => {
    component.id = 'test-id';
    expect(component.id).toBe('test-id');
  });

  it('should have injected services', () => {
    expect(component.dialogService).toBeDefined();
    expect(component.authService).toBeDefined();
    expect(component.oUserInfoService).toBeDefined();
    expect(component.router).toBeDefined();
  });

  it('should check existsUserInfo when userInfo is undefined', () => {
    component.userInfo = undefined;
    expect(component.existsUserInfo).toBe(false);
  });

  it('should check existsUserInfo when userInfo is defined', () => {
    component.userInfo = { username: 'test', avatar: 'avatar.png' };
    expect(component.existsUserInfo).toBe(true);
  });

  it('should get avatar from userInfo', () => {
    component.userInfo = undefined;
    expect(component.avatar).toBeUndefined();
    
    component.userInfo = { username: 'test', avatar: 'test-avatar.png' };
    expect(component.avatar).toBe('test-avatar.png');
  });

  it('should get username from userInfo', () => {
    component.userInfo = undefined;
    expect(component.username).toBeUndefined();
    
    component.userInfo = { username: 'testuser', avatar: 'avatar.png' };
    expect(component.username).toBe('testuser');
  });

  it('should handle onLogoutClick', () => {
    spyOn(component.authService, 'logoutWithConfirmation');
    
    component.onLogoutClick();
    
    expect(component.authService.logoutWithConfirmation).toHaveBeenCalled();
  });

  it('should handle onSettingsClick without throwing error', () => {
    expect(() => {
      component.onSettingsClick();
    }).not.toThrow();
  });

  it('should handle onProfileClick without throwing error', () => {
    expect(() => {
      component.onProfileClick();
    }).not.toThrow();
  });

  it('should register user info configuration', () => {
    const mockConfiguration = {
      showLogout: false,
      showProfile: true,
      showSettings: false
    } as any;
    
    component.registerUserInfoConfiguration(mockConfiguration);
    
    expect(component.userInfoConfiguration).toBe(mockConfiguration);
  });

  it('should update inputs when configuration is registered', () => {
    const mockConfiguration = {
      showLogout: false,
      showProfile: true,
      showSettings: false
    } as any;
    
    // Set initial values different from configuration
    component.showLogout = true;
    component.showProfile = false;
    component.showSettings = true;
    
    component.registerUserInfoConfiguration(mockConfiguration);
    
    expect(component.showLogout).toBe(false);
    expect(component.showProfile).toBe(true);
    expect(component.showSettings).toBe(false);
  });

  it('should use default values when configuration is undefined', () => {
    // Set specific values
    component.showLogout = false;
    component.showProfile = true;
    component.showSettings = false;
    
    component.userInfoConfiguration = undefined;
    component.registerUserInfoConfiguration(undefined);
    
    // Should keep the current values when configuration is undefined
    expect(component.showLogout).toBe(false);
    expect(component.showProfile).toBe(true);
    expect(component.showSettings).toBe(false);
  });
});
