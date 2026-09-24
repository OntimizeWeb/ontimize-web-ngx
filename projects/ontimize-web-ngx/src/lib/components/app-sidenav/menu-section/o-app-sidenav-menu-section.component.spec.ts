import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { MenuSection } from '../../../interfaces/app-menu.interface';
import { AppMenuService } from '../../../services/app-menu.service';
import { PermissionsService } from '../../../services/permissions/permissions.service';
import { OPermissions } from '../../../types/o-permissions.type';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';
import { OAppSidenavMenuGroupComponent } from '../menu-group/o-app-sidenav-menu-group.component';
import { OAppSidenavMenuItemComponent } from '../menu-item/o-app-sidenav-menu-item.component';
import { OAppSidenavMenuSectionComponent } from './o-app-sidenav-menu-section.component';

describe('OAppSidenavMenuSectionComponent', () => {

  const MENU_SECTION: MenuSection = {
    id: 'block1',
    name: 'BLOCK_1',
    type: 'section',
    items: [
      { id: 'home', name: 'HOME', icon: 'home', route: '/main/home' },
      { id: 'catalog', name: 'CATALOG', icon: 'menu_book', items: [{ id: 'models', name: 'MODELS', route: '/main/models' }] }
    ]
  };

  let fixture: ComponentFixture<OAppSidenavMenuSectionComponent>;
  let component: OAppSidenavMenuSectionComponent;
  let menuPermissions: OPermissions[];

  const routerStub = { events: new Subject<any>(), url: '/' };
  const permissionsServiceStub = {
    onChangePermissions: new Subject<any>(),
    getAllMenuPermissions: () => menuPermissions,
    getMenuPermissions: (attr: string) => menuPermissions.find(permission => permission.attr === attr)
  };

  const titleElement = (): HTMLElement =>
    fixture.nativeElement.querySelector('.o-app-sidenav-menu-section-title');

  beforeEach(async () => {
    menuPermissions = [];
    await TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports,
        OAppSidenavMenuSectionComponent
      ],
      providers: [
        ...OTestingUtils.getCommonTestingModuleConfig().providers,
        { provide: Router, useValue: routerStub },
        { provide: PermissionsService, useValue: permissionsServiceStub },
        AppMenuService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      // the children are rendered as unknown elements: this spec only covers the section itself
      .overrideComponent(OAppSidenavMenuSectionComponent, {
        remove: { imports: [OAppSidenavMenuItemComponent, OAppSidenavMenuGroupComponent] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(OAppSidenavMenuSectionComponent);
    component = fixture.componentInstance;
    component.menuSection = MENU_SECTION;
  });

  it('should render the section title and its entries when the sidenav is opened', () => {
    component.sidenavOpened = true;
    fixture.detectChanges();

    expect(titleElement()).toBeTruthy();
    expect(titleElement().textContent.trim()).toContain('BLOCK_1');
    expect(fixture.nativeElement.querySelectorAll('o-app-sidenav-menu-item').length).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('o-app-sidenav-menu-group').length).toBe(1);
  });

  it('should replace the title by a separator when the sidenav is collapsed', () => {
    component.sidenavOpened = false;
    fixture.detectChanges();

    expect(titleElement()).toBeNull();
    expect(fixture.nativeElement.querySelector('.o-app-sidenav-menu-section-divider')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('o-app-sidenav-menu-item').length).toBe(1);
  });

  it('should not render anything when the section is hidden by permissions', () => {
    menuPermissions = [{ attr: 'block1', visible: false, enabled: true }];
    fixture.detectChanges();

    expect(component.hidden).toBe(true);
    expect(titleElement()).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('o-app-sidenav-menu-item').length).toBe(0);
  });

  it('should ignore the "enabled" permission', () => {
    menuPermissions = [{ attr: 'block1', visible: true, enabled: false }];
    fixture.detectChanges();

    expect(component.hidden).toBe(false);
    expect(titleElement()).toBeTruthy();
  });

  it('should not render the entries hidden by the menu configuration', () => {
    component.menuSection = {
      ...MENU_SECTION,
      items: [{ id: 'home', name: 'HOME', route: '/main/home', visible: false }]
    };
    fixture.detectChanges();

    expect(titleElement()).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('o-app-sidenav-menu-item').length).toBe(0);
  });

});
