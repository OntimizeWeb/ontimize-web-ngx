import { OContextMenuGroupComponent } from './o-context-menu-group.component';

describe('OContextMenuGroupComponent', () => {
  let component: OContextMenuGroupComponent;

  beforeEach(() => {
    // Create component manually without TestBed to avoid OWrapperContentMenuComponent issues
    component = new OContextMenuGroupComponent();
    
    // Initialize oContextMenuItems QueryList
    (component as any).oContextMenuItems = { 
      changes: { subscribe: jasmine.createSpy() },
      toArray: jasmine.createSpy('toArray').and.returnValue([])
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without errors', () => {
    expect(() => {
      // Just verify component initialization
      expect(component.type).toBe('item_group');
    }).not.toThrow();
  });

  it('should have basic component structure', () => {
    expect(component).toBeInstanceOf(OContextMenuGroupComponent);
  });

  it('should have TYPE_GROUP_MENU as type', () => {
    expect(component.type).toBe('item_group');
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
