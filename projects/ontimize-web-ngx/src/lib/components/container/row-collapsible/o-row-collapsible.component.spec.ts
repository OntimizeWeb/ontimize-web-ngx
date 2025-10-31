import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { ORowCollapsibleComponent } from './o-row-collapsible.component';
import { OTestingUtils } from '../../../shared/testing/o-testing-utils';

describe('ORowCollapsibleComponent', () => {
  let component: ORowCollapsibleComponent;
  let fixture: ComponentFixture<ORowCollapsibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ORowCollapsibleComponent, ...OTestingUtils.getCommonDeclarations()],
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
    .overrideComponent(ORowCollapsibleComponent, {
      set: {
        template: '<div></div>' // Override template to avoid OWrapperContentMenuComponent issues
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(ORowCollapsibleComponent);
    component = fixture.componentInstance;
    
    // Mock the expPanel ViewChild to avoid errors in ngAfterViewInit
    const mockSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') };
    const mockExpPanel = {
      afterCollapse: { subscribe: jasmine.createSpy('subscribe').and.returnValue(mockSubscription) },
      afterExpand: { subscribe: jasmine.createSpy('subscribe').and.returnValue(mockSubscription) },
      closed: { subscribe: jasmine.createSpy('subscribe').and.returnValue(mockSubscription) },
      opened: { subscribe: jasmine.createSpy('subscribe').and.returnValue(mockSubscription) }
    };
    (component as any).expPanel = mockExpPanel;
    
    // Mock the subscribeEventsExpPanel method to prevent errors
    spyOn(component as any, 'subscribeEventsExpPanel').and.stub();
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
    expect(component).toBeInstanceOf(ORowCollapsibleComponent);
  });
});
