import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OExpandableContainerComponent } from './o-expandable-container.component';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OExpandableContainerComponent', () => {
  let component: OExpandableContainerComponent;
  let fixture: ComponentFixture<OExpandableContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OExpandableContainerComponent, ...OTestingUtils.getCommonDeclarations()],
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

    fixture = TestBed.createComponent(OExpandableContainerComponent);
    component = fixture.componentInstance;
    
    // Mock the targets array to avoid forEach error in ngAfterViewInit
    component.targets = [];
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
    expect(component).toBeInstanceOf(OExpandableContainerComponent);
  });
});
